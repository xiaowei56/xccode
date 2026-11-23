// `--version` under a terminal: the same line on screen, no OSC sequences, exit 0.
import { definePty } from "../../pty/run"

export default definePty({
  args: ["--version"],
  cols: 40,
  rows: 4,
  steps: [{ until: { screen: "xiaochuan v" }, checkpoint: "version" }],
  exits: true,
})
