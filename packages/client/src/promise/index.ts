import type { Xccode } from "./client.js"

export * from "./generated/index.js"
export { Xccode } from "./client.js"
export { mediaHashFromUri, withMediaRefs, type MediaRequestOptions } from "./media.js"
export type {
  AgentApi,
  CommandApi,
  ConfigApi,
  EventApi,
  IntegrationApi,
  ModelApi,
  PluginApi,
  ProviderApi,
  ReferenceApi,
  RpcApi,
  RpcCallOptions,
  RpcClient,
  RpcEventPayload,
  WebSearchApi,
  SessionApi,
  SkillApi,
} from "./api.js"
export type { EventSubscribeOutput as XccodeEvent } from "./generated/types.js"
export type {
  MediaFileAttachment as PromptMediaFileAttachment,
  Attachment as PromptAttachment,
} from "@xccode/schema/prompt"
export type XccodeClient = ReturnType<typeof Xccode.make>
