import {
  Agent,
  Command,
  Connection,
  Credential,
  Integration,
  Model,
  Plugin,
  Provider,
  Reference,
  Skill,
} from "@xiaochuan/plugin"

const key = Symbol.for("xiaochuan.plugin.v2.promise")
;(globalThis as typeof globalThis & { [key]?: unknown })[key] = {
  Agent,
  Command,
  Connection,
  Credential,
  Integration,
  Model,
  Plugin,
  Provider,
  Reference,
  Skill,
}
