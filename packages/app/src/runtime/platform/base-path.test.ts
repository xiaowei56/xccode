import { describe, expect, test } from "bun:test"
import { normalizeBasePath, stripBasePath, withBasePath } from "./base-path"

describe("normalizeBasePath", () => {
  test("is empty at the root", () => {
    expect(normalizeBasePath(undefined)).toBe("")
    expect(normalizeBasePath("/")).toBe("")
    expect(normalizeBasePath("")).toBe("")
  })

  test("has a leading slash and no trailing slash", () => {
    expect(normalizeBasePath("/xccode/")).toBe("/xccode")
    expect(normalizeBasePath("xccode")).toBe("/xccode")
    expect(normalizeBasePath("//a/b//")).toBe("/a/b")
  })
})

describe("withBasePath", () => {
  test("leaves paths alone at the root", () => {
    expect(withBasePath("/new-session?x=1", "")).toBe("/new-session?x=1")
  })

  test("prefixes paths with the base", () => {
    expect(withBasePath("/", "/xccode")).toBe("/xccode/")
    expect(withBasePath("/server/a/session/b#m", "/xccode")).toBe("/xccode/server/a/session/b#m")
  })
})

describe("stripBasePath", () => {
  test("leaves paths alone at the root", () => {
    expect(stripBasePath("/new-session", "")).toBe("/new-session")
  })

  test("removes the base", () => {
    expect(stripBasePath("/xccode", "/xccode")).toBe("/")
    expect(stripBasePath("/xccode/", "/xccode")).toBe("/")
    expect(stripBasePath("/xccode?draftId=1", "/xccode")).toBe("/?draftId=1")
    expect(stripBasePath("/xccode/new-session#top", "/xccode")).toBe("/new-session#top")
  })

  test("keeps paths outside the base", () => {
    expect(stripBasePath("/xccode-other/x", "/xccode")).toBe("/xccode-other/x")
    expect(stripBasePath("/elsewhere", "/xccode")).toBe("/elsewhere")
  })

  test("round-trips with withBasePath", () => {
    for (const path of ["/", "/new-session", "/server/a/session/b?q=1#h"])
      expect(stripBasePath(withBasePath(path, "/xccode"), "/xccode")).toBe(path)
  })
})
