import { Effect } from "effect"
import { define } from "@xiaochuan/plugin/effect/plugin"

export const NvidiaPlugin = define({
  id: "xiaochuan.provider.nvidia",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.provider.transform((evt) => {
      for (const item of evt.list()) {
        if (item.provider.package !== "@xiaochuan/ai/providers/openai-compatible") continue
        if (item.provider.settings?.baseURL !== "https://integrate.api.nvidia.com/v1") continue
        evt.update(item.provider.id, (provider) => {
          provider.headers = {
            ...provider.headers,
            "HTTP-Referer": "https://xiaochuan.ai/",
            "X-Title": "xiaochuan",
            "X-BILLING-INVOKE-ORIGIN": provider.headers?.["X-BILLING-INVOKE-ORIGIN"] ?? "Xiaochuan",
          }
        })
      }
    })
  }),
})
