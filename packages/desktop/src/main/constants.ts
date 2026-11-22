import { app } from "electron"

type Channel = "local" | "dev" | "beta" | "prod"

const raw = import.meta.env.XCCODE_CHANNEL

export const CHANNEL: Channel = raw === "local" || raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

export const VERSION = app.isPackaged ? app.getVersion() : (process.env.XCCODE_VERSION ?? app.getVersion())

const appNames: Record<string, string> = {
  dev: "Xccode Dev",
  beta: "Xccode Beta",
  prod: "Xccode",
}

const appIDs: Record<string, string> = {
  dev: "ai.xccode.desktop.dev",
  beta: "ai.xccode.desktop.beta",
  prod: "ai.xccode.desktop",
}

// Local renderer/server mode keeps the dev application identity.
export const APP_NAME = app.isPackaged ? appNames[CHANNEL] : "Xccode Dev"

export const APP_ID = app.isPackaged ? appIDs[CHANNEL] : "ai.xccode.desktop.dev"
