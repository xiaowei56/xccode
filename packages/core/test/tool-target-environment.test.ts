import fs from "fs/promises"
import path from "path"
import { describe, expect } from "bun:test"
import { Effect, Layer } from "effect"
import { CodeModeTool } from "@xccode/core/codemode/tool"
import { AppNodeBuilder } from "@xccode/core/effect/app-node-builder"
import { LayerNode } from "@xccode/util/effect/layer-node"
import { FSUtil } from "@xccode/util/fs-util"
import { Global } from "@xccode/util/global"
import { makeLocationNode } from "@xccode/util/effect/app-node"
import { Config } from "@xccode/core/config"
import { Environment } from "@xccode/core/environment/index"
import { FileAccess } from "@xccode/core/file-access"
import { FileMutation } from "@xccode/core/file-mutation"
import { FileWrite } from "@xccode/core/file-write"
import { Flag } from "@xccode/core/flag"
import { Formatter } from "@xccode/core/formatter"
import { Image } from "@xccode/core/image"
import { InstructionDiscovery } from "@xccode/core/instruction-discovery"
import { Location } from "@xccode/core/location"
import { Permission } from "@xccode/core/permission"
import { Session } from "@xccode/core/session"
import { SessionInstructions } from "@xccode/core/session/instructions"
import { Skill } from "@xccode/core/skill"
import { Tool } from "@xccode/core/tool"
import { EditTool } from "@xccode/core/tool/plugin/edit"
import { PatchTool } from "@xccode/core/tool/plugin/patch"
import { ReadTool } from "@xccode/core/tool/plugin/read"
import { WriteTool } from "@xccode/core/tool/plugin/write"
import { elsewhere } from "./fixture/target-environment"
import { withTempDir } from "./fixture/tmpdir"
import { testEffect } from "./lib/effect"
import { executeTool, registerToolPlugin, toolIdentity } from "./lib/tool"

const fileToolsNode = makeLocationNode({
  name: "test/file-tool-plugins",
  layer: Layer.effectDiscard(
    Effect.all(
      [
        registerToolPlugin(ReadTool.Plugin),
        registerToolPlugin(WriteTool.Plugin),
        registerToolPlugin(EditTool.Plugin),
        registerToolPlugin(PatchTool.Plugin),
      ],
      { discard: true },
    ),
  ),
  deps: [
    Tool.node,
    FileAccess.node,
    FileMutation.node,
    FileWrite.node,
    Formatter.node,
    Image.node,
    Environment.node,
    Permission.node,
    SessionInstructions.node,
    InstructionDiscovery.node,
    Skill.node,
    FSUtil.node,
    Location.node,
    Config.node,
    Flag.node,
  ],
})

const sessionID = Session.ID.make("ses_target_environment_test")
const it = testEffect(Layer.succeed(Flag.Overrides, undefined))

describe("file tools", () => {
  it.live("read and write the resolved target's environment, not the session's", () =>
    withTempDir((tmp) => {
      const file = path.join(tmp.path, "notes.txt")
      const other = elsewhere(tmp.path)
      const execute = (registry: Tool.Interface, name: string, input: unknown) =>
        executeTool(registry, {
          sessionID,
          ...toolIdentity,
          call: { type: "tool-call", id: `call-${name}`, name, input },
        })

      return Effect.gen(function* () {
        yield* Effect.promise(() => fs.writeFile(file, "session\n"))
        const registry = yield* Tool.Service

        expect(yield* execute(registry, "write", { path: "notes.txt", content: "one\n" })).toMatchObject({
          status: "completed",
          output: "Created file successfully: notes.txt",
        })
        expect(other.assertions).toMatchObject([
          { action: "edit", metadata: { files: [{ status: "added", patch: expect.stringContaining("+one") }] } },
        ])
        expect(yield* execute(registry, "read", { path: "notes.txt" })).toMatchObject({
          status: "completed",
          output: { type: "text", content: "one\n" },
        })
        expect(
          yield* execute(registry, "edit", { path: "notes.txt", oldString: "one", newString: "two" }),
        ).toMatchObject({
          status: "completed",
          metadata: { files: [{ patch: expect.stringContaining("-one\n+two") }] },
        })
        expect(
          yield* execute(registry, "patch", {
            patchText: "*** Begin Patch\n*** Update File: notes.txt\n@@\n-two\n+three\n*** End Patch",
          }),
        ).toMatchObject({
          status: "completed",
          metadata: { files: [{ patch: expect.stringContaining("-two\n+three") }] },
        })

        expect(new TextDecoder().decode((yield* other.environment.files.read(file)).bytes)).toBe("three\n")
        expect(yield* Effect.promise(() => fs.readdir(tmp.path))).toEqual(["notes.txt"])
        expect(yield* Effect.promise(() => fs.readFile(file, "utf8"))).toBe("session\n")
      }).pipe(
        Effect.provide(
          AppNodeBuilder.build(LayerNode.group([Tool.node, fileToolsNode]), [
            ...other.replacements,
            Formatter.node.replace(Layer.mock(Formatter.Service, { file: () => Effect.succeed(false) })),
            Config.node.replace(Config.testLayer()),
            Global.node.replace(Global.layerWith({ data: Global.Path.data })),
          ]),
        ),
      )
    }),
  )
})

describe("Code Mode Bun", () => {
  it.live("reads, writes and deletes in the resolved target's environment, not the session's", () =>
    withTempDir((tmp) => {
      const file = path.join(tmp.path, "notes.txt")
      const other = elsewhere(tmp.path)

      return Effect.gen(function* () {
        yield* Effect.promise(() => fs.writeFile(file, "session\n"))
        const result = yield* CodeModeTool.create(
          { tools: new Map() },
          () => Effect.die("The program calls no tools."),
          yield* Permission.Service,
          yield* CodeModeTool.services,
        ).execute(
          {
            code: `const written = await Bun.write("notes.txt", "one\\n")
              const notes = Bun.file("notes.txt")
              const stat = await notes.stat()
              const first = [written, notes.size, await notes.text(), await notes.exists(), stat.size, stat.isFile()]
              await Bun.write("notes.txt", "two\\n")
              const second = await notes.text()
              await notes.delete()
              return [...first, second, await notes.exists(), new Bun.Glob("notes.txt").scanSync()]`,
          },
          { sessionID, ...toolIdentity, id: Tool.CallID.make("call_bun"), progress: () => Effect.void },
        )

        expect(JSON.parse(result.output.output)).toEqual([4, 4, "one\n", true, 4, true, "two\n", false, []])
        expect(other.assertions).toMatchObject([
          { action: "edit", metadata: { files: [{ status: "added", patch: expect.stringContaining("+one") }] } },
          { action: "read" },
          {
            action: "edit",
            metadata: { files: [{ status: "modified", patch: expect.stringContaining("-one\n+two") }] },
          },
          { action: "edit" },
          { action: "read", resources: ["notes.txt"] },
        ])
        expect(yield* Environment.exists(other.environment.files, file)).toBe(false)
        expect(yield* Effect.promise(() => fs.readdir(tmp.path))).toEqual(["notes.txt"])
        expect(yield* Effect.promise(() => fs.readFile(file, "utf8"))).toBe("session\n")
      }).pipe(
        Effect.provide(
          AppNodeBuilder.build(
            LayerNode.group([FileAccess.node, FileMutation.node, FileWrite.node, Location.node, Permission.node]),
            [
              ...other.replacements,
              Formatter.node.replace(Layer.mock(Formatter.Service, { file: () => Effect.succeed(false) })),
            ],
          ),
        ),
      )
    }),
  )
})
