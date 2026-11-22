export const available = true

export async function resolveBinary() {
  return process.env.XCCODE_PTY_BIN || "xccode-pty"
}
