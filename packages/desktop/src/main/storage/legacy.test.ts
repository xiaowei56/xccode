import { afterEach, beforeEach, describe, expect, setSystemTime, test } from "bun:test"
import { mkdtempSync, readdirSync, rmSync, utimesSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { NodeFileSystem, NodePath } from "@effect/platform-node"
import { sql } from "drizzle-orm"
import { Effect, Layer } from "effect"
import { openDatabase } from "./database"
import { importLegacyStores } from "./legacy"

const now = new Date("2026-07-01T00:00:00.000Z")

const day = 24 * 60 * 60 * 1000

const roots: string[] = []

beforeEach(() => setSystemTime(now))

afterEach(() => {
  setSystemTime()

  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function tempRoot() {
  const root = mkdtempSync(path.join(tmpdir(), "xiaochuan-legacy-store-"))
  roots.push(root)

  return root
}

function writeStore(root: string, name: string, value: string, modified = now) {
  writeFileSync(path.join(root, name), value)
  utimesSync(path.join(root, name), modified, modified)
}

const listing = (root: string) => readdirSync(root).sort()

const rows = (db: ReturnType<typeof openDatabase>["db"]) =>
  db.all<{ name: string; key: string; value: string }>(sql`SELECT name, key, value FROM state ORDER BY name, key`)

const run = (db: ReturnType<typeof openDatabase>["db"], root: string) =>
  Effect.runPromise(
    importLegacyStores(db, root).pipe(Effect.provide(Layer.merge(NodeFileSystem.layer, NodePath.layer))),
  )

describe("legacy store import", () => {
  test("copies every namespace into state and removes the files", async () => {
    const root = tempRoot()
    const database = openDatabase(":memory:")
    writeStore(root, "xiaochuan.global.dat", JSON.stringify({ model: "m", layout: { sidebar: 1 } }))
    writeStore(root, "xiaochuan.window.w1.dat", JSON.stringify({ tabs: "[]" }))
    writeStore(root, "default.dat", JSON.stringify({ "settings.v3": "{}" }))
    writeStore(root, "xiaochuan.settings", JSON.stringify({ keep: true }))
    writeStore(root, "unrelated.txt", "x")

    const result = await run(database.db, root)

    expect(result.imported).toBe(4)
    expect(rows(database.db)).toEqual([
      { name: "default.dat", key: "settings.v3", value: "{}" },
      { name: "xiaochuan.global.dat", key: "layout", value: '{"sidebar":1}' },
      { name: "xiaochuan.global.dat", key: "model", value: "m" },
      { name: "xiaochuan.window.w1.dat", key: "tabs", value: "[]" },
    ])
    expect(listing(root)).toEqual(["xiaochuan.settings", "unrelated.txt"])
  })

  test("does not overwrite state that already exists", async () => {
    const root = tempRoot()
    const database = openDatabase(":memory:")
    database.db.run(sql`INSERT INTO state VALUES ('xiaochuan.global.dat', 'model', 'new', 0)`)
    writeStore(root, "xiaochuan.global.dat", JSON.stringify({ model: "old" }))

    await run(database.db, root)

    expect(rows(database.db)).toEqual([{ name: "xiaochuan.global.dat", key: "model", value: "new" }])
    expect(listing(root)).toEqual([])
  })

  test("leaves unreadable files in place", async () => {
    const root = tempRoot()
    const database = openDatabase(":memory:")
    writeStore(root, "xiaochuan.global.dat", "{not json")
    writeStore(root, "xiaochuan.workspace.x.dat", JSON.stringify({ terminal: "{}" }))

    const result = await run(database.db, root)

    expect(result.imported).toBe(1)
    expect(listing(root)).toEqual(["xiaochuan.global.dat"])
  })

  test("applies draft retention: skips empty, stale, and excess draft files", async () => {
    const root = tempRoot()
    const database = openDatabase(":memory:")
    writeStore(root, "xiaochuan.draft.empty.dat", "{}")
    writeStore(
      root,
      "xiaochuan.draft.stale.dat",
      JSON.stringify({ "draft:prompt": "old" }),
      new Date(now.getTime() - 31 * day),
    )
    Array.from({ length: 102 }).forEach((_, index) =>
      writeStore(
        root,
        `xiaochuan.draft.${index}.dat`,
        JSON.stringify({ "draft:prompt": `${index}` }),
        new Date(now.getTime() - index * 1_000),
      ),
    )

    const result = await run(database.db, root)

    expect(result.imported).toBe(100)
    const names = rows(database.db).map((row) => row.name)
    expect(names).toContain("xiaochuan.draft.0.dat")
    expect(names).toContain("xiaochuan.draft.99.dat")
    expect(names).not.toContain("xiaochuan.draft.100.dat")
    expect(names).not.toContain("xiaochuan.draft.101.dat")
    expect(names).not.toContain("xiaochuan.draft.stale.dat")
    expect(names).not.toContain("xiaochuan.draft.empty.dat")
    expect(listing(root)).toEqual([])
  })
})
