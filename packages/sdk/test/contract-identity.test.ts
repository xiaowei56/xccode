import { expect, test } from "bun:test"
import { EnvironmentDriver } from "@xiaochuan/core/environment/driver"
import { EnvironmentFiles } from "@xiaochuan/core/environment/files"
import { Location as CoreLocation } from "@xiaochuan/core/location"
import { WorkspaceDriver } from "@xiaochuan/core/workspace/driver"
import { SessionInbox as CoreSessionInbox } from "@xiaochuan/core/session/inbox"
import { SessionMessage as CoreSessionMessage } from "@xiaochuan/core/session/message"
import { Agent } from "@xiaochuan/schema/agent"
import { Config } from "@xiaochuan/schema/config"
import { Event } from "@xiaochuan/schema/event"
import { Location } from "@xiaochuan/schema/location"
import { Model } from "@xiaochuan/schema/model"
import { Project } from "@xiaochuan/schema/project"
import { Provider } from "@xiaochuan/schema/provider"
import { WebSearch } from "@xiaochuan/schema/websearch"
import { Session } from "@xiaochuan/schema/session"
import { SessionInbox } from "@xiaochuan/schema/session-inbox"
import { SessionMessage } from "@xiaochuan/schema/session-message"
import { Workspace } from "@xiaochuan/schema/workspace"
import { Worktree } from "@xiaochuan/schema/worktree"
import { Api } from "@xiaochuan/server/api"
import { ClientApi, clientNamespace, groupNames, promiseOmitEndpoints } from "@xiaochuan/protocol/client"
import { compile, emitPromise } from "@xiaochuan/httpapi-codegen"

const SDK = await import("../src/index")
const SDKEffect = await import("../src/effect")
const CoreAgent = await import("@xiaochuan/core/agent")
const CoreModel = await import("@xiaochuan/core/model")
const CoreProject = await import("@xiaochuan/core/project")
const CoreSession = await import("@xiaochuan/core/session")
const CoreWorktree = await import("@xiaochuan/core/worktree")

test("re-exports canonical contracts directly from Schema", () => {
  expect(SDK.Agent).toBe(Agent)
  expect(SDK.Config).toBe(Config)
  expect(SDK.Event).toBe(Event)
  expect(SDK.Model).toBe(Model)
  expect(SDK.WebSearch).toBe(WebSearch)
  expect(SDK.Session).toBe(Session)
  expect(SDK.Worktree).toBe(Worktree)
  expect(SDK.Workspace).toBe(Workspace)
  expect(Object.keys(SDK).sort()).toEqual([
    "AbsolutePath",
    "Agent",
    "ClientError",
    "Command",
    "Config",
    "Credential",
    "Event",
    "FileSystem",
    "Integration",
    "Location",
    "Model",
    "Xiaochuan",
    "Permission",
    "PermissionSaved",
    "Project",
    "Prompt",
    "PromptInput",
    "Provider",
    "Pty",
    "Question",
    "Reference",
    "RelativePath",
    "Session",
    "SessionInbox",
    "SessionMessage",
    "Skill",
    "Tool",
    "WebSearch",
    "Workspace",
    "Worktree",
  ])
})

test("Core and Server reuse the authoritative Schema and Protocol values", () => {
  expect(CoreAgent.ID).toBe(Agent.ID)
  expect(CoreLocation.Ref).toBe(Location.Ref)
  expect(CoreModel.Ref).toBe(Model.Ref)
  expect(CoreSession.Info).toBe(Session.Info)
  expect(CoreProject.Current).toBe(Project.Current)
  expect(CoreWorktree.DirectoryUnavailableError).toBeDefined()
  expect(CoreWorktree.List).toBe(Worktree.List)
  expect(CoreWorktree.Info).toBe(Worktree.Info)
  expect(CoreSessionInbox.Item).toBe(SessionInbox.Item)
  expect(CoreSessionInbox.User).toBe(SessionInbox.User)
  expect(CoreSessionInbox.Synthetic).toBe(SessionInbox.Synthetic)
  expect(CoreSessionMessage.Info).toBe(SessionMessage.Info)
  expect(CoreSessionMessage.AssistantText).toBe(SessionMessage.AssistantText)
  expect(Api.groups["server.session"].identifier).toBe("server.session")
  expect(Api.groups["server.project"].identifier).toBe("server.project")
  expect(Object.keys(ClientApi.groups)).toEqual(Object.keys(Api.groups))
  expect(Session.ID.create()).toStartWith("ses_")
  expect(String(Project.ID.global)).toBe("global")
  expect(String(Provider.ID.anthropic)).toBe("anthropic")
  expect(Workspace.ID.create()).toStartWith("wrk_")
})

test("client and Server contracts generate identically", () => {
  const server = compile(Api, { groupNames, omitEndpoints: promiseOmitEndpoints, namespace: clientNamespace })
  const client = compile(ClientApi, { groupNames, omitEndpoints: promiseOmitEndpoints, namespace: clientNamespace })

  expect(emitPromise(client)).toEqual(emitPromise(server))
})

test("re-exports workspace and environment driver contracts from @xiaochuan/sdk/effect", () => {
  expect(SDKEffect.WorkspaceDriver).toBe(WorkspaceDriver)
  expect(SDKEffect.EnvironmentDriver).toBe(EnvironmentDriver)
  expect(SDKEffect.EnvironmentFiles).toBe(EnvironmentFiles)
})
