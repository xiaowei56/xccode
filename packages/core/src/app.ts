export * as App from "./app.js"

import { Context, Layer } from "effect"
import { makeGlobalNode } from "@xccode/util/effect/app-node"

export interface Info {
  readonly name: string
  readonly version: string
  readonly channel: string
}

export class Service extends Context.Service<Service, Info>()("@xccode/App") {}

export function make(input: Partial<Info> = {}): Info {
  return {
    name: input.name ?? "xccode",
    version: input.version ?? "unknown",
    channel: input.channel ?? "unknown",
  }
}

export function useragent(app: Info) {
  return `xccode/${app.channel}/${app.version}/${app.name}`
}

export const layer = (input?: Partial<Info>) => Layer.succeed(Service, make(input))

export const configured = (input?: Partial<Info>) =>
  makeGlobalNode({ service: Service, layer: layer(input), deps: [] })

export const node = configured()
