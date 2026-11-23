import path from "node:path"
import { XIAOCHUAN_CHANNEL } from "./version"

export function databasePath(data: string) {
  const filename =
    process.env.XIAOCHUAN_DB ??
    (["latest", "dev", "beta", "next", "prod"].includes(XIAOCHUAN_CHANNEL) ||
    process.env.XIAOCHUAN_DISABLE_CHANNEL_DB === "1" ||
    process.env.XIAOCHUAN_DISABLE_CHANNEL_DB === "true"
      ? "xiaochuan.db"
      : `xiaochuan-${XIAOCHUAN_CHANNEL.replace(/[^a-zA-Z0-9._-]/g, "-")}.db`)
  return filename === ":memory:" ? filename : path.resolve(data, filename)
}
