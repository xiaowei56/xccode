import path from "path"
import fs from "fs/promises"
import { describe, expect } from "bun:test"
import { Effect, Layer } from "effect"
import { ConfigDiscovery } from "@xiaochuan/core/config/discovery"
import { AppNodeBuilder } from "@xiaochuan/core/effect/app-node-builder"
import { Location } from "@xiaochuan/core/location"
import { AbsolutePath } from "@xiaochuan/core/schema"
import { FSUtil } from "@xiaochuan/util/fs-util"
import { Global } from "@xiaochuan/util/global"
import { location } from "../fixture/location"
import { tmpdir } from "../fixture/tmpdir"
import { testEffect } from "../lib/effect"

const it = testEffect(Layer.empty)

function inFixture(root: string, target: string) {
  const relative = path.relative(root, target)
  return relative === "" || (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
}

function discoverWith(
  root: string,
  directory: string,
  projectDirectory = directory,
  wrapFs?: (base: FSUtil.Interface) => Partial<FSUtil.Interface>,
) {
  const globalDir = path.join(root, "global")
  const fsLayer = wrapFs
    ? Layer.effect(
        FSUtil.Service,
        Effect.map(FSUtil.Service, (base) => FSUtil.Service.of({ ...base, ...wrapFs(base) })),
      ).pipe(Layer.provide(AppNodeBuilder.build(FSUtil.node)))
    : AppNodeBuilder.build(FSUtil.node)

  return ConfigDiscovery.discover({ system: false }).pipe(
    Effect.provide(
      Layer.mergeAll(
        fsLayer,
        Global.layerWith({ config: globalDir, home: path.join(globalDir, "home") }),
        Layer.succeed(
          Location.Service,
          Location.Service.of(
            location(
              { directory: AbsolutePath.make(directory) },
              { projectDirectory: AbsolutePath.make(projectDirectory) },
            ),
          ),
        ),
      ),
    ),
  )
}

describe("ConfigDiscovery.discover", () => {
  it.live("skips resolve and stat calls for absent ancestor candidates while keeping watch paths", () =>
    Effect.acquireDisposable(Effect.promise(() => tmpdir())).pipe(
      Effect.flatMap((tmp) =>
        Effect.gen(function* () {
          const root = yield* Effect.promise(() => fs.realpath(tmp.path))
          const ancestor = path.join(root, "ws", "org", "repo")
          const nested = path.join(ancestor, "packages", "feature")
          yield* Effect.promise(async () => {
            await fs.mkdir(path.join(ancestor, ".xiaochuan"), { recursive: true })
            await fs.mkdir(nested, { recursive: true })
            await fs.writeFile(path.join(nested, "xiaochuan.json"), "{}")
          })

          const resolved: string[] = []
          const dirChecks: string[] = []
          const sources = yield* discoverWith(root, nested, ancestor, (base) => ({
            resolve: (input) => {
              resolved.push(input)
              return base.resolve(input)
            },
            isDir: (input) => {
              dirChecks.push(input)
              return base.isDir(input)
            },
          }))

          const ws = path.join(root, "ws")
          const fixtureResolved = resolved.filter((item) => inFixture(ws, item))
          expect(fixtureResolved).not.toContain(path.join(nested, "xiaochuan.jsonc"))
          expect(fixtureResolved).not.toContain(path.join(nested, ".xiaochuan"))
          expect(fixtureResolved).not.toContain(path.join(ancestor, "xiaochuan.json"))
          expect(fixtureResolved).toContain(path.join(nested, "xiaochuan.json"))
          expect(fixtureResolved).toContain(path.join(ancestor, ".xiaochuan"))

          expect(dirChecks.filter((item) => inFixture(ws, item))).toEqual([path.join(ancestor, ".xiaochuan")])

          const wsDirect = sources.direct.filter((item) => inFixture(ws, item))
          expect(wsDirect).toContain(AbsolutePath.make(path.join(nested, "xiaochuan.jsonc")))
          expect(wsDirect).toContain(AbsolutePath.make(path.join(nested, "xiaochuan.json")))
          const wsProject = sources.project.filter((entry) => inFixture(ws, entry.path))
          expect(wsProject).toContainEqual({ path: AbsolutePath.make(path.join(ancestor, ".xiaochuan")), present: true })
          expect(wsProject).toContainEqual({ path: AbsolutePath.make(path.join(nested, ".xiaochuan")), present: false })
        }),
      ),
    ),
  )

  it.live("falls back to direct candidate probes when listing an ancestor directory is denied", () =>
    Effect.acquireDisposable(Effect.promise(() => tmpdir())).pipe(
      Effect.flatMap((tmp) =>
        Effect.gen(function* () {
          const root = yield* Effect.promise(() => fs.realpath(tmp.path))
          const guarded = path.join(root, "guarded")
          const project = path.join(guarded, "project")
          yield* Effect.promise(async () => {
            await fs.mkdir(path.join(guarded, ".xiaochuan"), { recursive: true })
            await fs.mkdir(project, { recursive: true })
          })

          const sources = yield* discoverWith(root, project, project, (base) => ({
            readDirectory: (target, options) =>
              target === guarded
                ? base.readDirectory(path.join(target, "unreadable-missing"), options)
                : base.readDirectory(target, options),
          }))
          expect(sources.project).toContainEqual({
            path: AbsolutePath.make(path.join(guarded, ".xiaochuan")),
            present: true,
          })
        }),
      ),
    ),
  )

  it.live("probes candidates when readDirectory reports a differently cased entry", () =>
    Effect.acquireDisposable(Effect.promise(() => tmpdir())).pipe(
      Effect.flatMap((tmp) =>
        Effect.gen(function* () {
          const root = yield* Effect.promise(() => fs.realpath(tmp.path))
          const project = path.join(root, "cased")
          yield* Effect.promise(() => fs.mkdir(path.join(project, ".xiaochuan"), { recursive: true }))

          const sources = yield* discoverWith(root, project, project, (base) => ({
            readDirectory: (target, options) =>
              target === project ? Effect.succeed([".XIAOCHUAN"]) : base.readDirectory(target, options),
          }))
          expect(sources.project).toContainEqual({
            path: AbsolutePath.make(path.join(project, ".xiaochuan")),
            present: true,
          })
        }),
      ),
    ),
  )
})
