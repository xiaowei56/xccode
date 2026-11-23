export * as Provider from "./provider.js"

import { Context, Effect, Layer, Option, Schema, Stream, Struct } from "effect"
import { Provider } from "@xiaochuan/schema/provider"
import { Model } from "@xiaochuan/schema/model"
import { makeLocationNode } from "@xiaochuan/util/effect/app-node"
import { HttpTimeout, type ProviderPackage } from "@xiaochuan/ai/effect"
import { Npm } from "@xiaochuan/util/npm"
import type { DeepMutable } from "./schema.js"
import { importModule, resolveModule } from "@xiaochuan/util/runtime-import"
import { Bus } from "./bus.js"
import { Integration } from "./integration.js"
import { State } from "./state.js"
import { IntegrationConnection } from "./integration/connection.js"
import { Credential } from "@xiaochuan/schema/credential"
import { Location } from "./location.js"
import { freeze } from "immer"
import { AISDKNative } from "./aisdk-native.js"

export { AISDK_PREFIX, aisdk, isAISDK, mergeHeaders, mergeOverlay, packageName } from "./aisdk-native.js"

export const ID = Provider.ID
export type ID = typeof ID.Type

export class LoadError extends Schema.TaggedError<LoadError>()("Provider.LoadError", {
  package: Schema.String,
  cause: Schema.Defect(),
}) {}

