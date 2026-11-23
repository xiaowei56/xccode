import { ensurePluginRuntime, provides } from "@xiaochuan/plugin/runtime"
import { Plugin, PluginContextProvider, usePlugin } from "@xiaochuan/plugin/tui"
import { ensureRuntimePluginSupport } from "@opentui/solid/runtime-plugin-support/configure"

ensurePluginRuntime()
ensureRuntimePluginSupport({
  additional: {
    "@xiaochuan/plugin/tui": { Plugin, PluginContextProvider, usePlugin },
  },
  preserve: provides,
})
