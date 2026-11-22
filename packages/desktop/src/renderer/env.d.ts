import type { ElectronNative } from "../preload/types"

declare global {
  interface ImportMetaEnv {
    readonly XCCODE_TEST_ONBOARDING: boolean
  }

  interface Window {
    electron: ElectronNative
  }
}
