#!/usr/bin/env bun
import path from "node:path"
import { pack } from "@xccode/script/pack"

await pack(path.resolve(import.meta.dir, ".."), { types: "./dist/types/" })
