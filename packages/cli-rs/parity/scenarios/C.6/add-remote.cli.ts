import { defineCli } from "../../cli/run"
import { commented } from "./fixture"

// `mcp add --url` with headers edits the existing commented `.xccode/xccode.jsonc` and keeps its comments.
export default defineCli({
  args: [
    "mcp",
    "add",
    "docs",
    "--url",
    "https://mcp.example.test/mcp",
    "--header",
    "Authorization=Bearer x",
    "--header",
    "X-Team=core",
  ],
  files: { ".xccode/xccode.jsonc": commented },
  collect: ["work/.xccode/xccode.jsonc", "work/xccode.json"],
})
