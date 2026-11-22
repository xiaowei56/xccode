import { defineCli } from "../../cli/run"

// `mcp add --global` in a home without `~/.config/xccode`: the directory is created, as TS's
// `Global.Service` does, and the server goes into a new `xccode.json`.
export default defineCli({
  args: ["mcp", "add", "remote", "--global", "--url", "https://mcp.example.test/mcp"],
  collect: ["home/.config/xccode/xccode.json", "work/xccode.json"],
})