const packages = new Map<string, Promise<unknown>>()
const builtins = new Map<string, () => Promise<unknown>>([
  ["@xiaochuan/ai/providers/alibaba", () => import("@xiaochuan/ai/providers/alibaba")],
  ["@xiaochuan/ai/providers/alibaba/chat", () => import("@xiaochuan/ai/providers/alibaba/chat")],
  ["@xiaochuan/ai/providers/alibaba/messages", () => import("@xiaochuan/ai/providers/alibaba/messages")],
  ["@xiaochuan/ai/providers/alibaba/responses", () => import("@xiaochuan/ai/providers/alibaba/responses")],
  ["@xiaochuan/ai/providers/alibaba/images", () => import("@xiaochuan/ai/providers/alibaba/images")],
  ["@xiaochuan/ai/providers/alibaba/embeddings", () => import("@xiaochuan/ai/providers/alibaba/embeddings")],
  ["@xiaochuan/ai/providers/amazon-bedrock", () => import("@xiaochuan/ai/providers/amazon-bedrock")],
  ["@xiaochuan/ai/providers/amazon-bedrock/mantle", () => import("@xiaochuan/ai/providers/amazon-bedrock/mantle")],
  [
    "@xiaochuan/ai/providers/amazon-bedrock/mantle/chat",
    () => import("@xiaochuan/ai/providers/amazon-bedrock/mantle/chat"),
  ],
  [
    "@xiaochuan/ai/providers/amazon-bedrock/mantle/messages",
    () => import("@xiaochuan/ai/providers/amazon-bedrock/mantle/messages"),
  ],
  [
    "@xiaochuan/ai/providers/amazon-bedrock/mantle/responses",
    () => import("@xiaochuan/ai/providers/amazon-bedrock/mantle/responses"),
  ],
  ["@xiaochuan/ai/providers/anthropic", () => import("@xiaochuan/ai/providers/anthropic")],
  ["@xiaochuan/ai/providers/anthropic-compatible", () => import("@xiaochuan/ai/providers/anthropic-compatible")],
  ["@xiaochuan/ai/providers/azure", () => import("@xiaochuan/ai/providers/azure")],
  ["@xiaochuan/ai/providers/azure/chat", () => import("@xiaochuan/ai/providers/azure/chat")],
  ["@xiaochuan/ai/providers/azure/responses", () => import("@xiaochuan/ai/providers/azure/responses")],
  ["@xiaochuan/ai/providers/azure/images", () => import("@xiaochuan/ai/providers/azure/images")],
  ["@xiaochuan/ai/providers/azure/embeddings", () => import("@xiaochuan/ai/providers/azure/embeddings")],
  ["@xiaochuan/ai/providers/azure/messages", () => import("@xiaochuan/ai/providers/azure/messages")],
  ["@xiaochuan/ai/providers/baseten", () => import("@xiaochuan/ai/providers/baseten")],
  ["@xiaochuan/ai/providers/baseten/decisions", () => import("@xiaochuan/ai/providers/baseten/decisions")],
  ["@xiaochuan/ai/providers/byteplus/videos", () => import("@xiaochuan/ai/providers/byteplus/videos")],
  ["@xiaochuan/ai/providers/cerebras", () => import("@xiaochuan/ai/providers/cerebras")],
  ["@xiaochuan/ai/providers/cloudflare-ai-gateway", () => import("@xiaochuan/ai/providers/cloudflare-ai-gateway")],
  [
    "@xiaochuan/ai/providers/cloudflare-ai-gateway/decisions",
    () => import("@xiaochuan/ai/providers/cloudflare-ai-gateway/decisions"),
  ],
  ["@xiaochuan/ai/providers/cloudflare-workers-ai", () => import("@xiaochuan/ai/providers/cloudflare-workers-ai")],
  [
    "@xiaochuan/ai/providers/cloudflare-workers-ai/decisions",
    () => import("@xiaochuan/ai/providers/cloudflare-workers-ai/decisions"),
  ],
  [
    "@xiaochuan/ai/providers/cloudflare-workers-ai/images",
    () => import("@xiaochuan/ai/providers/cloudflare-workers-ai/images"),
  ],
  ["@xiaochuan/ai/providers/cohere", () => import("@xiaochuan/ai/providers/cohere")],
  ["@xiaochuan/ai/providers/cohere/chat", () => import("@xiaochuan/ai/providers/cohere/chat")],
  ["@xiaochuan/ai/providers/cohere/embeddings", () => import("@xiaochuan/ai/providers/cohere/embeddings")],
  ["@xiaochuan/ai/providers/deepinfra", () => import("@xiaochuan/ai/providers/deepinfra")],
  ["@xiaochuan/ai/providers/deepinfra/embeddings", () => import("@xiaochuan/ai/providers/deepinfra/embeddings")],
  ["@xiaochuan/ai/providers/deepseek", () => import("@xiaochuan/ai/providers/deepseek")],
  ["@xiaochuan/ai/providers/digitalocean", () => import("@xiaochuan/ai/providers/digitalocean")],
  ["@xiaochuan/ai/providers/digitalocean/decisions", () => import("@xiaochuan/ai/providers/digitalocean/decisions")],
  ["@xiaochuan/ai/providers/digitalocean/embeddings", () => import("@xiaochuan/ai/providers/digitalocean/embeddings")],
  ["@xiaochuan/ai/providers/digitalocean/images", () => import("@xiaochuan/ai/providers/digitalocean/images")],
  ["@xiaochuan/ai/providers/digitalocean/responses", () => import("@xiaochuan/ai/providers/digitalocean/responses")],
  ["@xiaochuan/ai/providers/fireworks", () => import("@xiaochuan/ai/providers/fireworks")],
  ["@xiaochuan/ai/providers/fireworks/embeddings", () => import("@xiaochuan/ai/providers/fireworks/embeddings")],
  ["@xiaochuan/ai/providers/google", () => import("@xiaochuan/ai/providers/google")],
  ["@xiaochuan/ai/providers/google/decisions", () => import("@xiaochuan/ai/providers/google/decisions")],
  ["@xiaochuan/ai/providers/google/interactions", () => import("@xiaochuan/ai/providers/google/interactions")],
  ["@xiaochuan/ai/providers/google/embeddings", () => import("@xiaochuan/ai/providers/google/embeddings")],
  ["@xiaochuan/ai/providers/google/images", () => import("@xiaochuan/ai/providers/google/images")],
  ["@xiaochuan/ai/providers/google/videos", () => import("@xiaochuan/ai/providers/google/videos")],
  ["@xiaochuan/ai/providers/google-vertex", () => import("@xiaochuan/ai/providers/google-vertex")],
  ["@xiaochuan/ai/providers/google-vertex/chat", () => import("@xiaochuan/ai/providers/google-vertex/chat")],
  ["@xiaochuan/ai/providers/google-vertex/gemini", () => import("@xiaochuan/ai/providers/google-vertex/gemini")],
  [
    "@xiaochuan/ai/providers/google-vertex/interactions",
    () => import("@xiaochuan/ai/providers/google-vertex/interactions"),
  ],
  ["@xiaochuan/ai/providers/google-vertex/messages", () => import("@xiaochuan/ai/providers/google-vertex/messages")],
  ["@xiaochuan/ai/providers/google-vertex/mistral", () => import("@xiaochuan/ai/providers/google-vertex/mistral")],
  ["@xiaochuan/ai/providers/google-vertex/responses", () => import("@xiaochuan/ai/providers/google-vertex/responses")],
  ["@xiaochuan/ai/providers/google-vertex/embeddings", () => import("@xiaochuan/ai/providers/google-vertex/embeddings")],
  ["@xiaochuan/ai/providers/google-vertex/images", () => import("@xiaochuan/ai/providers/google-vertex/images")],
  ["@xiaochuan/ai/providers/google-vertex-messages", () => import("@xiaochuan/ai/providers/google-vertex-messages")],
  ["@xiaochuan/ai/providers/groq", () => import("@xiaochuan/ai/providers/groq")],
  ["@xiaochuan/ai/providers/meta", () => import("@xiaochuan/ai/providers/meta")],
  ["@xiaochuan/ai/providers/meta/chat", () => import("@xiaochuan/ai/providers/meta/chat")],
  ["@xiaochuan/ai/providers/meta/images", () => import("@xiaochuan/ai/providers/meta/images")],
  ["@xiaochuan/ai/providers/meta/messages", () => import("@xiaochuan/ai/providers/meta/messages")],
  ["@xiaochuan/ai/providers/meta/responses", () => import("@xiaochuan/ai/providers/meta/responses")],
  ["@xiaochuan/ai/providers/minimax", () => import("@xiaochuan/ai/providers/minimax")],
  ["@xiaochuan/ai/providers/minimax/chat", () => import("@xiaochuan/ai/providers/minimax/chat")],
  ["@xiaochuan/ai/providers/minimax/images", () => import("@xiaochuan/ai/providers/minimax/images")],
  ["@xiaochuan/ai/providers/minimax/messages", () => import("@xiaochuan/ai/providers/minimax/messages")],
  ["@xiaochuan/ai/providers/minimax/responses", () => import("@xiaochuan/ai/providers/minimax/responses")],
  ["@xiaochuan/ai/providers/minimax/videos", () => import("@xiaochuan/ai/providers/minimax/videos")],
  ["@xiaochuan/ai/providers/mistral", () => import("@xiaochuan/ai/providers/mistral")],
  ["@xiaochuan/ai/providers/moonshot", () => import("@xiaochuan/ai/providers/moonshot")],
  ["@xiaochuan/ai/providers/moonshot/chat", () => import("@xiaochuan/ai/providers/moonshot/chat")],
  ["@xiaochuan/ai/providers/moonshot/messages", () => import("@xiaochuan/ai/providers/moonshot/messages")],
  ["@xiaochuan/ai/providers/moonshot/responses", () => import("@xiaochuan/ai/providers/moonshot/responses")],
  ["@xiaochuan/ai/providers/openai", () => import("@xiaochuan/ai/providers/openai")],
  ["@xiaochuan/ai/providers/openai/chat", () => import("@xiaochuan/ai/providers/openai/chat")],
  ["@xiaochuan/ai/providers/openai/responses", () => import("@xiaochuan/ai/providers/openai/responses")],
  ["@xiaochuan/ai/providers/openai/images", () => import("@xiaochuan/ai/providers/openai/images")],
  ["@xiaochuan/ai/providers/openai/embeddings", () => import("@xiaochuan/ai/providers/openai/embeddings")],
  ["@xiaochuan/ai/providers/openai-compatible", () => import("@xiaochuan/ai/providers/openai-compatible")],
  [
    "@xiaochuan/ai/providers/openai-compatible/responses",
    () => import("@xiaochuan/ai/providers/openai-compatible/responses"),
  ],
  ["@xiaochuan/ai/providers/openai-compatible/images", () => import("@xiaochuan/ai/providers/openai-compatible/images")],
  [
    "@xiaochuan/ai/providers/openai-compatible/decisions",
    () => import("@xiaochuan/ai/providers/openai-compatible/decisions"),
  ],
  [
    "@xiaochuan/ai/providers/openai-compatible/embeddings",
    () => import("@xiaochuan/ai/providers/openai-compatible/embeddings"),
  ],
  [
    "@xiaochuan/ai/providers/openai-compatible-responses",
    () => import("@xiaochuan/ai/providers/openai-compatible-responses"),
  ],
  ["@xiaochuan/ai/providers/xiaochuan/decisions", () => import("@xiaochuan/ai/providers/xiaochuan/decisions")],
  ["@xiaochuan/ai/providers/openrouter", () => import("@xiaochuan/ai/providers/openrouter")],
  ["@xiaochuan/ai/providers/openrouter/decisions", () => import("@xiaochuan/ai/providers/openrouter/decisions")],
  ["@xiaochuan/ai/providers/openrouter/embeddings", () => import("@xiaochuan/ai/providers/openrouter/embeddings")],
  ["@xiaochuan/ai/providers/openrouter/images", () => import("@xiaochuan/ai/providers/openrouter/images")],
  ["@xiaochuan/ai/providers/openrouter/videos", () => import("@xiaochuan/ai/providers/openrouter/videos")],
  ["@xiaochuan/ai/providers/openrouter/responses", () => import("@xiaochuan/ai/providers/openrouter/responses")],
  ["@xiaochuan/ai/providers/togetherai", () => import("@xiaochuan/ai/providers/togetherai")],
  ["@xiaochuan/ai/providers/typesafe-ai/decisions", () => import("@xiaochuan/ai/providers/typesafe-ai/decisions")],
  ["@xiaochuan/ai/providers/venice", () => import("@xiaochuan/ai/providers/venice")],
  ["@xiaochuan/ai/providers/venice/responses", () => import("@xiaochuan/ai/providers/venice/responses")],
  ["@xiaochuan/ai/providers/volcengine/videos", () => import("@xiaochuan/ai/providers/volcengine/videos")],
  ["@xiaochuan/ai/providers/vercel-ai-gateway", () => import("@xiaochuan/ai/providers/vercel-ai-gateway")],
  ["@xiaochuan/ai/providers/vercel-ai-gateway/chat", () => import("@xiaochuan/ai/providers/vercel-ai-gateway/chat")],
  [
    "@xiaochuan/ai/providers/vercel-ai-gateway/messages",
    () => import("@xiaochuan/ai/providers/vercel-ai-gateway/messages"),
  ],
  [
    "@xiaochuan/ai/providers/vercel-ai-gateway/responses",
    () => import("@xiaochuan/ai/providers/vercel-ai-gateway/responses"),
  ],
  [
    "@xiaochuan/ai/providers/vercel-ai-gateway/decisions",
    () => import("@xiaochuan/ai/providers/vercel-ai-gateway/decisions"),
  ],
  ["@xiaochuan/ai/providers/vercel-ai-gateway/images", () => import("@xiaochuan/ai/providers/vercel-ai-gateway/images")],
  [
    "@xiaochuan/ai/providers/vercel-ai-gateway/embeddings",
    () => import("@xiaochuan/ai/providers/vercel-ai-gateway/embeddings"),
  ],
  ["@xiaochuan/ai/providers/xai", () => import("@xiaochuan/ai/providers/xai")],
  ["@xiaochuan/ai/providers/xai/images", () => import("@xiaochuan/ai/providers/xai/images")],
  ["@xiaochuan/ai/providers/xai/videos", () => import("@xiaochuan/ai/providers/xai/videos")],
  ["@xiaochuan/ai/providers/zai", () => import("@xiaochuan/ai/providers/zai")],
  ["@xiaochuan/ai/providers/zai/chat", () => import("@xiaochuan/ai/providers/zai/chat")],
  ["@xiaochuan/ai/providers/zai/images", () => import("@xiaochuan/ai/providers/zai/images")],
  ["@xiaochuan/ai/providers/zai-coding-plan", () => import("@xiaochuan/ai/providers/zai-coding-plan")],
  ["@xiaochuan/ai/providers/zai-coding-plan/chat", () => import("@xiaochuan/ai/providers/zai-coding-plan/chat")],
  ["@xiaochuan/ai/providers/zai-coding-plan/messages", () => import("@xiaochuan/ai/providers/zai-coding-plan/messages")],
  [
    "@xiaochuan/ai/providers/zai-coding-plan/responses",
    () => import("@xiaochuan/ai/providers/zai-coding-plan/responses"),
  ],
])

