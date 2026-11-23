import { app } from "electron"

type Channel = "local" | "dev" | "beta" | "prod"

const raw = import.meta.env.XIAOCHUAN_CHANNEL

export const CHANNEL: Channel = raw === "local" || raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

export const VERSION = app.isPackaged ? app.getVersion() : (process.env.XIAOCHUAN_VERSION ?? app.getVersion())

const appNames: Record<string, string> = {
  dev: "Xiaochuan Dev",
  beta: "Xiaochuan Beta",
  prod: "Xiaochuan",
}

const appIDs: Record<string, string> = {
  dev: "ai.xiaochuan.desktop.dev",
  beta: "ai.xiaochuan.desktop.beta",
  prod: "ai.xiaochuan.desktop",
}

// Local renderer/server mode keeps the dev application identity.
export const APP_NAME = app.isPackaged ? appNames[CHANNEL] : "Xiaochuan Dev"

export const APP_ID = app.isPackaged ? appIDs[CHANNEL] : "ai.xiaochuan.desktop.dev"
