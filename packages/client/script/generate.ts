import { NodeFileSystem } from "@effect/platform-node"
import { compile, emitEffectImported, emitEffectShape, emitPromise, write } from "@xiaochuan/httpapi-codegen"
import {
  ClientApi,
  clientNamespace,
  deprecatedClientPaths,
  effectOmitEndpoints,
  groupNames,
  promiseOmitEndpoints,
} from "@xiaochuan/protocol/client"
import { Agent } from "@xiaochuan/schema/agent"
import { Artifact } from "@xiaochuan/schema/artifact"
import { Automation } from "@xiaochuan/schema/automation"
import { Command } from "@xiaochuan/schema/command"
import { Config } from "@xiaochuan/schema/config"
import { Credential } from "@xiaochuan/schema/credential"
import { Event } from "@xiaochuan/schema/event"
import { EventLog } from "@xiaochuan/schema/event-log"
import { FileDiff } from "@xiaochuan/schema/file-diff"
import { FileSystem } from "@xiaochuan/schema/filesystem"
import { Form } from "@xiaochuan/schema/form"
import { Generate } from "@xiaochuan/schema/generate"
import { Instruction } from "@xiaochuan/schema/instruction"
import { InstructionEntry } from "@xiaochuan/schema/instruction-entry"
import { Integration } from "@xiaochuan/schema/integration"
import { Job } from "@xiaochuan/schema/job"
import { Location } from "@xiaochuan/schema/location"
import { Mcp } from "@xiaochuan/schema/mcp"
import { Model } from "@xiaochuan/schema/model"
import { Money } from "@xiaochuan/schema/money"
import { Permission } from "@xiaochuan/schema/permission"
import { PermissionSaved } from "@xiaochuan/schema/permission-saved"
import { Plugin } from "@xiaochuan/schema/plugin"
import { Project } from "@xiaochuan/schema/project"
import { Worktree } from "@xiaochuan/schema/worktree"
import { AgentAttachment, FileAttachment, Prompt, PromptMention } from "@xiaochuan/schema/prompt"
import { PromptInput } from "@xiaochuan/schema/prompt-input"
import { Provider } from "@xiaochuan/schema/provider"
import { Pty } from "@xiaochuan/schema/pty"
import { PtyTicket } from "@xiaochuan/schema/pty-ticket"
import { Question } from "@xiaochuan/schema/question"
import { Reference } from "@xiaochuan/schema/reference"
import { AbsolutePath, RelativePath } from "@xiaochuan/schema/schema"
import { Session } from "@xiaochuan/schema/session"
import { SessionMessage } from "@xiaochuan/schema/session-message"
import { SessionInbox } from "@xiaochuan/schema/session-inbox"
import { Shell } from "@xiaochuan/schema/shell"
import { Skill } from "@xiaochuan/schema/skill"
import { Snapshot } from "@xiaochuan/schema/snapshot"
import { UsageLimits } from "@xiaochuan/schema/usage-limits"
import { Vcs } from "@xiaochuan/schema/vcs"
import { WebSearch } from "@xiaochuan/schema/websearch"
import { Workspace } from "@xiaochuan/schema/workspace"
import { Effect, Schema } from "effect"
import { fileURLToPath } from "url"

