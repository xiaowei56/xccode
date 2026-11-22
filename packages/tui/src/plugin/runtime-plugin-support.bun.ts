import { ensurePluginRuntime, provides } from "@xccode/plugin/runtime"
import { Plugin, PluginContextProvider, usePlugin } from "@xccode/plugin/tui"
import { ensureRuntimePluginSupport } from "@opentui/solid/runtime-plugin-support/configure"

ensurePluginRuntime()
ensureRuntimePluginSupport({
  additional: {
    "@xccode/plugin/tui": { Plugin, PluginContextProvider, usePlugin },
  },
  preserve: provides,
})
