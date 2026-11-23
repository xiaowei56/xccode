import { Plugin } from "@xiaochuan/plugin/effect"
import { Effect } from "effect"
import { BrowserConnection } from "./connection.js"
import { BrowserTools } from "./tools.js"

export default Plugin.define({
  id: "xiaochuan.browser",
  effect: (ctx) =>
    Effect.gen(function* () {
      const connection = yield* BrowserConnection.make(ctx)
      yield* BrowserTools.register(ctx, connection)
    }),
})