/** Native `@xiaochuan/ai/providers/*` entrypoints bundled with Core and loadable by name from config. */
export const builtinPackages: ReadonlySet<string> = new Set(builtins.keys())

export const loadPackage = Effect.fn("Provider.loadPackage")(function* (input: string, npm?: Npm.Interface) {
  const specifier = AISDKNative.packageName(input)
  const builtin = builtins.get(specifier)
  if (builtin) return yield* importPackage(specifier, specifier, builtin)
  const resolved = yield* Effect.sync(() => {
    if (specifier.startsWith("file://") || specifier.startsWith("@xiaochuan/ai/")) return specifier
    try {
      return import.meta.resolve(specifier)
    } catch {
      return undefined
    }
  })
  if (resolved) return yield* importPackage(specifier, resolved)
  if (!npm) {
    return yield* new LoadError({
      package: specifier,
      cause: new Error(`Provider package ${specifier} is not installed`),
    })
  }
  const parts = specifier.split("/")
  const root = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : (parts[0] ?? specifier)
  const installed = yield* npm.add(root).pipe(Effect.mapError((cause) => new LoadError({ package: specifier, cause })))
  const entrypoint = yield* Effect.try({
    try: () => resolveModule(specifier, installed.directory),
    catch: (cause) => new LoadError({ package: specifier, cause }),
  })
  return yield* importPackage(specifier, entrypoint)
})

