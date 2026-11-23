import { describe, expect, test } from "bun:test"
import { Effect } from "effect"
import { Integration } from "@xiaochuan/core/integration"
import { Plugin } from "@xiaochuan/core/plugin"
import { PluginHost } from "@xiaochuan/core/plugin/host"
import { ProviderPlugins } from "@xiaochuan/core/plugin/provider"
import { LLMGatewayPlugin } from "@xiaochuan/core/plugin/provider/llmgateway"
import { Provider } from "@xiaochuan/core/provider"
import { testEffect } from "../lib/effect"
import { PluginTestLayer } from "./fixture"

const it = testEffect(PluginTestLayer)

const addPlugin = Effect.fn(function* () {
  const plugin = yield* Plugin.Service
  const host = yield* PluginHost.make(plugin, "test")
  yield* LLMGatewayPlugin.effect(host)
})

describe("LLMGatewayPlugin", () => {
  test("is registered so legacy referer headers can be applied", () => {
    expect(ProviderPlugins.map((item) => item.id)).toContain("xiaochuan.provider.llmgateway")
  })

  it.effect("applies legacy referer headers only to enabled llmgateway", () =>
    Effect.gen(function* () {
      const catalog = yield* Provider.Service
      const integrations = yield* Integration.Service
      yield* integrations.transform((editor) => {
        editor.update(Integration.ID.make("llmgateway"), () => {})
        editor.update(Integration.ID.make("openrouter"), () => {})
      })
      yield* catalog.transform((catalog) => {
        catalog.update(Provider.ID.make("llmgateway"), (provider) => {
          provider.package = "@xiaochuan/ai/providers/openai-compatible"
          provider.settings = { baseURL: "https://api.llmgateway.io/v1" }
          provider.headers = { Existing: "value" }
        })
        catalog.update(Provider.ID.openrouter, () => {})
      })
      yield* addPlugin()
      expect((yield* catalog.get(Provider.ID.make("llmgateway")))?.headers).toEqual({
        Existing: "value",
        "HTTP-Referer": "https://xiaochuan.ai/",
        "X-Title": "xiaochuan",
        "X-Source": "xiaochuan",
      })
      expect((yield* catalog.get(Provider.ID.openrouter))?.headers).toBeUndefined()
    }),
  )

  it.effect("does not apply legacy headers to a disabled llmgateway provider", () =>
    Effect.gen(function* () {
      const catalog = yield* Provider.Service
      const integrations = yield* Integration.Service
      yield* integrations.transform((editor) => {
        editor.update(Integration.ID.make("llmgateway"), () => {})
      })
      yield* catalog.transform((catalog) => {
        catalog.update(Provider.ID.make("llmgateway"), (provider) => {
          provider.activation = "disabled"
          provider.package = "@xiaochuan/ai/providers/openai-compatible"
          provider.settings = { baseURL: "https://api.llmgateway.io/v1" }
        })
      })
      yield* addPlugin()

      expect((yield* catalog.get(Provider.ID.make("llmgateway")))?.activation).toBe("disabled")
      expect((yield* catalog.get(Provider.ID.make("llmgateway")))?.headers).toBeUndefined()
    }),
  )
})
