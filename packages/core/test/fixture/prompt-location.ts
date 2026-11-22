import type { FileSystem } from "@xccode/core/filesystem"
import { Bus } from "@xccode/core/bus"
import { Image } from "@xccode/core/image"
import { LocationServiceMap } from "@xccode/core/location-service-map"
import type { LocationServices } from "@xccode/core/location-services"
import { Plugin } from "@xccode/core/plugin"
import { PluginHooks } from "@xccode/core/plugin/hooks"
import { Skill } from "@xccode/core/skill"
import type { Location } from "@xccode/schema/location"
import { makeGlobalNode } from "@xccode/util/effect/app-node"
import { LayerNode } from "@xccode/util/effect/layer-node"
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