const settingsKeys = Struct.keys(Provider.Settings.schema.fields)
const providerOnlyKeys = settingsKeys.filter((key) => !(key in Model.Settings.schema.fields))

/** The provider options: every settings key Xiaochuan doesn't read itself. */
export function nativeSettings(settings: Settings) {
  return Struct.omit(settings, settingsKeys)
}

/** Settings a model inherits from its provider. */
export function modelSettings(settings: Settings | undefined) {
  return settings && Struct.omit(settings, providerOnlyKeys)
}

const decodeTimeout = Schema.decodeUnknownOption(HttpTimeout)

/** Applied to `headerTimeout` when provider settings leave it unset or invalid. */
export const DEFAULT_TIMEOUT_MS = 300_000

/**
 * Applied to `chunkTimeout` when provider settings leave it unset or invalid. Some providers, such as DeepSeek, have
 * specifically asked clients to allow at least 15 minutes, because their models can stream nothing for minutes while
 * they reason.
 */
export const DEFAULT_CHUNK_TIMEOUT_MS = 900_000

/** One timeout setting without a default; invalid values are dropped. */
export function timeout(value: unknown) {
  return Option.getOrUndefined(decodeTimeout(value))
}

/** Request timeouts from provider settings, resolved for every route. `timeout` has no default. */
export function timeouts(settings: Readonly<Record<string, unknown>>) {
  return {
    timeout: timeout(settings.timeout),
    headerTimeout: timeout(settings.headerTimeout) ?? DEFAULT_TIMEOUT_MS,
    chunkTimeout: timeout(settings.chunkTimeout) ?? DEFAULT_CHUNK_TIMEOUT_MS,
  }
}

