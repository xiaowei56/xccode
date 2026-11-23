import { defineCli } from "../../cli/run"
import { commented } from "./fixture"

// `mcp add` over an existing name replaces that server in place.
export default defineCli({
  args: ["mcp", "add", "existing", "--url", "https://mcp.example.test/"],
  files: { "xiaochuan.json": commented },
  collect: ["work/xiaochuan.json"],
})
