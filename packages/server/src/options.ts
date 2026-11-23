import { Database } from "@xiaochuan/core/database/database"
import { ModelsDev } from "@xiaochuan/core/models-dev"
import { PersistentPty } from "@xiaochuan/core/persistent-pty"
import { Schema } from "effect"
import type { LayerNodePlatform } from "@xiaochuan/util/effect/app-node-platform"

export const ServerOptions = Schema.Struct({
  app: Schema.optional(
    Schema.Struct({
      name: Schema.optional(Schema.String),
      version: Schema.optional(Schema.String),
      channel: Schema.optional(Schema.String),
    }),
  ),
  hostname: Schema.optional(Schema.String),
  port: Schema.optional(Schema.Int.check(Schema.isGreaterThanOrEqualTo(0), Schema.isLessThanOrEqualTo(65_535))),
  password: Schema.optional(Schema.String),
  cors: Schema.optional(Schema.Array(Schema.String)),
  simulation: Schema.optional(Schema.Boolean),
  database: Schema.optional(Database.Options),
  pty: Schema.optional(PersistentPty.Options),
  events: Schema.optional(
    Schema.Struct({
      persist: Schema.optional(Schema.Boolean),
    }),
  ),
  models: Schema.optional(ModelsDev.Options),
  /**
   * Replaces `globalThis.fetch` for Xiaochuan's own HTTP requests: Xiaochuan Console config, model requests, web fetch
   * and search, well-known config, and remote MCP servers. Agent code in Code Mode keeps `globalThis.fetch`. For
   * example, a Cloudflare Worker can route requests through a Service Binding.
   */
  fetch: Schema.optional(Schema.declare((input): input is LayerNodePlatform.Fetch => typeof input === "function")),
  config: Schema.optional(
    Schema.Struct({
      directory: Schema.optional(Schema.String),
      project: Schema.optional(Schema.Boolean),
      claude: Schema.optional(Schema.Boolean),
      file: Schema.optional(Schema.String),
      content: Schema.optional(Schema.String),
    }),
  ),
  instructions: Schema.optional(
    Schema.Struct({
      // false skips the per-directory and ~/.claude/CLAUDE.md fallbacks.
      claude: Schema.optional(Schema.Boolean),
    }),
  ),
  windows: Schema.optional(
    Schema.Struct({
      gitbash: Schema.optional(Schema.String),
    }),
  ),
  fs: Schema.optional(
    Schema.Struct({
      filewatcher: Schema.optional(Schema.Boolean),
      fff: Schema.optional(Schema.Boolean),
    }),
  ),
})
export type ServerOptions = typeof ServerOptions.Type
