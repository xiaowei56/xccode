import { Option, Schema } from "effect"

declare const XIAOCHUAN_VERSION: string
declare const XIAOCHUAN_CHANNEL: string
declare const XIAOCHUAN_ARTIFACT: string
declare const XIAOCHUAN_RELEASE_HIGHLIGHTS: string

const version = typeof XIAOCHUAN_VERSION === "string" ? XIAOCHUAN_VERSION : "local"
const channel = typeof XIAOCHUAN_CHANNEL === "string" ? XIAOCHUAN_CHANNEL : "local"
const artifact = typeof XIAOCHUAN_ARTIFACT === "string" ? XIAOCHUAN_ARTIFACT : "cli"
// Stable release builds embed the release notes' Highlights; every other build has none.
const highlights =
  typeof XIAOCHUAN_RELEASE_HIGHLIGHTS === "string"
    ? Option.getOrElse(
        Schema.decodeUnknownOption(
          Schema.fromJsonString(Schema.Array(Schema.Struct({ title: Schema.String, body: Schema.String }))),
        )(XIAOCHUAN_RELEASE_HIGHLIGHTS),
        () => [],
      )
    : []

export {
  version as XIAOCHUAN_VERSION,
  channel as XIAOCHUAN_CHANNEL,
  artifact as XIAOCHUAN_ARTIFACT,
  highlights as XIAOCHUAN_HIGHLIGHTS,
}
export const XIAOCHUAN_LOCAL = channel === "local"
