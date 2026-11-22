import { CodeModeTool } from "@xccode/core/codemode/tool"
import { AppNodeBuilder } from "@xccode/core/effect/app-node-builder"
import { Environment } from "@xccode/core/environment/index"
import { FileAccess } from "@xccode/core/file-access"
import { FileMutation } from "@xccode/core/file-mutation"
import { FileWrite } from "@xccode/core/file-write"
import { Flag } from "@xccode/core/flag"
import { Formatter } from "@xccode/core/formatter"
import { Location } from "@xccode/core/location"
import { Machines } from "@xccode/core/machine/machines"
import { Permission } from "@xccode/core/permission"
import { AbsolutePath } from "@xccode/core/schema"
import { LayerNode } from "@xccode/util/effect/layer-node"
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
