interface ImportMetaEnv {
  readonly XCCODE_CHANNEL: string
  readonly XCCODE_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
