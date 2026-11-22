import { describe, expect, test } from "bun:test"
import path from "node:path"
import { Glob } from "bun"
import { desktopInstall, docsInstalls, installs, sdkInstalls } from "../src/lib/install-commands"

// The site shows Xccode 2. These names install Xccode 1 (see src/lib/install-commands.ts):
// the xccode-ai npm package, the unversioned install script, the tap's xccode formula and the
// xccode-bin AUR package. Scoped @xccode-ai/... packages are code samples, not installs.
const v1 = [
  { name: "the xccode-ai npm package", pattern: /(?<![@\w/-])xccode-ai(?![\w/-])/ },
  { name: "the Xccode 1 install script", pattern: /xccode\.ai\/install\b/ },
  { name: "the tap's Xccode 1 formula", pattern: /anomalyco\/tap\/xccode(?![\w-])/ },
  { name: "the xccode-bin AUR package", pattern: /\bxccode-bin\b/ },
  { name: "the AUR xccode package", pattern: /\b(paru|yay|pacman) -S xccode(?![\w-])/ },
]

const app = path.join(import.meta.dir, "..")
// Site copy and the sources of every generated text file (llms.txt, llms-full.txt, the .md pages,
// the view-source comment, voice answers). Not .output: a stale build would fail the test.
const roots = ["src", "public", "script"]
const text = /\.(tsx?|jsx?|css|md|mdx|txt|json|html|xml|webmanifest)$/
// Stored GitHub data (script/github-snapshot.ts): past release notes may name Xccode 1 packages
// as history, not as an install command. The V1 docs are Xccode 1's, so they install it.
const exempt = (file: string) => file === "src/lib/github-snapshot.json" || file.startsWith("src/docs/v1/")

async function files() {
  const found = await Promise.all(
    roots.map((root) =>
      Array.fromAsync(new Glob(`${root}/**/*`).scan({ cwd: app, onlyFiles: true, dot: true })).then(
        (files) => files.map((file) => file.replaceAll("\\", "/")),
        () => [],
      ),
    ),
  )
  return found.flat().filter((file) => text.test(file) && !exempt(file) && !file.includes("node_modules"))
}

describe("install commands", () => {
  test("every command installs Xccode 2", () => {
    const commands = [
      ...installs.map((item) => item.command),
      ...docsInstalls.map((item) => item.code),
      ...sdkInstalls.map((item) => item.command),
      desktopInstall.command,
    ]
    commands.forEach((command) => v1.forEach((item) => expect(command).not.toMatch(item.pattern)))
    expect(installs.map((item) => item.command)).toEqual([
      "curl -fsSL https://xccode.ai/v2/install | bash",
      "npm install -g @xccode/cli",
      "bun install -g --trust @xccode/cli",
      "brew install anomalyco/tap/xccode-v2",
      "paru -S xccode-beta",
    ])
  })

  test("site copy and generated text name no Xccode 1 install", async () => {
    const list = await files()
    expect(list.length).toBeGreaterThan(100)
    const hits = (
      await Promise.all(
        list.map(async (file) =>
          (await Bun.file(path.join(app, file)).text()).split("\n").flatMap((line, index) =>
            // Comments may name the Xccode 1 packages to explain why the site doesn't.
            /^\s*(\/\/|\*|\/\*)/.test(line)
              ? []
              : v1.filter((item) => item.pattern.test(line)).map((item) => `${file}:${index + 1} ${item.name}`),
          ),
        ),
      )
    ).flat()
    expect(hits).toEqual([])
  })
})
