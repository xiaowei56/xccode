import { describe, expect, test } from "bun:test"
import path from "node:path"
import { Glob } from "bun"
import { desktopInstall, docsInstalls, installs, sdkInstalls } from "../src/lib/install-commands"

// The site shows Xiaochuan 2. These names install Xiaochuan 1 (see src/lib/install-commands.ts):
// the xiaochuan-ai npm package, the unversioned install script, the tap's xiaochuan formula and the
// xiaochuan-bin AUR package. Scoped @xiaochuan-ai/... packages are code samples, not installs.
const v1 = [
  { name: "the xiaochuan-ai npm package", pattern: /(?<![@\w/-])xiaochuan-ai(?![\w/-])/ },
  { name: "the Xiaochuan 1 install script", pattern: /xiaochuan\.ai\/install\b/ },
  { name: "the tap's Xiaochuan 1 formula", pattern: /anomalyco\/tap\/xiaochuan(?![\w-])/ },
  { name: "the xiaochuan-bin AUR package", pattern: /\bxiaochuan-bin\b/ },
  { name: "the AUR xiaochuan package", pattern: /\b(paru|yay|pacman) -S xiaochuan(?![\w-])/ },
]

const app = path.join(import.meta.dir, "..")
// Site copy and the sources of every generated text file (llms.txt, llms-full.txt, the .md pages,
// the view-source comment, voice answers). Not .output: a stale build would fail the test.
const roots = ["src", "public", "script"]
const text = /\.(tsx?|jsx?|css|md|mdx|txt|json|html|xml|webmanifest)$/
// Stored GitHub data (script/github-snapshot.ts): past release notes may name Xiaochuan 1 packages
// as history, not as an install command. The V1 docs are Xiaochuan 1's, so they install it.
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
  test("every command installs Xiaochuan 2", () => {
    const commands = [
      ...installs.map((item) => item.command),
      ...docsInstalls.map((item) => item.code),
      ...sdkInstalls.map((item) => item.command),
      desktopInstall.command,
    ]
    commands.forEach((command) => v1.forEach((item) => expect(command).not.toMatch(item.pattern)))
    expect(installs.map((item) => item.command)).toEqual([
      "curl -fsSL https://xiaochuan.ai/v2/install | bash",
      "npm install -g @xiaochuan/cli",
      "bun install -g --trust @xiaochuan/cli",
      "brew install anomalyco/tap/xiaochuan-v2",
      "paru -S xiaochuan-beta",
    ])
  })

  test("site copy and generated text name no Xiaochuan 1 install", async () => {
    const list = await files()
    expect(list.length).toBeGreaterThan(100)
    const hits = (
      await Promise.all(
        list.map(async (file) =>
          (await Bun.file(path.join(app, file)).text()).split("\n").flatMap((line, index) =>
            // Comments may name the Xiaochuan 1 packages to explain why the site doesn't.
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
