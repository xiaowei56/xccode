// TODO: Keep additional network capabilities inside Schema and Protocol as the client grows; /effect must never import
// Core or Server. Preserve these datatype exports so internal model reorganizations do not require caller migrations.
import type { Effect } from "effect"
import type { Xccode } from "./client.js"

export * from "./generated/index"
export { Xccode } from "./client.js"
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
export { Agent } from "@xccode/schema/agent"
export { Command } from "@xccode/schema/command"
export { Config } from "@xccode/schema/config"
export { Credential } from "@xccode/schema/credential"
export { Event } from "@xccode/schema/event"
export { EventLog } from "@xccode/schema/event-log"
export { FileSystem } from "@xccode/schema/filesystem"
export { Form } from "@xccode/schema/form"
export { Integration } from "@xccode/schema/integration"
export { Location } from "@xccode/schema/location"
export { Model } from "@xccode/schema/model"
export { Permission } from "@xccode/schema/permission"
export { PermissionSaved } from "@xccode/schema/permission-saved"
export { Project } from "@xccode/schema/project"
export { Worktree } from "@xccode/schema/worktree"
export { Vcs } from "@xccode/schema/vcs"
export { Provider } from "@xccode/schema/provider"
export { Pty } from "@xccode/schema/pty"
export { Question } from "@xccode/schema/question"
export { Reference } from "@xccode/schema/reference"
export { WebSearch } from "@xccode/schema/websearch"
export { AbsolutePath, RelativePath } from "@xccode/schema/schema"
export { Session } from "@xccode/schema/session"
export { SessionInbox } from "@xccode/schema/session-inbox"
export { SessionMessage } from "@xccode/schema/session-message"
export { Skill } from "@xccode/schema/skill"
export { Prompt } from "@xccode/schema/prompt"
export { PromptInput } from "@xccode/schema/prompt-input"
export type { XccodeEvent } from "@xccode/protocol/groups/event"
export type XccodeClient = Effect.Success<ReturnType<typeof Xccode.make>>
