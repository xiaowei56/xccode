import { expect, test } from "bun:test"
import type { IntegrationInfo } from "@xccode/client"
import { loginChoices } from "../src/commands/handlers/auth/login"

const integration = (value: Partial<IntegrationInfo> & Pick<IntegrationInfo, "id" | "name">): IntegrationInfo => ({
  methods: [{ type: "key" }],
  connections: [],
  ...value,
})

test("groups the CLI choices like /connect while keeping stable login IDs", () => {
  expect(
    loginChoices([
      integration({ id: "mistral", name: "Mistral" }),
      integration({ id: "openai", name: "OpenAI" }),
      integration({ id: "linear", name: "Linear", metadata: { source: "mcp" } }),
      integration({ id: "github", name: "GitHub", metadata: { source: "mcp" } }),
      integration({ id: "xccode", name: "Xccode Console" }),
      integration({
        id: "xccode-go",
        name: "Xccode Go",
        connections: [{ type: "credential", id: "go", label: "Go", method: "key" }],
      }),
      integration({ id: "unused", name: "Unused", methods: [{ type: "env", names: ["UNUSED_KEY"] }] }),
    ]),
  ).toEqual([
    { value: "github", label: "GitHub", category: "MCP", connected: false },
    { value: "linear", label: "Linear", category: "MCP", connected: false },
    { value: "xccode-go", label: "Xccode Go", category: "Popular", connected: true },
    { value: "xccode", label: "Xccode Console", category: "Popular", connected: false },
    { value: "openai", label: "OpenAI", category: "Popular", connected: false },
    { value: "mistral", label: "Mistral", category: "Services", connected: false },
  ])
})

test("hides Xccode Go until a Go key is saved", () => {
  expect(
    loginChoices([
      integration({ id: "xccode", name: "Xccode Console" }),
      integration({ id: "xccode-go", name: "Xccode Go", connections: [{ type: "env", name: "XCCODE_API_KEY" }] }),
    ]).map((choice) => choice.value),
  ).toEqual(["xccode"])
})
