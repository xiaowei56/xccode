// The environment of the D.1 scenarios: `xccode-native` delegates to the TS CLI from source (`bin/xccode`),
// so both sides run the same TypeScript and must print the same thing. The TS side ignores these variables.
import path from "node:path"

const cli = path.resolve(import.meta.dir, "../../../../cli")

export const env = {
  XCCODE_TS_BIN: path.join(import.meta.dir, "bin/xccode"),
  D1_CLI: cli,
  D1_PRELOAD: Bun.resolveSync("@opentui/solid/preload", cli),
}
