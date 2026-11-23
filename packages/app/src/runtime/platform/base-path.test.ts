import { describe, expect, test } from "bun:test"
import { normalizeBasePath, stripBasePath, withBasePath } from "./base-path"

describe("normalizeBasePath", () => {
  test("is empty at the root", () => {
    expect(normalizeBasePath(undefined)).toBe("")
    expect(normalizeBasePath("/")).toBe("")
    expect(normalizeBasePath("")).toBe("")
  })

  test("has a leading slash and no trailing slash", () => {
    expect(normalizeBasePath("/xiaochuan/")).toBe("/xiaochuan")
    expect(normalizeBasePath("xiaochuan")).toBe("/xiaochuan")
    expect(normalizeBasePath("//a/b//")).toBe("/a/b")
  })
})

describe("withBasePath", () => {
  test("leaves paths alone at the root", () => {
    expect(withBasePath("/new-session?x=1", "")).toBe("/new-session?x=1")
  })

  test("prefixes paths with the base", () => {
    expect(withBasePath("/", "/xiaochuan")).toBe("/xiaochuan/")
    expect(withBasePath("/server/a/session/b#m", "/xiaochuan")).toBe("/xiaochuan/server/a/session/b#m")
  })
})

describe("stripBasePath", () => {
  test("leaves paths alone at the root", () => {
    expect(stripBasePath("/new-session", "")).toBe("/new-session")
  })

  test("removes the base", () => {
    expect(stripBasePath("/xiaochuan", "/xiaochuan")).toBe("/")
    expect(stripBasePath("/xiaochuan/", "/xiaochuan")).toBe("/")
    expect(stripBasePath("/xiaochuan?draftId=1", "/xiaochuan")).toBe("/?draftId=1")
    expect(stripBasePath("/xiaochuan/new-session#top", "/xiaochuan")).toBe("/new-session#top")
  })

  test("keeps paths outside the base", () => {
    expect(stripBasePath("/xiaochuan-other/x", "/xiaochuan")).toBe("/xiaochuan-other/x")
    expect(stripBasePath("/elsewhere", "/xiaochuan")).toBe("/elsewhere")
  })

  test("round-trips with withBasePath", () => {
    for (const path of ["/", "/new-session", "/server/a/session/b?q=1#h"])
      expect(stripBasePath(withBasePath(path, "/xiaochuan"), "/xiaochuan")).toBe(path)
  })
})
