import { Agent } from "@xccode/core/agent"
import { App } from "@xccode/core/app"
import { Artifact } from "@xccode/core/artifact"
import { BlobStore } from "@xccode/core/blob-store"
import { AISDK } from "@xccode/core/aisdk"
import { Command } from "@xccode/core/command"
import { Config } from "@xccode/core/config"
import { Credential } from "@xccode/core/credential"
import { Database } from "@xccode/core/database/database"
import { Environment } from "@xccode/core/environment/index"
import { FileAccess } from "@xccode/core/file-access"
import { Flag } from "@xccode/core/flag"
import { LayerNodePlatform } from "@xccode/util/effect/app-node-platform"
import { AppProcess } from "@xccode/util/process"
import { LayerNode } from "@xccode/util/effect/layer-node"
import { Bus } from "@xccode/core/bus"
import { FileSystem } from "@xccode/core/filesystem"
import { FSUtil } from "@xccode/util/fs-util"
import { Global } from "@xccode/util/global"
import { Form } from "@xccode/core/form"
import { Generate } from "@xccode/core/generate"
import { InstructionDiscovery } from "@xccode/core/instruction-discovery"
import { Integration } from "@xccode/core/integration"
import { Job } from "@xccode/core/job"
import { KV } from "@xccode/core/kv"
import { Location } from "@xccode/core/location"
import { Mcp } from "@xccode/core/mcp/index"
import { Model } from "@xccode/core/model"
import { Npm } from "@xccode/util/npm"
import { Plugin } from "@xccode/core/plugin"
import { PluginHooks } from "@xccode/core/plugin/hooks"
import { Provider } from "@xccode/core/provider"
import { Session } from "@xccode/core/session"
import { SharedCache } from "@xccode/core/shared-cache"
import { InstructionEntry } from "@xccode/core/session/instruction-entry"
import { PersistentPty } from "@xccode/core/persistent-pty"
import { LocationServiceMap } from "@xccode/core/location-service-map"
import { AppNodeBuilder } from "@xccode/core/effect/app-node-builder"
import { Permission } from "@xccode/core/permission"
import { Reference } from "@xccode/core/reference"
import { Rpc } from "@xccode/core/rpc"
import { Skill } from "@xccode/core/skill"
import { SkillDiscovery } from "@xccode/core/skill/discovery"
import { Watcher } from "@xccode/core/filesystem/watcher"
import { Tool } from "@xccode/core/tool"
import { Vcs } from "@xccode/core/vcs"
import { VideoGeneration } from "@xccode/core/video-generation"
import { WebSearch } from "@xccode/core/websearch"
import { Worktree } from "@xccode/core/worktree"
import { WorktreeStrategies } from "@xccode/core/worktree/strategies"
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
