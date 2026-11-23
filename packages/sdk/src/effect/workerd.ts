export * as XiaochuanWorkerd from "./workerd"

import { Layer } from "effect"
import type { Config, Scope } from "effect"
import { WorkerdProfile } from "../internal/workerd"
import { Xiaochuan } from "./xiaochuan"

export type Configuration = WorkerdProfile.Configuration

export interface CreateOptions<R = never> extends WorkerdProfile.Options {
  readonly log?: Xiaochuan.CreateOptions["log"]
  readonly plugins?: Xiaochuan.CreateOptions["plugins"]
  readonly workspaceProviders?: Xiaochuan.CreateOptions["workspaceProviders"]
  readonly instances?: Xiaochuan.CreateOptions<R>["instances"]
}

export const create = <R = never>({ log, plugins, workspaceProviders, instances, ...options }: CreateOptions<R>) => {
  const profile = WorkerdProfile.make(options)
  return Xiaochuan.create(
    { ...profile.options, log, plugins, workspaceProviders, instances },
    { overrides: profile.replacements },
  )
}

export const layer = <R = never>(
  options: CreateOptions<R>,
): Layer.Layer<Xiaochuan.Service, Config.ConfigError | Error, Exclude<R, Scope.Scope>> =>
  Layer.effect(Xiaochuan.Service, create(options))

export type Interface = Xiaochuan.Interface
export type Requirements = Scope.Scope
