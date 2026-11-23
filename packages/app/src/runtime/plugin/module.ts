import {
  evaluatePluginBundle,
  inertModule,
  mainOnlyModule,
  type PluginModule,
  type Entry,
} from "@xiaochuan/plugin/gui/host"

// Plugin bundles share the host's module instances, so tokens, contexts and schemas they import are the same objects
// the host checks against. In a window, the main SDK's name resolves to the window SDK.
const modules = {
  effect: () => import("effect"),
  "@xiaochuan/plugin/gui": () => import("@xiaochuan/plugin/gui"),
  "@xiaochuan/plugin/gui/main": () => import("@xiaochuan/plugin/gui"),
  "@xiaochuan/plugin/gui/file": () => import("@xiaochuan/plugin/gui/file"),
  "@xiaochuan/plugin/gui/review": () => import("@xiaochuan/plugin/gui/review"),
  "@xiaochuan/plugin/gui/browser": () => import("@xiaochuan/plugin/gui/browser"),
  "@xiaochuan/plugin/rpc": () => import("@xiaochuan/plugin/rpc"),
  "@xiaochuan/schema/rpc": () => import("@xiaochuan/schema/rpc"),
  "@xiaochuan/client": () => import("@xiaochuan/client"),
  "@xiaochuan/client/effect": () => import("@xiaochuan/client/effect"),
  "@xiaochuan/client/solid": () => import("@xiaochuan/client/solid"),
  "solid-js": () => import("solid-js"),
  "solid-js/web": () => import("solid-js/web"),
  "solid-js/store": () => import("solid-js/store"),
} satisfies Record<PluginModule, () => Promise<object>>

/**
 * Builds a host `Entry` for a plugin's `./gui-experimental` bundle, read from the desktop app's own server. The
 * bundle is evaluated here so the host reads its `Plugin.define` declarations (`os`, `stores`, `i18n`) before it
 * activates the plugin. A plugin with only a `main` setup gets an empty window setup, so it still lists as active. It
 * takes the server plugin's id. A bundle that fails to evaluate becomes an entry that fails, so Extensions › Plugins
 * reports it.
 */
export async function pluginDefinition(id: string, code: string): Promise<Entry> {
  const loaded = new Map<string, object>(
    await Promise.all(Object.entries(modules).map(async ([name, load]) => [name, await load()] as const)),
  )

  const bundle = await Promise.try(() =>
    evaluatePluginBundle(code, {
      process: "window",
      require: (name) => {
        const module = loaded.get(name)

        if (module) return module

        if (mainOnlyModule(name)) return inertModule(name)

        throw new Error(`Plugin GUI bundle requires a module the app does not share: ${name}`)
      },
    }),
  ).then(
    (value) => ({ ok: true as const, value }),
    (cause: unknown) => ({ ok: false as const, cause }),
  )

  if (!bundle.ok) return { id, windowEntry: () => Promise.reject(bundle.cause) }

  const setup = bundle.value.setup

  // A setup's returned cleanup reaches the host, which runs it when the plugin goes away.
  return { ...bundle.value.definition, id, windowEntry: async () => ({ default: (ctx: never) => setup?.(ctx) }) }
}
