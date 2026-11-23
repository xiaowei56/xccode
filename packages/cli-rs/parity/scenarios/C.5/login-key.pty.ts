// `auth login <integration>` with an API key: a masked prompt, then the key connect.
import { definePty } from "../../pty/run"
import { integrationRoutes, sink } from "./fixture"
import { enter, first, press } from "./keys"

export default definePty({
  args: ["auth", "login", "xiaochuan-go"],
  env: sink,
  server: {
    routes: [...integrationRoutes(), { method: "POST", path: "/api/integration/xiaochuan-go/connect/key", status: 204 }],
  },
  steps: [
    first("Xiaochuan Go key", "key"),
    press(enter, "required", "Required"),
    press("sk-test", "typed"),
    press(enter, "done", "Done"),
  ],
  osc: [],
  exits: true,
  requests: true,
})
