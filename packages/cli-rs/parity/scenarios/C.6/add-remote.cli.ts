import { defineCli } from "../../cli/run"
import { commented } from "./fixture"

// `mcp add --url` with headers edits the existing commented `.xiaochuan/xiaochuan.jsonc` and keeps its comments.
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
  files: { ".xiaochuan/xiaochuan.jsonc": commented },
  collect: ["work/.xiaochuan/xiaochuan.jsonc", "work/xiaochuan.json"],
})
