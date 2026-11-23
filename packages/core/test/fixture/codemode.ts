import { CodeModeTool } from "@xiaochuan/core/codemode/tool"
import { AppNodeBuilder } from "@xiaochuan/core/effect/app-node-builder"
import { Environment } from "@xiaochuan/core/environment/index"
import { FileAccess } from "@xiaochuan/core/file-access"
import { FileMutation } from "@xiaochuan/core/file-mutation"
import { FileWrite } from "@xiaochuan/core/file-write"
import { Flag } from "@xiaochuan/core/flag"
import { Formatter } from "@xiaochuan/core/formatter"
import { Location } from "@xiaochuan/core/location"
import { Machines } from "@xiaochuan/core/machine/machines"
import { Permission } from "@xiaochuan/core/permission"
import { AbsolutePath } from "@xiaochuan/core/schema"
import { LayerNode } from "@xiaochuan/util/effect/layer-node"
import { Effect, Layer } from "effect"
import { permissionLayer } from "../lib/permission"
import { type EnvironmentFilesTransform, hostEnvironmentLayer, transformEnvironmentFiles } from "./environment"
import { location } from "./location"

/** What a session at `directory` gives Code Mode with `full_codemode`: its Location and file services on the host. */
export const codeModeServices = (
  directory: string,
  permission: Partial<Permission.Interface> = { assert: () => Effect.void },
  formatter: Formatter.Interface["file"] = () => Effect.succeed(false),
  files?: EnvironmentFilesTransform,
) =>
  Effect.runSync(
    CodeModeTool.services.pipe(
      Effect.provide(
        AppNodeBuilder.build(
          LayerNode.group([Environment.node, FileAccess.node, FileMutation.node, FileWrite.node, Location.node]),
          [
            Environment.node.replace(files ? transformEnvironmentFiles(files) : hostEnvironmentLayer),
            Location.node.replace(
              Layer.succeed(
                Location.Service,
                Location.Service.of(location({ directory: AbsolutePath.make(directory) })),
              ),
            ),
            Formatter.node.replace(Layer.mock(Formatter.Service, { file: formatter })),
            Flag.node.replace(
              Layer.mock(Flag.Service, {
                enabled: () => Effect.succeed(false),
                resolve: (entries) => Flag.resolve({ entries, channel: "release" }),
              }),
            ),
            Machines.node.replace(
              Layer.mock(Machines.Service, {
                get: (id) => Effect.fail(new Machines.NotFound({ machine: id })),
              }),
            ),
            Permission.node.replace(permissionLayer(permission)),
          ],
        ),
      ),
    ),
  )
