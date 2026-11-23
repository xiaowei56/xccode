// TODO: Keep additional network capabilities inside Schema and Protocol as the client grows; /effect must never import
// Core or Server. Preserve these datatype exports so internal model reorganizations do not require caller migrations.
import type { Effect } from "effect"
import type { Xiaochuan } from "./client.js"

export * from "./generated/index"
export { Xiaochuan } from "./client.js"
export type {
  AgentApi,
  AppApi,
  CommandApi,
  ConfigApi,
  EventApi,
  IntegrationApi,
  ModelApi,
  PluginApi,
  ProviderApi,
  ReferenceApi,
  RpcApi,
  RpcClient,
  WebSearchApi,
  SessionApi,
  SkillApi,
} from "./api.js"
export { Agent } from "@xiaochuan/schema/agent"
export { Command } from "@xiaochuan/schema/command"
export { Config } from "@xiaochuan/schema/config"
export { Credential } from "@xiaochuan/schema/credential"
export { Event } from "@xiaochuan/schema/event"
export { EventLog } from "@xiaochuan/schema/event-log"
export { FileSystem } from "@xiaochuan/schema/filesystem"
export { Form } from "@xiaochuan/schema/form"
export { Integration } from "@xiaochuan/schema/integration"
export { Location } from "@xiaochuan/schema/location"
export { Model } from "@xiaochuan/schema/model"
export { Permission } from "@xiaochuan/schema/permission"
export { PermissionSaved } from "@xiaochuan/schema/permission-saved"
export { Project } from "@xiaochuan/schema/project"
export { Worktree } from "@xiaochuan/schema/worktree"
export { Vcs } from "@xiaochuan/schema/vcs"
export { Provider } from "@xiaochuan/schema/provider"
export { Pty } from "@xiaochuan/schema/pty"
export { Question } from "@xiaochuan/schema/question"
export { Reference } from "@xiaochuan/schema/reference"
export { WebSearch } from "@xiaochuan/schema/websearch"
export { AbsolutePath, RelativePath } from "@xiaochuan/schema/schema"
export { Session } from "@xiaochuan/schema/session"
export { SessionInbox } from "@xiaochuan/schema/session-inbox"
export { SessionMessage } from "@xiaochuan/schema/session-message"
export { Skill } from "@xiaochuan/schema/skill"
export { Prompt } from "@xiaochuan/schema/prompt"
export { PromptInput } from "@xiaochuan/schema/prompt-input"
export type { XiaochuanEvent } from "@xiaochuan/protocol/groups/event"
export type XiaochuanClient = Effect.Success<ReturnType<typeof Xiaochuan.make>>
