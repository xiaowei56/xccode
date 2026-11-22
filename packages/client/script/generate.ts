import { NodeFileSystem } from "@effect/platform-node"
import { compile, emitEffectImported, emitEffectShape, emitPromise, write } from "@xccode/httpapi-codegen"
import {
  ClientApi,
  clientNamespace,
  deprecatedClientPaths,
  effectOmitEndpoints,
  groupNames,
  promiseOmitEndpoints,
} from "@xccode/protocol/client"
import { Agent } from "@xccode/schema/agent"
import { Artifact } from "@xccode/schema/artifact"
import { Automation } from "@xccode/schema/automation"
import { Command } from "@xccode/schema/command"
import { Config } from "@xccode/schema/config"
import { Credential } from "@xccode/schema/credential"
import { Event } from "@xccode/schema/event"
import { EventLog } from "@xccode/schema/event-log"
import { FileDiff } from "@xccode/schema/file-diff"
import { FileSystem } from "@xccode/schema/filesystem"
import { Form } from "@xccode/schema/form"
import { Generate } from "@xccode/schema/generate"
import { Instruction } from "@xccode/schema/instruction"
import { InstructionEntry } from "@xccode/schema/instruction-entry"
import { Integration } from "@xccode/schema/integration"
import { Job } from "@xccode/schema/job"
import { Location } from "@xccode/schema/location"
import { Mcp } from "@xccode/schema/mcp"
import { Model } from "@xccode/schema/model"
import { Money } from "@xccode/schema/money"
import { Permission } from "@xccode/schema/permission"
import { PermissionSaved } from "@xccode/schema/permission-saved"
import { Plugin } from "@xccode/schema/plugin"
import { Project } from "@xccode/schema/project"
import { Worktree } from "@xccode/schema/worktree"
import { AgentAttachment, FileAttachment, Prompt, PromptMention } from "@xccode/schema/prompt"
import { PromptInput } from "@xccode/schema/prompt-input"
import { Provider } from "@xccode/schema/provider"
import { Pty } from "@xccode/schema/pty"
import { PtyTicket } from "@xccode/schema/pty-ticket"
import { Question } from "@xccode/schema/question"
import { Reference } from "@xccode/schema/reference"
import { AbsolutePath, RelativePath } from "@xccode/schema/schema"
import { Session } from "@xccode/schema/session"
import { SessionMessage } from "@xccode/schema/session-message"
import { SessionInbox } from "@xccode/schema/session-inbox"
import { Shell } from "@xccode/schema/shell"
import { Skill } from "@xccode/schema/skill"
import { Snapshot } from "@xccode/schema/snapshot"
import { UsageLimits } from "@xccode/schema/usage-limits"
import { Vcs } from "@xccode/schema/vcs"
import { WebSearch } from "@xccode/schema/websearch"
import { Workspace } from "@xccode/schema/workspace"
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
  ...namespaceTypes("Agent", "@xccode/schema/agent", Agent),
  ...namespaceTypes("Artifact", "@xccode/schema/artifact", Artifact),
  ...namespaceTypes("Automation", "@xccode/schema/automation", Automation),
  ...namespaceTypes("Command", "@xccode/schema/command", Command),
  ...namespaceTypes("Config", "@xccode/schema/config", Config),
  ...namespaceTypes("Credential", "@xccode/schema/credential", Credential),
  ...namespaceTypes("Event", "@xccode/schema/event", Event),
  ...namespaceTypes("EventLog", "@xccode/schema/event-log", EventLog),
  ...namespaceTypes("FileDiff", "@xccode/schema/file-diff", FileDiff),
  ...namespaceTypes("FileSystem", "@xccode/schema/filesystem", FileSystem),
  ...namespaceTypes("Form", "@xccode/schema/form", Form),
  ...namespaceTypes("Generate", "@xccode/schema/generate", Generate),
  ...namespaceTypes("Instruction", "@xccode/schema/instruction", Instruction),
  ...namespaceTypes("InstructionEntry", "@xccode/schema/instruction-entry", InstructionEntry),
  ...namespaceTypes("Integration", "@xccode/schema/integration", Integration),
  ...namespaceTypes("Job", "@xccode/schema/job", Job),
  typeReference("Location.PublicRef", "@xccode/schema/location", Location.PublicRef),
  typeReference("Location.PublicInfo", "@xccode/schema/location", Location.PublicInfo),
  ...namespaceTypes("Mcp", "@xccode/schema/mcp", Mcp),
  ...namespaceTypes("Model", "@xccode/schema/model", Model),
  ...namespaceTypes("Money", "@xccode/schema/money", Money),
  ...namespaceTypes("Permission", "@xccode/schema/permission", Permission),
  ...namespaceTypes("PermissionSaved", "@xccode/schema/permission-saved", PermissionSaved),
  ...namespaceTypes("Plugin", "@xccode/schema/plugin", Plugin),
  ...namespaceTypes("Project", "@xccode/schema/project", Project),
  ...namespaceTypes("Worktree", "@xccode/schema/worktree", Worktree),
  ...namespaceTypes("PromptInput", "@xccode/schema/prompt-input", PromptInput),
  ...namespaceTypes("Provider", "@xccode/schema/provider", Provider),
  ...namespaceTypes("Pty", "@xccode/schema/pty", Pty),
  ...namespaceTypes("PtyTicket", "@xccode/schema/pty-ticket", PtyTicket),
  ...namespaceTypes("Question", "@xccode/schema/question", Question),
  ...namespaceTypes("Reference", "@xccode/schema/reference", Reference),
  ...namespaceTypes("Session", "@xccode/schema/session", Session),
  ...namespaceTypes("SessionMessage", "@xccode/schema/session-message", SessionMessage),
  ...namespaceTypes("SessionInbox", "@xccode/schema/session-inbox", SessionInbox),
  ...namespaceTypes("Shell", "@xccode/schema/shell", Shell),
  ...namespaceTypes("Skill", "@xccode/schema/skill", Skill),
  ...namespaceTypes("Snapshot", "@xccode/schema/snapshot", Snapshot),
  ...namespaceTypes("UsageLimits", "@xccode/schema/usage-limits", UsageLimits),
  ...namespaceTypes("Vcs", "@xccode/schema/vcs", Vcs),
  ...namespaceTypes("WebSearch", "@xccode/schema/websearch", WebSearch),
  ...namespaceTypes("Workspace", "@xccode/schema/workspace", Workspace),
  typeReference("Prompt", "@xccode/schema/prompt", Prompt),
  typeReference("PromptMention", "@xccode/schema/prompt", PromptMention),
  typeReference("FileAttachment", "@xccode/schema/prompt", FileAttachment),
  typeReference("AgentAttachment", "@xccode/schema/prompt", AgentAttachment),
  typeReference("AbsolutePath", "@xccode/schema/schema", AbsolutePath),
  typeReference("RelativePath", "@xccode/schema/schema", RelativePath),
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
              name: "XccodeEvent",
              import: 'import type { XccodeEvent } from "@xccode/protocol/groups/event"',
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
