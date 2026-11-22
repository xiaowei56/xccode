import path from "node:path"
import { XCCODE_CHANNEL } from "./version"

export function databasePath(data: string) {
  const filename =
    process.env.XCCODE_DB ??
    (["latest", "dev", "beta", "next", "prod"].includes(XCCODE_CHANNEL) ||
    process.env.XCCODE_DISABLE_CHANNEL_DB === "1" ||
    process.env.XCCODE_DISABLE_CHANNEL_DB === "true"
      ? "xccode.db"
      : `xccode-${XCCODE_CHANNEL.replace(/[^a-zA-Z0-9._-]/g, "-")}.db`)
  return filename === ":memory:" ? filename : path.resolve(data, filename)
}
