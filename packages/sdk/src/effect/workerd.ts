export * as XccodeWorkerd from "./workerd"

import { Layer } from "effect"
import type { Config, Scope } from "effect"
import { WorkerdProfile } from "../internal/workerd"
import { Xccode } from "./xccode"

export type Configuration = WorkerdProfile.Configuration

export interface CreateOptions<R = never> extends WorkerdProfile.Options {
  readonly log?: Xccode.CreateOptions["log"]
  readonly plugins?: Xccode.CreateOptions["plugins"]
  readonly workspaceProviders?: Xccode.CreateOptions["workspaceProviders"]
  readonly instances?: Xccode.CreateOptions<R>["instances"]
}

export const create = <R = never>({ log, plugins, workspaceProviders, instances, ...options }: CreateOptions<R>) => {
  const profile = WorkerdProfile.make(options)
  return Xccode.create(
    { ...profile.options, log, plugins, workspaceProviders, instances },
    { overrides: profile.replacements },
  )
}

export const layer = <R = never>(
  options: CreateOptions<R>,
): Layer.Layer<Xccode.Service, Config.ConfigError | Error, Exclude<R, Scope.Scope>> =>
  Layer.effect(Xccode.Service, create(options))

export type Interface = Xccode.Interface
export type Requirements = Scope.Scope
