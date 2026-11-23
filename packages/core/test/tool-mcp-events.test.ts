import { describe, expect } from "bun:test"
import { AppNodeBuilder } from "@xiaochuan/core/effect/app-node-builder"
import { Mcp } from "@xiaochuan/core/mcp/index"
import { McpClient } from "@xiaochuan/core/mcp/client"
import type { Permission } from "@xiaochuan/core/permission"
import { Session } from "@xiaochuan/core/session"
import { Tool } from "@xiaochuan/core/tool"
import { McpEventTools } from "@xiaochuan/core/tool/plugin/mcp-events"
import { Effect, Layer } from "effect"
import { hostEnvironmentLayer } from "./fixture/environment"
import { eventProducer } from "./fixture/event-server"
import { testEffect } from "./lib/effect"
import { permissionLayer } from "./lib/permission"
import { registerToolPlugin, toolIdentity, toolNodeReplacements } from "./lib/tool"

const it = testEffect(AppNodeBuilder.build(Tool.node, toolNodeReplacements()))

const setup = Effect.fnUntraced(function* () {
  const producer = yield* eventProducer([
    {
      name: "job.finished",
      description: "A job ended",
      delivery: ["push"],
      inputSchema: {},
      payloadSchema: { type: "object" },
    },
    { name: "job.polled", delivery: ["poll"], inputSchema: {}, payloadSchema: {} },
  ])
  const connection = yield* McpClient.connect({
    server: "jobs",
    config: { type: "attached", transport: producer.client, protocol: "2026-07-28" },
    directory: import.meta.dir,
    events: true,
  }).pipe(Effect.provide(hostEnvironmentLayer))
  const asserts: Permission.AssertInput[] = []
  yield* registerToolPlugin(McpEventTools.Plugin, {}).pipe(
    Effect.provide(permissionLayer({ assert: (input) => Effect.sync(() => void asserts.push(input)) })),
    Effect.provide(
      Layer.mock(Mcp.Service, {
        events: (server) => Effect.succeed(server === "jobs" ? connection.events : undefined),
      }),
    ),
  )
  const registry = yield* Tool.Service
  const list = (input: Record<string, unknown>) =>
    registry.snapshot([{ action: "execute", resource: "*", effect: "deny" }]).pipe(
      Effect.flatMap((tools) =>
        tools.execute({
          sessionID: Session.ID.make("ses_mcp_events"),
          ...toolIdentity,
          call: { type: "tool-call", id: "call_list", name: "xiaochuan_list_mcp_events", input },
        }),
      ),
    )
  return {
    asserts,
    list: (input: Record<string, unknown>) => list(input).pipe(Effect.orDie),
    fail: (input: Record<string, unknown>) => list(input).pipe(Effect.flip),
    registry,
  }
})

const jobFinished = {
  server: "jobs",
  event: "job.finished",
  description: "A job ended",
  args: {},
  data: { type: "object" },
}

describe("list_mcp_events", () => {
  it.live("lists one server's push events after asking permission", () =>
    Effect.gen(function* () {
      const { list, asserts, registry } = yield* setup()
      expect((yield* registry.list()).map((tool) => tool.id)).not.toContain("xiaochuan_watch_mcp_event")
      expect((yield* list({ server: "jobs" })).output).toEqual({ events: [jobFinished] })
      expect(asserts).toMatchObject([{ action: "xiaochuan_list_mcp_events", resources: ["jobs"], save: ["jobs"] }])
    }),
  )

  it.live("fails for a server that sends no events", () =>
    Effect.gen(function* () {
      const { fail } = yield* setup()
      expect((yield* fail({ server: "offline" })).message).toBe(
        'MCP server "offline" is not connected or sends no events',
      )
    }),
  )
})
