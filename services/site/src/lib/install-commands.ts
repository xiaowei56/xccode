// Every Xiaochuan install command the site shows: the home install row, the Terminal, Mini and SDK
// pages, the docs, llms.txt, the view-source comment, voice answers and the console API.
// Checked on 5 Nov 2026 against the release workflow on origin/dev (.github/release/publish-npm.sh,
// publish-homebrew.sh, publish-aur.sh, the repo's install script) and the live registries, where each
// one installed Xiaochuan 2.2.5:
// - npm: @xiaochuan/cli, dist-tag latest = 2.2.5. Its postinstall links the platform binary, so Bun
//   needs --trust and pnpm needs --allow-build. mise resolves `xiaochuan` to npm:@xiaochuan/cli.
// - https://xiaochuan.ai/v2/install reads xiaochuan.ai/update/api/latest/cli/npm (@xiaochuan/cli 2.2.5).
// - Homebrew: anomalyco/tap/xiaochuan-v2 = 2.2.5. AUR: xiaochuan-beta = 2.2.5-1.
// Xiaochuan 1 still lives under the old names: the xiaochuan-ai npm package (1.19.5),
// https://xiaochuan.ai/install, anomalyco/tap/xiaochuan (1.19.5) and the xiaochuan-bin AUR package
// (1.19.5). test/install-commands.test.ts keeps them out of the site.

/** The home install row, the Terminal and Mini pages, llms.txt, the console API and the view-source comment. */
export const installs = [
  { id: "curl", name: "Script", command: "curl -fsSL https://xiaochuan.ai/v2/install | bash" },
  { id: "npm", name: "npm", command: "npm install -g @xiaochuan/cli" },
  { id: "bun", name: "Bun", command: "bun install -g --trust @xiaochuan/cli" },
  { id: "brew", name: "Homebrew", command: "brew install anomalyco/tap/xiaochuan-v2" },
  { id: "paru", name: "AUR", command: "paru -S xiaochuan-beta" },
] as const

/** The docs intro's install tabs: every channel that installs Xiaochuan 2. */
export const docsInstalls = [
  { label: "curl", code: installs[0].command },
  { label: "homebrew", code: installs[3].command },
  { label: "npm", code: installs[1].command },
  { label: "bun", code: installs[2].command },
  { label: "pnpm", code: "pnpm add -g --allow-build=@xiaochuan/cli @xiaochuan/cli" },
  { label: "yarn", code: "yarn global add @xiaochuan/cli" },
  { label: "vite+", code: "vp install -g @xiaochuan/cli" },
  { label: "aur", code: installs[4].command },
  { label: "mise", code: "mise use -g xiaochuan" },
]

/** The v2 SDK (@xiaochuan/sdk, dist-tag latest = 2.2.5). */
export const sdkInstalls = [
  { id: "npm", command: "npm i @xiaochuan/sdk" },
  { id: "bun", command: "bun add @xiaochuan/sdk" },
] as const

/** The desktop app's Homebrew cask (xiaochuan-desktop = 2.2.5). */
export const desktopInstall = { id: "cask", command: "brew install --cask xiaochuan-desktop" }
