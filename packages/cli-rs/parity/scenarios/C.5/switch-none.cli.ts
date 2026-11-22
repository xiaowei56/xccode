import { defineCli } from "../../cli/run"
import { credentialWrites, integrationRoutes, sink } from "./fixture"

// `auth switch` for an integration without stored credentials.
export default defineCli({
  args: ["auth", "switch", "xccode-go", "x"],
  env: sink,
  server: { routes: [...integrationRoutes(), ...credentialWrites] },
})
