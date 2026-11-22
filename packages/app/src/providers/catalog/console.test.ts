import { expect, test } from "bun:test"
import { consoleProviderGroup, consoleProviderName } from "./console"

test("groups only providers managed by the active Console workspace", () => {
  const direct = { id: "openai", integrationID: "openai", name: "Anomaly / OpenAI" }

  const group = consoleProviderGroup([
    { id: "xccode", integrationID: "xccode", name: "Anomaly / Xccode" },
    { id: "console-openai", integrationID: "xccode", name: "Anomaly / OpenAI" },
    { id: "console-google", integrationID: "xccode", name: "Anomaly / Google" },
    direct,
  ])

  expect(group).toBeDefined()

  if (!group) throw new Error("Expected Console provider group")
  expect(group.workspace).toBe("Anomaly")
  expect(group.providers.map((provider) => provider.id)).toEqual(["xccode", "console-openai", "console-google"])
  expect(consoleProviderName(group, group.providers[1].name)).toBe("OpenAI")
  expect(group.providers).not.toContain(direct)
})
