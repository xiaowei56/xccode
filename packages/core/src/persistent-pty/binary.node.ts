export const available = true

export async function resolveBinary() {
  return process.env.XIAOCHUAN_PTY_BIN || "xiaochuan-pty"
}
