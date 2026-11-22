import path from "node:path"
import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { defineConfig, type Plugin, type UserConfig } from "vite"
import solid from "vite-plugin-solid"
import { nodeExecArgv, nodeTarget, type NodeTarget, photonWasmAsset } from "./src/node/target"
import { verifySimulationGraph } from "./script/verify-artifact"

const dir = import.meta.dirname

function rawTextPlugin(modelsSnapshot?: string): Plugin {
  return {
    name: "xccode:raw-text",
    // "pre" is load-bearing for .txt: Vite's built-in asset plugin claims
    // known asset types (.txt among them) ahead of normal-priority plugins,
    // replacing the import with an asset URL string instead of the content.
    // .md only ever worked without it because .md is not a known asset type.
    enforce: "pre",
    async load(id) {
      if (!id.endsWith(".md") && !id.endsWith(".txt")) return
      const text =
        modelsSnapshot && /models-dev[/\\]snapshot\.txt$/.test(id) ? modelsSnapshot : await readFile(id, "utf8")
      return `export default ${JSON.stringify(text)}`
    },
  }
}

/** The web UI archive's SEA asset key. The prelude leaves it in place, and the server reads it from SEA memory. */
export const appArchiveAsset = "app-archive.bin"

function appAssetsPlugin(): Plugin {
  return {
    name: "xccode:app-assets",
    resolveId(id) {
      if (id === "virtual:xccode-app-assets") return "\0virtual:xccode-app-assets"
    },
    load(id) {
      if (id !== "\0virtual:xccode-app-assets") return
      return `import { readFileSync } from "node:fs"
import path from "node:path"
import { getRawAsset, isSea } from "node:sea"
export default () =>
  isSea()
    ? new Uint8Array(getRawAsset(${JSON.stringify(appArchiveAsset)}))
    : readFileSync(path.join(process.env.XCCODE_NODE_ASSETS_DIR, ${JSON.stringify(appArchiveAsset)}))`
    },
  }
}

function runtimeRequirePlugin(): Plugin {
  return {
    name: "xccode:runtime-require",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith("turndown/lib/turndown.es.js")) return
      const transformed = code.replace("    var domino = require('@mixmark-io/domino');", "")
      if (transformed === code) this.error("Failed to rewrite Turndown's Domino require")
      return `import domino from "@mixmark-io/domino"\n${transformed}`
    },
  }
}

function simulationGraphPlugin(): Plugin {
  return {
    name: "xccode:simulation-graph",
    generateBundle() {
      verifySimulationGraph(this.getModuleIds())
    },
  }
}

function fffNodePlugin(): Plugin {
  return {
    name: "xccode:fff-node",
    enforce: "pre",
    transform(code, id) {
      const normalized = id.replaceAll("\\", "/")
      if (normalized.endsWith("/ffi-rs/index.js")) {
        const start = code.indexOf("if (!nativeBinding) {")
        if (start === -1) this.error("Failed to rewrite ffi-rs native binding loader")
        return `const unavailable = () => { throw new Error("ffi-rs native binding unavailable") }
const nativeBinding = globalThis.__XCCODE_FFF_FFI ?? {
  DataType: new Proxy({}, { get: (target, key) => target[key] ?? key }),
  PointerType: {},
  FFITypeTag: {},
  open: unavailable,
  close: unavailable,
  load: unavailable,
  isNullPointer: unavailable,
  createPointer: unavailable,
  restorePointer: unavailable,
  unwrapPointer: unavailable,
  wrapPointer: unavailable,
  freePointer: unavailable,
}
const loadError = undefined
${code.slice(start)}`
      }
      if (!normalized.endsWith("/fff-node/dist/src/binary.js")) return
      const transformed = code.replace(
        "export function findBinary() {",
        "export function findBinary() { if (process.env.FFF_BINARY_PATH) return process.env.FFF_BINARY_PATH;",
      )
      if (transformed === code) this.error("Failed to rewrite FFF binary loader")
      return transformed
    },
  }
}

const resolve = {
  alias: [
    { find: /^solid-js\/store$/, replacement: "solid-js/store/dist/store.js" },
    { find: /^solid-js$/, replacement: "solid-js/dist/solid.js" },
    {
      find: /^ws$/,
      replacement: path.join(path.dirname(createRequire(import.meta.url).resolve("ws/package.json")), "wrapper.mjs"),
    },
  ],
  conditions: ["node"],
}

const output = (entryFileNames: string, banner?: string) => ({
  format: "esm" as const,
  entryFileNames,
  inlineDynamicImports: true,
  banner,
})

