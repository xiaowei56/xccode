export * as Provider from "./provider.js"

import { Context, Effect, Layer, Option, Schema, Stream, Struct } from "effect"
import { Provider } from "@xccode/schema/provider"
import { Model } from "@xccode/schema/model"
import { makeLocationNode } from "@xccode/util/effect/app-node"
import { HttpTimeout, type ProviderPackage } from "@xccode/ai/effect"
import { Npm } from "@xccode/util/npm"
import type { DeepMutable } from "./schema.js"
import { importModule, resolveModule } from "@xccode/util/runtime-import"
import { Bus } from "./bus.js"
import { Integration } from "./integration.js"
import { State } from "./state.js"
import { IntegrationConnection } from "./integration/connection.js"
import { Credential } from "@xccode/schema/credential"
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
  ["@xccode/ai/providers/alibaba", () => import("@xccode/ai/providers/alibaba")],
  ["@xccode/ai/providers/alibaba/chat", () => import("@xccode/ai/providers/alibaba/chat")],
  ["@xccode/ai/providers/alibaba/messages", () => import("@xccode/ai/providers/alibaba/messages")],
  ["@xccode/ai/providers/alibaba/responses", () => import("@xccode/ai/providers/alibaba/responses")],
  ["@xccode/ai/providers/alibaba/images", () => import("@xccode/ai/providers/alibaba/images")],
  ["@xccode/ai/providers/alibaba/embeddings", () => import("@xccode/ai/providers/alibaba/embeddings")],
  ["@xccode/ai/providers/amazon-bedrock", () => import("@xccode/ai/providers/amazon-bedrock")],
  ["@xccode/ai/providers/amazon-bedrock/mantle", () => import("@xccode/ai/providers/amazon-bedrock/mantle")],
  [
    "@xccode/ai/providers/amazon-bedrock/mantle/chat",
    () => import("@xccode/ai/providers/amazon-bedrock/mantle/chat"),
  ],
  [
    "@xccode/ai/providers/amazon-bedrock/mantle/messages",
    () => import("@xccode/ai/providers/amazon-bedrock/mantle/messages"),
  ],
  [
    "@xccode/ai/providers/amazon-bedrock/mantle/responses",
    () => import("@xccode/ai/providers/amazon-bedrock/mantle/responses"),
  ],
  ["@xccode/ai/providers/anthropic", () => import("@xccode/ai/providers/anthropic")],
  ["@xccode/ai/providers/anthropic-compatible", () => import("@xccode/ai/providers/anthropic-compatible")],
  ["@xccode/ai/providers/azure", () => import("@xccode/ai/providers/azure")],
  ["@xccode/ai/providers/azure/chat", () => import("@xccode/ai/providers/azure/chat")],
  ["@xccode/ai/providers/azure/responses", () => import("@xccode/ai/providers/azure/responses")],
  ["@xccode/ai/providers/azure/images", () => import("@xccode/ai/providers/azure/images")],
  ["@xccode/ai/providers/azure/embeddings", () => import("@xccode/ai/providers/azure/embeddings")],
  ["@xccode/ai/providers/azure/messages", () => import("@xccode/ai/providers/azure/messages")],
  ["@xccode/ai/providers/baseten", () => import("@xccode/ai/providers/baseten")],
  ["@xccode/ai/providers/baseten/decisions", () => import("@xccode/ai/providers/baseten/decisions")],
  ["@xccode/ai/providers/byteplus/videos", () => import("@xccode/ai/providers/byteplus/videos")],
  ["@xccode/ai/providers/cerebras", () => import("@xccode/ai/providers/cerebras")],
  ["@xccode/ai/providers/cloudflare-ai-gateway", () => import("@xccode/ai/providers/cloudflare-ai-gateway")],
  [
    "@xccode/ai/providers/cloudflare-ai-gateway/decisions",
    () => import("@xccode/ai/providers/cloudflare-ai-gateway/decisions"),
  ],
  ["@xccode/ai/providers/cloudflare-workers-ai", () => import("@xccode/ai/providers/cloudflare-workers-ai")],
  [
    "@xccode/ai/providers/cloudflare-workers-ai/decisions",
    () => import("@xccode/ai/providers/cloudflare-workers-ai/decisions"),
  ],
  [
    "@xccode/ai/providers/cloudflare-workers-ai/images",
    () => import("@xccode/ai/providers/cloudflare-workers-ai/images"),
  ],
  ["@xccode/ai/providers/cohere", () => import("@xccode/ai/providers/cohere")],
  ["@xccode/ai/providers/cohere/chat", () => import("@xccode/ai/providers/cohere/chat")],
  ["@xccode/ai/providers/cohere/embeddings", () => import("@xccode/ai/providers/cohere/embeddings")],
  ["@xccode/ai/providers/deepinfra", () => import("@xccode/ai/providers/deepinfra")],
  ["@xccode/ai/providers/deepinfra/embeddings", () => import("@xccode/ai/providers/deepinfra/embeddings")],
  ["@xccode/ai/providers/deepseek", () => import("@xccode/ai/providers/deepseek")],
  ["@xccode/ai/providers/digitalocean", () => import("@xccode/ai/providers/digitalocean")],
  ["@xccode/ai/providers/digitalocean/decisions", () => import("@xccode/ai/providers/digitalocean/decisions")],
  ["@xccode/ai/providers/digitalocean/embeddings", () => import("@xccode/ai/providers/digitalocean/embeddings")],
  ["@xccode/ai/providers/digitalocean/images", () => import("@xccode/ai/providers/digitalocean/images")],
  ["@xccode/ai/providers/digitalocean/responses", () => import("@xccode/ai/providers/digitalocean/responses")],
  ["@xccode/ai/providers/fireworks", () => import("@xccode/ai/providers/fireworks")],
  ["@xccode/ai/providers/fireworks/embeddings", () => import("@xccode/ai/providers/fireworks/embeddings")],
  ["@xccode/ai/providers/google", () => import("@xccode/ai/providers/google")],
  ["@xccode/ai/providers/google/decisions", () => import("@xccode/ai/providers/google/decisions")],
  ["@xccode/ai/providers/google/interactions", () => import("@xccode/ai/providers/google/interactions")],
  ["@xccode/ai/providers/google/embeddings", () => import("@xccode/ai/providers/google/embeddings")],
  ["@xccode/ai/providers/google/images", () => import("@xccode/ai/providers/google/images")],
  ["@xccode/ai/providers/google/videos", () => import("@xccode/ai/providers/google/videos")],
  ["@xccode/ai/providers/google-vertex", () => import("@xccode/ai/providers/google-vertex")],
  ["@xccode/ai/providers/google-vertex/chat", () => import("@xccode/ai/providers/google-vertex/chat")],
  ["@xccode/ai/providers/google-vertex/gemini", () => import("@xccode/ai/providers/google-vertex/gemini")],
  [
    "@xccode/ai/providers/google-vertex/interactions",
    () => import("@xccode/ai/providers/google-vertex/interactions"),
  ],
  ["@xccode/ai/providers/google-vertex/messages", () => import("@xccode/ai/providers/google-vertex/messages")],
  ["@xccode/ai/providers/google-vertex/mistral", () => import("@xccode/ai/providers/google-vertex/mistral")],
  ["@xccode/ai/providers/google-vertex/responses", () => import("@xccode/ai/providers/google-vertex/responses")],
  ["@xccode/ai/providers/google-vertex/embeddings", () => import("@xccode/ai/providers/google-vertex/embeddings")],
  ["@xccode/ai/providers/google-vertex/images", () => import("@xccode/ai/providers/google-vertex/images")],
  ["@xccode/ai/providers/google-vertex-messages", () => import("@xccode/ai/providers/google-vertex-messages")],
  ["@xccode/ai/providers/groq", () => import("@xccode/ai/providers/groq")],
  ["@xccode/ai/providers/meta", () => import("@xccode/ai/providers/meta")],
  ["@xccode/ai/providers/meta/chat", () => import("@xccode/ai/providers/meta/chat")],
  ["@xccode/ai/providers/meta/images", () => import("@xccode/ai/providers/meta/images")],
  ["@xccode/ai/providers/meta/messages", () => import("@xccode/ai/providers/meta/messages")],
  ["@xccode/ai/providers/meta/responses", () => import("@xccode/ai/providers/meta/responses")],
  ["@xccode/ai/providers/minimax", () => import("@xccode/ai/providers/minimax")],
  ["@xccode/ai/providers/minimax/chat", () => import("@xccode/ai/providers/minimax/chat")],
  ["@xccode/ai/providers/minimax/images", () => import("@xccode/ai/providers/minimax/images")],
  ["@xccode/ai/providers/minimax/messages", () => import("@xccode/ai/providers/minimax/messages")],
  ["@xccode/ai/providers/minimax/responses", () => import("@xccode/ai/providers/minimax/responses")],
  ["@xccode/ai/providers/minimax/videos", () => import("@xccode/ai/providers/minimax/videos")],
  ["@xccode/ai/providers/mistral", () => import("@xccode/ai/providers/mistral")],
  ["@xccode/ai/providers/moonshot", () => import("@xccode/ai/providers/moonshot")],
  ["@xccode/ai/providers/moonshot/chat", () => import("@xccode/ai/providers/moonshot/chat")],
  ["@xccode/ai/providers/moonshot/messages", () => import("@xccode/ai/providers/moonshot/messages")],
  ["@xccode/ai/providers/moonshot/responses", () => import("@xccode/ai/providers/moonshot/responses")],
  ["@xccode/ai/providers/openai", () => import("@xccode/ai/providers/openai")],
  ["@xccode/ai/providers/openai/chat", () => import("@xccode/ai/providers/openai/chat")],
  ["@xccode/ai/providers/openai/responses", () => import("@xccode/ai/providers/openai/responses")],
  ["@xccode/ai/providers/openai/images", () => import("@xccode/ai/providers/openai/images")],
  ["@xccode/ai/providers/openai/embeddings", () => import("@xccode/ai/providers/openai/embeddings")],
  ["@xccode/ai/providers/openai-compatible", () => import("@xccode/ai/providers/openai-compatible")],
  [
    "@xccode/ai/providers/openai-compatible/responses",
    () => import("@xccode/ai/providers/openai-compatible/responses"),
  ],
  ["@xccode/ai/providers/openai-compatible/images", () => import("@xccode/ai/providers/openai-compatible/images")],
  [
    "@xccode/ai/providers/openai-compatible/decisions",
    () => import("@xccode/ai/providers/openai-compatible/decisions"),
  ],
  [
    "@xccode/ai/providers/openai-compatible/embeddings",
    () => import("@xccode/ai/providers/openai-compatible/embeddings"),
  ],
  [
    "@xccode/ai/providers/openai-compatible-responses",
    () => import("@xccode/ai/providers/openai-compatible-responses"),
  ],
  ["@xccode/ai/providers/xccode/decisions", () => import("@xccode/ai/providers/xccode/decisions")],
  ["@xccode/ai/providers/openrouter", () => import("@xccode/ai/providers/openrouter")],
  ["@xccode/ai/providers/openrouter/decisions", () => import("@xccode/ai/providers/openrouter/decisions")],
  ["@xccode/ai/providers/openrouter/embeddings", () => import("@xccode/ai/providers/openrouter/embeddings")],
  ["@xccode/ai/providers/openrouter/images", () => import("@xccode/ai/providers/openrouter/images")],
  ["@xccode/ai/providers/openrouter/videos", () => import("@xccode/ai/providers/openrouter/videos")],
  ["@xccode/ai/providers/openrouter/responses", () => import("@xccode/ai/providers/openrouter/responses")],
  ["@xccode/ai/providers/togetherai", () => import("@xccode/ai/providers/togetherai")],
  ["@xccode/ai/providers/typesafe-ai/decisions", () => import("@xccode/ai/providers/typesafe-ai/decisions")],
  ["@xccode/ai/providers/venice", () => import("@xccode/ai/providers/venice")],
  ["@xccode/ai/providers/venice/responses", () => import("@xccode/ai/providers/venice/responses")],
  ["@xccode/ai/providers/volcengine/videos", () => import("@xccode/ai/providers/volcengine/videos")],
  ["@xccode/ai/providers/vercel-ai-gateway", () => import("@xccode/ai/providers/vercel-ai-gateway")],
  ["@xccode/ai/providers/vercel-ai-gateway/chat", () => import("@xccode/ai/providers/vercel-ai-gateway/chat")],
  [
    "@xccode/ai/providers/vercel-ai-gateway/messages",
    () => import("@xccode/ai/providers/vercel-ai-gateway/messages"),
  ],
  [
    "@xccode/ai/providers/vercel-ai-gateway/responses",
    () => import("@xccode/ai/providers/vercel-ai-gateway/responses"),
  ],
  [
    "@xccode/ai/providers/vercel-ai-gateway/decisions",
    () => import("@xccode/ai/providers/vercel-ai-gateway/decisions"),
  ],
  ["@xccode/ai/providers/vercel-ai-gateway/images", () => import("@xccode/ai/providers/vercel-ai-gateway/images")],
  [
    "@xccode/ai/providers/vercel-ai-gateway/embeddings",
    () => import("@xccode/ai/providers/vercel-ai-gateway/embeddings"),
  ],
  ["@xccode/ai/providers/xai", () => import("@xccode/ai/providers/xai")],
  ["@xccode/ai/providers/xai/images", () => import("@xccode/ai/providers/xai/images")],
  ["@xccode/ai/providers/xai/videos", () => import("@xccode/ai/providers/xai/videos")],
  ["@xccode/ai/providers/zai", () => import("@xccode/ai/providers/zai")],
  ["@xccode/ai/providers/zai/chat", () => import("@xccode/ai/providers/zai/chat")],
  ["@xccode/ai/providers/zai/images", () => import("@xccode/ai/providers/zai/images")],
  ["@xccode/ai/providers/zai-coding-plan", () => import("@xccode/ai/providers/zai-coding-plan")],
  ["@xccode/ai/providers/zai-coding-plan/chat", () => import("@xccode/ai/providers/zai-coding-plan/chat")],
  ["@xccode/ai/providers/zai-coding-plan/messages", () => import("@xccode/ai/providers/zai-coding-plan/messages")],
  [
    "@xccode/ai/providers/zai-coding-plan/responses",
    () => import("@xccode/ai/providers/zai-coding-plan/responses"),
  ],
])

/** Native `@xccode/ai/providers/*` entrypoints bundled with Core and loadable by name from config. */
export const builtinPackages: ReadonlySet<string> = new Set(builtins.keys())

export const loadPackage = Effect.fn("Provider.loadPackage")(function* (input: string, npm?: Npm.Interface) {
  const specifier = AISDKNative.packageName(input)
  const builtin = builtins.get(specifier)
  if (builtin) return yield* importPackage(specifier, specifier, builtin)
  const resolved = yield* Effect.sync(() => {
    if (specifier.startsWith("file://") || specifier.startsWith("@xccode/ai/")) return specifier
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

/** The provider options: every settings key Xccode doesn't read itself. */
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

export { Event } from "@xccode/schema/provider"

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

export class Service extends Context.Service<Service, Interface>()("@xccode/Provider") {}

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
