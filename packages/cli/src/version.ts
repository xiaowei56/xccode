import { Option, Schema } from "effect"

declare const XCCODE_VERSION: string
declare const XCCODE_CHANNEL: string
declare const XCCODE_ARTIFACT: string
declare const XCCODE_RELEASE_HIGHLIGHTS: string

const version = typeof XCCODE_VERSION === "string" ? XCCODE_VERSION : "local"
const channel = typeof XCCODE_CHANNEL === "string" ? XCCODE_CHANNEL : "local"
const artifact = typeof XCCODE_ARTIFACT === "string" ? XCCODE_ARTIFACT : "cli"
// Stable release builds embed the release notes' Highlights; every other build has none.
const highlights =
  typeof XCCODE_RELEASE_HIGHLIGHTS === "string"
    ? Option.getOrElse(
        Schema.decodeUnknownOption(
          Schema.fromJsonString(Schema.Array(Schema.Struct({ title: Schema.String, body: Schema.String }))),
        )(XCCODE_RELEASE_HIGHLIGHTS),
        () => [],
      )
    : []

export {
  version as XCCODE_VERSION,
  channel as XCCODE_CHANNEL,
  artifact as XCCODE_ARTIFACT,
  highlights as XCCODE_HIGHLIGHTS,
}
export const XCCODE_LOCAL = channel === "local"