function nodePrelude(input: NodeBuildInput) {
  const nodePtySpawnHelper =
    input.target.platform === "darwin"
      ? `${input.target.nodePtyPackage}/prebuilds/darwin-${input.target.arch}/spawn-helper`
      : undefined
  const xccodePtyAsset = input.target.xccodePtyAsset
  const promiseModule = `const sdk = globalThis[Symbol.for("xccode.plugin.v2.promise")]
if (!sdk) throw new Error("Xccode Promise plugin SDK is unavailable")
export const Agent = sdk.Agent
export const Command = sdk.Command
export const Connection = sdk.Connection
export const Credential = sdk.Credential
export const Integration = sdk.Integration
export const Model = sdk.Model
export const Plugin = sdk.Plugin
export const Provider = sdk.Provider
export const Reference = sdk.Reference
export const Skill = sdk.Skill`
  const effectModule = promiseModule
    .replace("xccode.plugin.v2.promise", "xccode.plugin.v2.effect")
    .replace("Promise plugin", "Effect plugin")
  const promisePluginModule = `const sdk = globalThis[Symbol.for("xccode.plugin.v2.promise")]
if (!sdk) throw new Error("Xccode Promise plugin SDK is unavailable")
export const define = sdk.Plugin.define`
  const effectPluginModule = promisePluginModule
    .replace("xccode.plugin.v2.promise", "xccode.plugin.v2.effect")
    .replace("Promise plugin", "Effect plugin")
  const promiseToolModule = `export {}`
  const effectToolModule = `const sdk = globalThis[Symbol.for("xccode.plugin.v2.effect")]
if (!sdk) throw new Error("Xccode Effect plugin SDK is unavailable")
export const Error = sdk.Tool.Error
`
  return `#!/usr/bin/env -S node ${nodeExecArgv.join(" ")}
import __cjs_mod__ from "node:module"
import { chmodSync as __ocChmod, existsSync as __ocExists, lstatSync as __ocLstat, mkdirSync as __ocMkdir, renameSync as __ocRename, rmSync as __ocRm, writeFileSync as __ocWrite } from "node:fs"
import { tmpdir as __ocTmpdir } from "node:os"
import __ocPath from "node:path"
import { getAssetKeys as __ocAssetKeys, getRawAsset as __ocRawAsset, isSea as __ocIsSea } from "node:sea"
import { fileURLToPath as __ocFileURLToPath } from "node:url"
const __filename = import.meta.filename
const __dirname = import.meta.dirname
const require = __cjs_mod__.createRequire(import.meta.url)
const __ocPluginModules = ${JSON.stringify({
    "@xccode/plugin": "xccode:plugin-v2",
    "@xccode/plugin/promise/plugin": "xccode:plugin-promise-plugin",
    "@xccode/plugin/promise/tool": "xccode:plugin-promise-tool",
    "@xccode/plugin/effect": "xccode:plugin-v2-effect",
    "@xccode/plugin/effect/plugin": "xccode:plugin-v2-effect-plugin",
    "@xccode/plugin/effect/tool": "xccode:plugin-v2-effect-tool",
  })}
const __ocPluginSources = ${JSON.stringify({
    "xccode:plugin-v2": promiseModule,
    "xccode:plugin-promise-plugin": promisePluginModule,
    "xccode:plugin-promise-tool": promiseToolModule,
    "xccode:plugin-v2-effect": effectModule,
    "xccode:plugin-v2-effect-plugin": effectPluginModule,
    "xccode:plugin-v2-effect-tool": effectToolModule,
  })}
__cjs_mod__.registerHooks({
  resolve(__ocSpecifier, __ocContext, __ocNextResolve) {
    const __ocUrl = __ocPluginModules[__ocSpecifier]
    return __ocUrl ? { url: __ocUrl, shortCircuit: true } : __ocNextResolve(__ocSpecifier, __ocContext)
  },
  load(__ocUrl, __ocContext, __ocNextLoad) {
    const __ocSource = __ocPluginSources[__ocUrl]
    return __ocSource
      ? { format: "module", source: __ocSource, shortCircuit: true }
      : __ocNextLoad(__ocUrl, __ocContext)
  },
})
const __ocUid = typeof process.getuid === "function" ? process.getuid() : undefined
const __ocCacheRoot = __ocPath.join(__ocTmpdir(), \`xccode-node-\${__ocUid ?? "user"}\`)
if (__ocIsSea()) {
  try {
    __ocMkdir(__ocCacheRoot, { mode: 0o700 })
  } catch (__ocError) {
    if (!__ocExists(__ocCacheRoot)) throw __ocError
  }
  const __ocCacheInfo = __ocLstat(__ocCacheRoot)
  if (!__ocCacheInfo.isDirectory() || __ocCacheInfo.isSymbolicLink()) throw new Error("Unsafe Node asset cache path")
  if (__ocUid !== undefined && __ocCacheInfo.uid !== __ocUid) throw new Error("Node asset cache is owned by another user")
  if (__ocUid !== undefined) __ocChmod(__ocCacheRoot, 0o700)
}
const __ocAssetRoot = __ocIsSea()
  ? __ocPath.join(__ocCacheRoot, ${JSON.stringify(`${input.assetHash}-${input.target.platform}-${input.target.arch}`)})
  : __ocFileURLToPath(new URL("./assets/", import.meta.url))
const __ocPersistentPty = ${JSON.stringify(xccodePtyAsset)}
if (__ocIsSea()) {
  const __ocPtySpawnHelper = ${JSON.stringify(nodePtySpawnHelper)}
  for (const __ocKey of __ocAssetKeys()) {
    if (__ocKey === ${JSON.stringify(appArchiveAsset)}) continue
    const __ocTarget = __ocPath.join(__ocAssetRoot, __ocKey)
    if (__ocExists(__ocTarget)) continue
    __ocMkdir(__ocPath.dirname(__ocTarget), { recursive: true })
    const __ocTemporary = \`${"${__ocTarget}"}.${"${process.pid}"}.${"${crypto.randomUUID()}"}.tmp\`
    __ocWrite(__ocTemporary, new Uint8Array(__ocRawAsset(__ocKey)))
    if ((__ocKey === __ocPtySpawnHelper || __ocKey === __ocPersistentPty) && process.platform !== "win32")
      __ocChmod(__ocTemporary, 0o755)
    try {
      __ocRename(__ocTemporary, __ocTarget)
    } catch (__ocError) {
      __ocRm(__ocTemporary, { force: true })
      if (!__ocExists(__ocTarget)) throw __ocError
    }
  }
}
process.env.XCCODE_NODE_ASSETS_DIR = __ocAssetRoot
process.env.OTUI_ASSET_ROOT = __ocAssetRoot
process.env.XCCODE_NODE_PTY_PATH = __ocPath.join(__ocAssetRoot, ${JSON.stringify(input.target.nodePtyEntryAsset)})
process.env.XCCODE_PARCEL_WATCHER_PATH = __ocPath.join(__ocAssetRoot, ${JSON.stringify(input.target.parcelWatcherAsset)})
process.env.XCCODE_PHOTON_WASM_PATH = __ocPath.join(__ocAssetRoot, ${JSON.stringify(photonWasmAsset)})
process.env.FFF_BINARY_PATH = __ocPath.join(__ocAssetRoot, ${JSON.stringify(input.target.fffAsset)})
process.env.XCCODE_FFF_FFI_PATH = __ocPath.join(__ocAssetRoot, ${JSON.stringify(input.target.fffFfiAsset)})
if (__ocPersistentPty && !process.env.XCCODE_PTY_BIN) process.env.XCCODE_PTY_BIN = __ocPath.join(__ocAssetRoot, __ocPersistentPty)
try {
  globalThis.__XCCODE_FFF_FFI = require(process.env.XCCODE_FFF_FFI_PATH)
} catch {}
globalThis.__XCCODE_PHOTON_WASM_PATH = process.env.XCCODE_PHOTON_WASM_PATH
if (process.platform === "linux") process.env.OPENTUI_LIBC = "glibc"`
}