const decodeEncoding = Schema.decodeUnknownOption(Provider.Encoding)

/** Request body encoding from provider or model settings; invalid values are dropped. */
export function encoding(settings: Readonly<Record<string, unknown>>) {
  return Option.getOrUndefined(decodeEncoding(settings.encoding))
}

const decodeTls = Schema.decodeUnknownOption(Provider.Tls)

/** Client certificate from provider settings. An empty `cert` or `key`, such as a missing `{file:}`, leaves it unset. */
export function tls(settings: Readonly<Record<string, unknown>>) {
  const value = Option.getOrUndefined(decodeTls(settings.tls))
  return value?.cert && value.key ? value : undefined
}

export const Request = Provider.Request
export type Request = Provider.Request

export const Compaction = Provider.Compaction
export type Compaction = Provider.Compaction

export const Cache = Provider.Cache
export type Cache = Provider.Cache

export const Transport = Provider.Transport
export type Transport = Provider.Transport

export const Settings = Provider.Settings
export type Settings = Provider.Settings

export const Info = Provider.Info
export type Info = Provider.Info

export type MutableInfo = DeepMutable<Info>

export { Event } from "@xiaochuan/schema/provider"

/** Provider metadata owns its drafts; model definitions remain immutable inputs. */
export type Definition = {
  readonly provider: Info
  readonly models: ReadonlyMap<Model.ID, Model.Info>
  readonly sourceConnection?: IntegrationConnection.Info
}

