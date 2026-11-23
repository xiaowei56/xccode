import type { FileSystem } from "@xiaochuan/core/filesystem"
import { Bus } from "@xiaochuan/core/bus"
import { Image } from "@xiaochuan/core/image"
import { LocationServiceMap } from "@xiaochuan/core/location-service-map"
import type { LocationServices } from "@xiaochuan/core/location-services"
import { Plugin } from "@xiaochuan/core/plugin"
import { PluginHooks } from "@xiaochuan/core/plugin/hooks"
import { Skill } from "@xiaochuan/core/skill"
import type { Location } from "@xiaochuan/schema/location"
import { makeGlobalNode } from "@xiaochuan/util/effect/app-node"
import { LayerNode } from "@xiaochuan/util/effect/layer-node"
import { Effect, Layer, LayerMap } from "effect"

// Plain-prompt unit fixtures use virtual directories.
export const promptLocationNode = makeGlobalNode({
  service: LocationServiceMap.Service,
  layer: Layer.effect(
    LocationServiceMap.Service,
    Effect.gen(function* () {
      const bus = yield* Bus.Service
      return yield* LayerMap.make(
        (_ref: Location.Ref) =>
          LayerNode.compile(LayerNode.group([PluginHooks.node, Image.node, Skill.node, Plugin.node]), {
            replacements: [
              Bus.node.replace(Layer.succeed(Bus.Service, bus)),
              Plugin.node.replace(Layer.mock(Plugin.Service, { awaitActivation: Effect.void })),
            ],
          }) as unknown as Layer.Layer<LocationServices, FileSystem.DirectoryNotFoundError>,
      )
    }),
  ),
  deps: [Bus.node],
})