const promiseContract = compile(ClientApi, {
  groupNames,
  omitEndpoints: promiseOmitEndpoints,
  namespace: clientNamespace,
  aliases: deprecatedClientPaths,
})
const effectContract = compile(ClientApi, {
  groupNames,
  omitEndpoints: effectOmitEndpoints,
  namespace: clientNamespace,
  aliases: deprecatedClientPaths,
})
const effectTypeReferences = [
  ...namespaceTypes("Agent", "@xiaochuan/schema/agent", Agent),
  ...namespaceTypes("Artifact", "@xiaochuan/schema/artifact", Artifact),
  ...namespaceTypes("Automation", "@xiaochuan/schema/automation", Automation),
  ...namespaceTypes("Command", "@xiaochuan/schema/command", Command),
  ...namespaceTypes("Config", "@xiaochuan/schema/config", Config),
  ...namespaceTypes("Credential", "@xiaochuan/schema/credential", Credential),
  ...namespaceTypes("Event", "@xiaochuan/schema/event", Event),
  ...namespaceTypes("EventLog", "@xiaochuan/schema/event-log", EventLog),
  ...namespaceTypes("FileDiff", "@xiaochuan/schema/file-diff", FileDiff),
  ...namespaceTypes("FileSystem", "@xiaochuan/schema/filesystem", FileSystem),
  ...namespaceTypes("Form", "@xiaochuan/schema/form", Form),
  ...namespaceTypes("Generate", "@xiaochuan/schema/generate", Generate),
  ...namespaceTypes("Instruction", "@xiaochuan/schema/instruction", Instruction),
  ...namespaceTypes("InstructionEntry", "@xiaochuan/schema/instruction-entry", InstructionEntry),
  ...namespaceTypes("Integration", "@xiaochuan/schema/integration", Integration),
  ...namespaceTypes("Job", "@xiaochuan/schema/job", Job),
  typeReference("Location.PublicRef", "@xiaochuan/schema/location", Location.PublicRef),
  typeReference("Location.PublicInfo", "@xiaochuan/schema/location", Location.PublicInfo),
  ...namespaceTypes("Mcp", "@xiaochuan/schema/mcp", Mcp),
  ...namespaceTypes("Model", "@xiaochuan/schema/model", Model),
  ...namespaceTypes("Money", "@xiaochuan/schema/money", Money),
  ...namespaceTypes("Permission", "@xiaochuan/schema/permission", Permission),
  ...namespaceTypes("PermissionSaved", "@xiaochuan/schema/permission-saved", PermissionSaved),
  ...namespaceTypes("Plugin", "@xiaochuan/schema/plugin", Plugin),
  ...namespaceTypes("Project", "@xiaochuan/schema/project", Project),
  ...namespaceTypes("Worktree", "@xiaochuan/schema/worktree", Worktree),
  ...namespaceTypes("PromptInput", "@xiaochuan/schema/prompt-input", PromptInput),
  ...namespaceTypes("Provider", "@xiaochuan/schema/provider", Provider),
  ...namespaceTypes("Pty", "@xiaochuan/schema/pty", Pty),
  ...namespaceTypes("PtyTicket", "@xiaochuan/schema/pty-ticket", PtyTicket),
  ...namespaceTypes("Question", "@xiaochuan/schema/question", Question),
  ...namespaceTypes("Reference", "@xiaochuan/schema/reference", Reference),
  ...namespaceTypes("Session", "@xiaochuan/schema/session", Session),
  ...namespaceTypes("SessionMessage", "@xiaochuan/schema/session-message", SessionMessage),
  ...namespaceTypes("SessionInbox", "@xiaochuan/schema/session-inbox", SessionInbox),
  ...namespaceTypes("Shell", "@xiaochuan/schema/shell", Shell),
  ...namespaceTypes("Skill", "@xiaochuan/schema/skill", Skill),
  ...namespaceTypes("Snapshot", "@xiaochuan/schema/snapshot", Snapshot),
  ...namespaceTypes("UsageLimits", "@xiaochuan/schema/usage-limits", UsageLimits),
  ...namespaceTypes("Vcs", "@xiaochuan/schema/vcs", Vcs),
  ...namespaceTypes("WebSearch", "@xiaochuan/schema/websearch", WebSearch),
  ...namespaceTypes("Workspace", "@xiaochuan/schema/workspace", Workspace),
  typeReference("Prompt", "@xiaochuan/schema/prompt", Prompt),
  typeReference("PromptMention", "@xiaochuan/schema/prompt", PromptMention),
  typeReference("FileAttachment", "@xiaochuan/schema/prompt", FileAttachment),
  typeReference("AgentAttachment", "@xiaochuan/schema/prompt", AgentAttachment),
  typeReference("AbsolutePath", "@xiaochuan/schema/schema", AbsolutePath),
  typeReference("RelativePath", "@xiaochuan/schema/schema", RelativePath),
]

await Effect.runPromise(
  Effect.all(
    [
      write(
        emitPromise(promiseContract, {
          mutableOutputs: true,
        }),
        fileURLToPath(new URL("../src/promise/generated", import.meta.url)),
      ),
      write(
        emitEffectImported(effectContract, {
          module: "../../contract",
          api: "ClientApi",
          shapeModule: "../api/api.js",
        }),
        fileURLToPath(new URL("../src/effect/generated", import.meta.url)),
      ),
      write(
        emitEffectShape(effectContract, {
          typeReferences: effectTypeReferences,
          outputTypes: {
            "event.subscribe": {
              name: "XiaochuanEvent",
              import: 'import type { XiaochuanEvent } from "@xiaochuan/protocol/groups/event"',
            },
          },
        }),
        fileURLToPath(new URL("../src/effect/api", import.meta.url)),
      ),
    ],
    { concurrency: 3, discard: true },
  ).pipe(Effect.provide(NodeFileSystem.layer)),
)

function namespaceTypes(namespace: string, module: string, values: object) {
  return Object.entries(values).flatMap(([name, schema]) =>
    Schema.isSchema(schema) ? [typeReference(`${namespace}.${name}`, module, schema)] : [],
  )
}

function typeReference(name: string, module: string, schema: Schema.Top) {
  return {
    schema,
    name,
    import: `import type { ${name.split(".")[0]} } from ${JSON.stringify(module)}`,
  }
}
