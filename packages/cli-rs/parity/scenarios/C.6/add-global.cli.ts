import { defineCli } from "../../cli/run"

// `mcp add --global` writes the global config, not the project's.
export default defineCli({
  args: ["mcp", "add", "remote", "--global", "--url", "https://mcp.example.test/mcp"],
  files: { "../home/.config/xccode/xccode.jsonc": "{}\n" },
  collect: ["home/.config/xccode/xccode.jsonc", "work/xccode.json"],
})
