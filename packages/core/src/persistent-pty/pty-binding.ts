import { binaryPath } from "@xiaochuan/pty"

const binding: string | { readonly path: string; readonly version: string; readonly sha256: string } | undefined =
  binaryPath

export default binding