export interface Editor {
  readonly list: () => readonly Definition[]
  readonly get: (providerID: ID) => Definition | undefined
  readonly add: (definition: {
    readonly info: Info
    readonly models: readonly Model.Info[]
    readonly sourceConnection?: IntegrationConnection.Info
  }) => void
  readonly update: (providerID: ID, update: (provider: MutableInfo) => void) => void
  readonly remove: (providerID: ID) => void
  readonly models: {
    readonly set: (providerID: ID, models: readonly Model.Info[]) => void
    readonly update: (providerID: ID, modelID: Model.ID, update: (model: DeepMutable<Model.Info>) => void) => void
    readonly remove: (providerID: ID, modelID: Model.ID) => void
  }
}

export interface Snapshot {
  readonly records: ReadonlyMap<ID, Definition>
  readonly available: readonly Definition[]
  readonly providers: readonly Info[]
}

export interface Interface extends State.Transformable<Editor> {
  readonly get: (providerID: ID) => Effect.Effect<Info | undefined>
  readonly all: () => Effect.Effect<readonly Info[]>
  readonly available: () => Effect.Effect<readonly Info[]>
  /** Internal definition/access snapshot; raw model inventories never cross the HTTP API. */
  readonly snapshot: () => Effect.Effect<Snapshot>
}

export class Service extends Context.Service<Service, Interface>()("@xiaochuan/Provider") {}

// Every location references the same index for a shared immutable definition array.
const definitions = new WeakMap<readonly Model.Info[], Map<ID, ReadonlyMap<Model.ID, Model.Info>>>()
function index(providerID: ID, models: readonly Model.Info[]) {
  const indexes = definitions.get(models) ?? new Map<ID, ReadonlyMap<Model.ID, Model.Info>>()
  const cached = indexes.get(providerID)
  if (cached) return cached
  // Model shares these definitions without copying, so a foreign definition takes this provider's identity here.
  const result = freeze(
    new Map(models.map((model) => [model.id, model.providerID === providerID ? model : { ...model, providerID }])),
    true,
  )
  indexes.set(providerID, result)
  definitions.set(models, indexes)
  return result
}

