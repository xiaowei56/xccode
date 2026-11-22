import type { CommandApi } from "@xccode/client/promise/api"
import type { PromptInput } from "@xccode/schema/prompt-input"
import type { Session } from "@xccode/schema/session"
import type { SessionInbox } from "@xccode/schema/session-inbox"
import type { Transform } from "./registration.js"

export interface CommandInvocation {
  readonly sessionID: Session.ID
  readonly prompt: PromptInput.Prompt
  readonly delivery: SessionInbox.Delivery
}

export interface CommandDefinition {
  readonly name: string
  readonly description?: string
  readonly execute: (input: CommandInvocation) => Promise<void>
}

export interface CommandEditor {
  add(definition: CommandDefinition): void
}

export interface CommandDomain extends Pick<CommandApi, "list"> {
  readonly transform: Transform<CommandEditor>
  readonly reload: () => Promise<void>
}
