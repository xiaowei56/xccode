// The environment of the D.1 scenarios: `xiaochuan-native` delegates to the TS CLI from source (`bin/xiaochuan`),
// so both sides run the same TypeScript and must print the same thing. The TS side ignores these variables.
import path from "node:path"

const cli = path.resolve(import.meta.dir, "../../../../cli")

export const env = {
  XIAOCHUAN_TS_BIN: path.join(import.meta.dir, "bin/xiaochuan"),
  D1_CLI: cli,
  D1_PRELOAD: Bun.resolveSync("@opentui/solid/preload", cli),
}
