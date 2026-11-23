import { describe, expect } from "bun:test"
import { Duration, Effect, Layer, LayerMap, Stream } from "effect"
import { App } from "@xiaochuan/core/app"
import { ConfigPluginSource } from "@xiaochuan/core/config/plugin/source"
import { AppNodeBuilder } from "@xiaochuan/core/effect/app-node-builder"
import { Flag } from "@xiaochuan/core/flag"
import { Instance } from "@xiaochuan/core/instance"
import { Location } from "@xiaochuan/core/location"
import { LocationServiceMap } from "@xiaochuan/core/location-services"
import { Plugin } from "@xiaochuan/core/plugin"
import { SdkPlugins } from "@xiaochuan/core/plugin/sdk"
import { AbsolutePath } from "@xiaochuan/core/schema"
import { Tool } from "@xiaochuan/core/tool"
import { TodoTool } from "@xiaochuan/core/tool/plugin/todo"
import { LayerNode } from "@xiaochuan/util/effect/layer-node"
import { Global } from "@xiaochuan/util/global"
import { Npm } from "@xiaochuan/util/npm"
import { Bus } from "../../src/bus"
import { Database } from "../../src/database/database"
import { tempGlobalLayer } from "../fixture/global"
import { offlineModels } from "../fixture/models"
import { tmpdirScoped } from "../fixture/tmpdir"
import { testEffect } from "../lib/effect"
import { toolDefinitions } from "../lib/tool"

const unexpected = (pkg: string) =>
  Effect.fail(new Npm.InstallFailedError({ add: [pkg], dir: "", cause: new Error(`Unexpected Npm call: ${pkg}`) }))

const instances = Layer.effect(
  LocationServiceMap.Service,
  Effect.gen(function* () {
    const map = yield* LayerMap.make(
      (ref: Location.Ref) => Instance.layer(ref, { discovery: false, replacements: bindings }),
      { idleTimeToLive: Duration.infinity },
    )
    const bindings: LayerNode.Replacements = [
      App.node.replace(App.configured({ channel: "dev" })),
      Global.node.replace(tempGlobalLayer),
      offlineModels,
      ConfigPluginSource.node.replace(
        Layer.succeed(
          ConfigPluginSource.Service,
          ConfigPluginSource.Service.of({ operations: () => Effect.succeed([]), changes: () => Stream.never }),
        ),
      ),
      Npm.node.replace(
        Layer.succeed(
          Npm.Service,
          Npm.Service.of({
            add: unexpected,
            resolve: (name) => Effect.succeed({ directory: "", name }),
            check: () => Effect.succeed(false),
            update: unexpected,
            follows: () => Effect.succeed(false),
            reject: () => Effect.succeed(false),
            which: () => Effect.undefined,
          }),
        ),
      ),
      LocationServiceMap.node.replace(Layer.succeed(LocationServiceMap.Service, map)),
      Instance.node.replace(
        Layer.succeed(Instance.Service, { provide: (session) => Effect.provide(map.get(session.location)) }),
      ),
    ]
    return map
  }),
)

const it = testEffect(
  AppNodeBuilder.build(LayerNode.group([Database.node, Bus.node, SdkPlugins.node, LocationServiceMap.node]), [
    Global.node.replace(tempGlobalLayer),
    offlineModels,
    LocationServiceMap.node.replace(instances),
  ]),
)

describe("PluginInternal flags", () => {
  it.live("turns flagged built-in tools on for a dev-channel server with no config while keeping todo off", () =>
    Effect.gen(function* () {
      const directory = yield* tmpdirScoped()
      const locations = yield* LocationServiceMap.Service
      const { registered, direct } = yield* Effect.gen(function* () {
        const plugins = yield* Plugin.Service
        yield* plugins.awaitActivation
        const tools = yield* Tool.Service
        return {
          registered: (yield* tools.list()).map((tool) => tool.id),
          direct: (yield* toolDefinitions(tools)).map((definition) => definition.name),
        }
      }).pipe(
        Effect.scoped,
        Effect.provide(locations.get(Location.Ref.make({ directory: AbsolutePath.make(directory.path) }))),
      )

      expect(registered).toContain("xiaochuan_artifact_create")
      expect(registered).toContain("shell")
      expect(registered).not.toContain(TodoTool.name)
      expect(direct).not.toContain("shell")
    }).pipe(Effect.provideService(Flag.Overrides, undefined)),
  )
})
