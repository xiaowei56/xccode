import { describe, expect } from "bun:test"
import fs from "fs/promises"
import path from "path"
import { Duration, Effect, Layer, LayerMap, Stream } from "effect"
import { App } from "@xccode/core/app"
import { ConfigPluginSource } from "@xccode/core/config/plugin/source"
import { AppNodeBuilder } from "@xccode/core/effect/app-node-builder"
import { Flag } from "@xccode/core/flag"
import { Instance } from "@xccode/core/instance"
import { Location } from "@xccode/core/location"
import { LocationServiceMap } from "@xccode/core/location-services"
import { Plugin } from "@xccode/core/plugin"
import { SdkPlugins } from "@xccode/core/plugin/sdk"
import { Reference } from "@xccode/core/reference"
import { AbsolutePath } from "@xccode/core/schema"
import { LayerNode } from "@xccode/util/effect/layer-node"
import { Global } from "@xccode/util/global"
import { Npm } from "@xccode/util/npm"
import { Bus } from "../../src/bus"
import { Database } from "../../src/database/database"
import { tempGlobalLayer } from "../fixture/global"
import { offlineModels } from "../fixture/models"
import { tmpdirScoped } from "../fixture/tmpdir"
import { testEffect } from "../lib/effect"

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

const references = (directory: string) =>
  Effect.gen(function* () {
    const locations = yield* LocationServiceMap.Service
    return yield* Effect.gen(function* () {
      const plugins = yield* Plugin.Service
      yield* plugins.awaitActivation
      const service = yield* Reference.Service
      const location = yield* Location.Service
      return { list: yield* service.list(), project: location.project.id }
    }).pipe(
      Effect.scoped,
      Effect.provide(locations.get(Location.Ref.make({ directory: AbsolutePath.make(directory) }))),
    )
  })

describe("HomeMemoryPlugin", () => {
  it.live("gives sessions in the home folder a memory workspace stored by project", () =>
    Effect.gen(function* () {
      const result = yield* references(Global.Path.home)
      const memory = result.list.find((reference) => reference.name === "memory")
      const directory = memory?.path ?? ""
      expect(directory.endsWith(path.join("data", "memory", result.project))).toBe(true)
      expect(memory?.description).toContain(path.join(directory, "scripts"))
      expect(memory?.description).toContain(
        path.join("config", "project", result.project, "skills", "<name>", "SKILL.md"),
      )
      const folders = yield* Effect.promise(() => fs.readdir(directory))
      expect(folders.toSorted()).toEqual(["docs", "memory", "scripts"])
    }).pipe(Effect.provideService(Flag.Overrides, undefined)),
  )

  it.live("leaves skills out of the description without project_overlay", () =>
    Effect.gen(function* () {
      const result = yield* references(Global.Path.home)
      const memory = result.list.find((reference) => reference.name === "memory")
      expect(memory?.description).toContain(path.join(memory?.path ?? "", "scripts"))
      expect(memory?.description).not.toContain("SKILL.md")
    }).pipe(Effect.provideService(Flag.Overrides, "-project_overlay")),
  )

  it.live("leaves other folders alone", () =>
    Effect.gen(function* () {
      const directory = yield* tmpdirScoped()
      const result = yield* references(directory.path)
      expect(result.list.map((reference) => reference.name)).not.toContain("memory")
    }).pipe(Effect.provideService(Flag.Overrides, undefined)),
  )

  it.live("stays off when the flag is off", () =>
    Effect.gen(function* () {
      const result = yield* references(Global.Path.home)
      expect(result.list.map((reference) => reference.name)).not.toContain("memory")
    }).pipe(Effect.provideService(Flag.Overrides, "-home_memory")),
  )
})
