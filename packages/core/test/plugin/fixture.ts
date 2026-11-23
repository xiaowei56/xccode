import { Agent } from "@xiaochuan/core/agent"
import { App } from "@xiaochuan/core/app"
import { Artifact } from "@xiaochuan/core/artifact"
import { BlobStore } from "@xiaochuan/core/blob-store"
import { AISDK } from "@xiaochuan/core/aisdk"
import { Command } from "@xiaochuan/core/command"
import { Config } from "@xiaochuan/core/config"
import { Credential } from "@xiaochuan/core/credential"
import { Database } from "@xiaochuan/core/database/database"
import { Environment } from "@xiaochuan/core/environment/index"
import { FileAccess } from "@xiaochuan/core/file-access"
import { Flag } from "@xiaochuan/core/flag"
import { LayerNodePlatform } from "@xiaochuan/util/effect/app-node-platform"
import { AppProcess } from "@xiaochuan/util/process"
import { LayerNode } from "@xiaochuan/util/effect/layer-node"
import { Bus } from "@xiaochuan/core/bus"
import { FileSystem } from "@xiaochuan/core/filesystem"
import { FSUtil } from "@xiaochuan/util/fs-util"
import { Global } from "@xiaochuan/util/global"
import { Form } from "@xiaochuan/core/form"
import { Generate } from "@xiaochuan/core/generate"
import { InstructionDiscovery } from "@xiaochuan/core/instruction-discovery"
import { Integration } from "@xiaochuan/core/integration"
import { Job } from "@xiaochuan/core/job"
import { KV } from "@xiaochuan/core/kv"
import { Location } from "@xiaochuan/core/location"
import { Mcp } from "@xiaochuan/core/mcp/index"
import { Model } from "@xiaochuan/core/model"
import { Npm } from "@xiaochuan/util/npm"
import { Plugin } from "@xiaochuan/core/plugin"
import { PluginHooks } from "@xiaochuan/core/plugin/hooks"
import { Provider } from "@xiaochuan/core/provider"
import { Session } from "@xiaochuan/core/session"
import { SharedCache } from "@xiaochuan/core/shared-cache"
import { InstructionEntry } from "@xiaochuan/core/session/instruction-entry"
import { PersistentPty } from "@xiaochuan/core/persistent-pty"
import { LocationServiceMap } from "@xiaochuan/core/location-service-map"
import { AppNodeBuilder } from "@xiaochuan/core/effect/app-node-builder"
import { Permission } from "@xiaochuan/core/permission"
import { Reference } from "@xiaochuan/core/reference"
import { Rpc } from "@xiaochuan/core/rpc"
import { Skill } from "@xiaochuan/core/skill"
import { SkillDiscovery } from "@xiaochuan/core/skill/discovery"
import { Watcher } from "@xiaochuan/core/filesystem/watcher"
import { Tool } from "@xiaochuan/core/tool"
import { Vcs } from "@xiaochuan/core/vcs"
import { VideoGeneration } from "@xiaochuan/core/video-generation"
import { WebSearch } from "@xiaochuan/core/websearch"
import { Worktree } from "@xiaochuan/core/worktree"
import { WorktreeStrategies } from "@xiaochuan/core/worktree/strategies"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"
import { emptyMcpLayer } from "../fixture/mcp"
import { offlineModels } from "../fixture/models"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: (name) => Effect.succeed({ directory: "", name }),
    resolve: (name) => Effect.succeed({ directory: "", name }),
    check: () => Effect.succeed(false),
    update: (name) => Effect.succeed({ directory: "", name }),
    follows: () => Effect.succeed(false),
    reject: () => Effect.succeed(false),
    which: () => Effect.undefined,
  }),
)

const generateLayer = Layer.succeed(
  Generate.Service,
  Generate.Service.of({
    text: () => Effect.succeed(""),
    image: () => Effect.die("unused"),
    decisions: () => Effect.die("unused"),
    video: {
      start: () => Effect.die("unused"),
      status: () => Effect.die("unused"),
      result: () => Effect.die("unused"),
      cancel: () => Effect.die("unused"),
    },
  }),
)

const configLayer = Config.testLayer()

const permissionLayer = Layer.succeed(
  Permission.Service,
  Permission.Service.of({
    close: Effect.void,
    ask: (input) => Effect.succeed({ id: input.id ?? Permission.ID.create(), effect: "ask" }),
    assert: () => Effect.void,
    assertNotDenied: () => Effect.void,
    allows: () => Effect.succeed(false),
    reply: () => Effect.void,
    get: () => Effect.succeed(undefined),
    forSession: () => Effect.succeed([]),
    list: () => Effect.succeed([]),
    nested: () => Effect.void,
  }),
)

export const makePluginTestLayer = (
  permission = permissionLayer,
  generate = generateLayer,
  replacements: LayerNode.Replacements = [],
) =>
  AppNodeBuilder.build(
    LayerNode.group([
      App.node,
      AppProcess.node,
      FileSystem.node,
      FSUtil.node,
      Location.node,
      Npm.node,
      Credential.node,
      Config.node,
      Flag.node,
      Database.node,
      Environment.node,
      FileAccess.node,
      Global.node,
      Bus.node,
      Form.node,
      Generate.node,
      LayerNodePlatform.httpClient,
      Plugin.node,
      Agent.node,
      Artifact.node,
      AISDK.node,
      BlobStore.node,
      Provider.node,
      Model.node,
      Command.node,
      InstructionDiscovery.node,
      Integration.node,
      Job.node,
      KV.node,
      Mcp.node,
      Session.node,
      SharedCache.node,
      InstructionEntry.node,
      PersistentPty.node,
      LocationServiceMap.node,
      Permission.node,
      PluginHooks.node,
      Reference.node,
      Rpc.node,
      Skill.node,
      SkillDiscovery.node,
      Tool.node,
      Vcs.node,
      VideoGeneration.node,
      Watcher.node,
      WebSearch.node,
      Worktree.node,
      WorktreeStrategies.node,
    ]),
    [
      Location.node.replace(tempLocationLayer),
      Npm.node.replace(npmLayer),
      Config.node.replace(configLayer),
      Mcp.node.replace(emptyMcpLayer),
      Generate.node.replace(generate),
      Permission.node.replace(permission),
      offlineModels,
      ...replacements,
    ],
  ).pipe(Layer.provideMerge(configLayer))

export const PluginTestLayer = makePluginTestLayer()