export type NodeBuildInput = {
  readonly version: string
  readonly channel: string
  readonly highlights?: string
  readonly modelsSnapshot?: string
  readonly assetHash: string
  readonly target: NodeTarget
}

export function mainConfig(input: NodeBuildInput): UserConfig {
  return defineConfig({
    root: dir,
    plugins: [
      appAssetsPlugin(),
      rawTextPlugin(input.modelsSnapshot),
      runtimeRequirePlugin(),
      fffNodePlugin(),
      simulationGraphPlugin(),
      solid({
        solid: {
          generate: "universal",
          moduleName: "@opentui/solid",
        },
      }),
    ],
    resolve,
    esbuild: { jsx: "automatic" },
    define: {
      XCCODE_VERSION: JSON.stringify(input.version),
      XCCODE_CLI_NAME: JSON.stringify("xccode2-node"),
      XCCODE_CHANNEL: JSON.stringify(input.channel),
      XCCODE_ARTIFACT: JSON.stringify("cli-node"),
      ...(input.highlights ? { XCCODE_RELEASE_HIGHLIGHTS: JSON.stringify(input.highlights) } : {}),
      XCCODE_LIBC: input.target.platform === "linux" ? JSON.stringify("glibc") : "undefined",
      FFF_LIBC: input.target.platform === "linux" ? JSON.stringify("gnu") : "undefined",
      "process.env.WS_NO_BUFFER_UTIL": JSON.stringify("1"),
    },
    ssr: { noExternal: true },
    build: {
      ssr: "src/node/index.ts",
      target: "node26",
      outDir: "dist-node",
      emptyOutDir: false,
      minify: true,
      rollupOptions: {
        output: output("xccode.mjs", nodePrelude(input)),
      },
    },
  })
}

export default mainConfig({
  version: process.env.XCCODE_VERSION ?? "local",
  channel: process.env.XCCODE_CHANNEL ?? "local",
  assetHash: "local",
  target: nodeTarget(process.platform, process.arch),
})