const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const bus = yield* Bus.Service
    const integrations = yield* Integration.Service
    const location = yield* Location.Service
    const state = State.create<
      Map<
        ID,
        {
          provider: MutableInfo
          models: ReadonlyMap<Model.ID, Model.Info>
          sourceConnection?: IntegrationConnection.Info
        }
      >,
      Editor
    >({
      name: "provider",
      initial: () => new Map(),
      editor: (records) => {
        const maps = new WeakSet<ReadonlyMap<Model.ID, Model.Info>>()
        const models = new WeakSet<Model.Info>()
        const entry = (id: ID) => {
          const current = records.get(id)
          if (current) return current
          const added = { provider: Info.empty(id) as MutableInfo, models: new Map<Model.ID, Model.Info>() }
          records.set(id, added)
          maps.add(added.models)
          return added
        }
        const writable = (id: ID) => {
          const record = entry(id)
          if (maps.has(record.models)) return record.models as Map<Model.ID, Model.Info>
          const owned = new Map(record.models)
          record.models = owned
          maps.add(owned)
          return owned
        }
        return {
          list: () => Array.from(records.values()),
          get: (id) => records.get(id),
          add: (definition) => {
            records.set(definition.info.id, {
              provider: structuredClone(definition.info) as MutableInfo,
              models: index(definition.info.id, definition.models),
              sourceConnection: definition.sourceConnection,
            })
          },
          update: (id, update) => {
            const record = entry(id)
            update(record.provider)
            record.provider.id = id
            AISDKNative.rewrite(record.provider, {
              builtins: builtinPackages,
              specifier: record.provider.package,
              providerID: id,
              canonical: record.provider.canonical,
            })
          },
          remove: (id) => {
            records.delete(id)
          },
          models: {
            set: (id, values) => {
              entry(id).models = index(id, values)
            },
            update: (providerID, modelID, update) => {
              const record = entry(providerID)
              const target = writable(providerID)
              const current = target.get(modelID)
              const model = // An earlier add/set can publish and freeze an owned model within this fold.
                (
                  current && models.has(current) && !Object.isFrozen(current)
                    ? current
                    : current
                      ? structuredClone(current)
                      : Model.Info.default(providerID, modelID)
                ) as DeepMutable<Model.Info>
              update(model)
              model.id = modelID
              model.providerID = providerID
              AISDKNative.rewrite(model, {
                builtins: builtinPackages,
                specifier: model.package ?? record.provider.package,
                providerID,
                canonical: model.canonical ?? record.provider.canonical,
                modelID: model.modelID ?? modelID,
              })
              models.add(model)
              target.set(modelID, model)
            },
            remove: (providerID, modelID) => {
              if (!records.has(providerID)) return
              writable(providerID).delete(modelID)
            },
          },
        }
      },
      notify: () => notify,
    })
    // Registrations may outlive a borrowed service layer; their later disposal must
    // not query dependencies that have already closed.
    yield* Effect.addFinalizer(() => State.shutdown(state.reload()))
    let cached: { records: Snapshot["records"]; value: Snapshot } | undefined
    const snapshot = Effect.fn("Provider.snapshot")(function* () {
      while (true) {
        const revision = integrations.revision()
        const records = state.get()
        // Connection presence decides availability; resolving OAuth tokens belongs to execution.
        const connections = yield* integrations.list()
        // Either fold can disable a plugin that also contributed to the other domain.
        if (revision !== integrations.revision() || records !== state.get()) continue
        const byID = new Map(connections.map((integration) => [integration.id, integration]))
        const available = Array.from(records.values()).filter((record) => {
          if (record.provider.activation === "disabled") return false
          const integration = byID.get(record.provider.integrationID ?? Integration.ID.make(record.provider.id))
          // Never combine the previous account's discovered endpoints/models with a new connection.
          if (
            record.sourceConnection &&
            IntegrationConnection.key(record.sourceConnection) !==
              IntegrationConnection.key(integration?.connections[0])
          )
            return false
          if (record.provider.activation === "enabled") return true
          if (integration?.connections.length) return true
          return record.provider.integrationID === undefined && !integration
        })
        // A credential change that leaves the same definitions available is not a catalog change.
        if (
          cached?.records === records &&
          cached.value.available.length === available.length &&
          cached.value.available.every((record, index) => record === available[index])
        )
          return cached.value
        const value = freeze({ records, available, providers: available.map((record) => record.provider) }, true)
        cached = { records, value }
        return value
      }
    })
    let published: Snapshot | undefined
    const notify: Effect.Effect<void> = Effect.gen(function* () {
      const value = yield* snapshot()
      if (value === published) return
      published = value
      yield* bus.publish(
        Provider.Event.Updated,
        {},
        {
          location: { directory: location.directory, workspaceID: location.workspaceID },
        },
      )
    })
    yield* bus.subscribe([Integration.Event.Updated, Credential.Event.Switched]).pipe(
      Stream.runForEach(() => notify),
      Effect.forkScoped({ startImmediately: true }),
    )
    return Service.of({
      transform: state.transform,
      reload: state.reload,
      get: Effect.fn("Provider.get")((id) => Effect.sync(() => freeze(state.get().get(id)?.provider, true))),
      all: Effect.fn("Provider.all")(() =>
        Effect.sync(() => Array.from(state.get().values(), (record) => freeze(record.provider, true))),
      ),
      available: Effect.fn("Provider.available")(() => snapshot().pipe(Effect.map((value) => value.providers))),
      snapshot,
    })
  }),
)

export const node = makeLocationNode({ service: Service, layer, deps: [Bus.node, Integration.node, Location.node] })

const importPackage = Effect.fn("Provider.importPackage")(function* (
  specifier: string,
  entrypoint: string,
  load = () => importModule(entrypoint),
) {
  const module = yield* Effect.tryPromise({
    try: () => {
      const existing = packages.get(entrypoint)
      if (existing) return existing
      const loaded = load()
      packages.set(entrypoint, loaded)
      return loaded
    },
    catch: (cause) => new LoadError({ package: specifier, cause }),
  })
  if (typeof module !== "object" || module === null || typeof (module as { model?: unknown }).model !== "function") {
    return yield* new LoadError({
      package: specifier,
      cause: new Error(`Provider package ${specifier} does not export model(modelID, settings)`),
    })
  }
  return module as ProviderPackage.Definition
})
