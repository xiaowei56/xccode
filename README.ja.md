<p align="center">
  <a href="https://xccode.ai">
    <picture>
      <source srcset=".github/assets/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset=".github/assets/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src=".github/assets/logo-ornate-light.svg" alt="Xccode logo">
    </picture>
  </a>
</p>
<p align="center">オープンソースのAIコーディングエージェント。</p>
<p align="center">
  <a href="https://xccode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/@xccode/cli"><img alt="npm" src="https://img.shields.io/npm/v/@xccode/cli?style=flat-square" /></a>
  <a href="https://github.com/xiaowei56/xccode/actions/workflows/release.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/xiaowei56/xccode/release.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![Xccode Terminal UI](services/site/public/v1/docs/assets/lander/screenshot.png)](https://xccode.ai)

---

### インストール

```bash
# YOLO
curl -fsSL https://xccode.ai/v2/install | bash

# パッケージマネージャー
npm i -g @xccode/cli@latest      # bun/pnpm/yarn でもOK
brew install anomalyco/tap/xccode-v2 # macOS と Linux（推奨。常に最新）
brew install xccode              # macOS と Linux（公式 brew formula。更新頻度は低め）
sudo pacman -S xccode            # Arch Linux (Stable)
paru -S xccode-beta              # Arch Linux (Latest from AUR)
mise use -g xccode               # どのOSでも
nix run github:xiaowei56/xccode  # Nix
```

> [!TIP]
> インストール前に 0.1.x より古いバージョンを削除してください。

### デスクトップアプリ (BETA)

Xccode はデスクトップアプリとしても利用できます。[xccode.ai/download](https://xccode.ai/download) からダウンロードしてください。

| プラットフォーム      | ダウンロード                       |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `xccode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `xccode-desktop-mac-x64.dmg`     |
| Windows               | `xccode-desktop-win-x64.exe`     |
| Linux                 | `.deb`、`.rpm`、または AppImage    |

```bash
# macOS (Homebrew)
brew install --cask xccode-desktop
```

#### インストールディレクトリ

インストールスクリプトは、Xccode を `$HOME/.xccode/bin` にインストールします。

### Agents

Xccode には組み込みの Agent が2つあり、`Tab` キーで切り替えられます。

- **build** - デフォルト。開発向けのフルアクセス Agent
- **plan** - 分析とコード探索向けの読み取り専用 Agent
  - デフォルトでファイル編集を拒否
  - bash コマンド実行前に確認
  - 未知のコードベース探索や変更計画に最適

また、複雑な検索やマルチステップのタスク向けに **general** サブ Agent も含まれています。
内部的に使用されており、メッセージで `@general` と入力して呼び出せます。

[agents](https://xccode.ai/docs/agents) の詳細はこちら。

### ドキュメント

Xccode の設定については [**ドキュメント**](https://xccode.ai/docs) を参照してください。

### コントリビュート

Xccode に貢献したい場合は、Pull Request を送る前に [contributing docs](./CONTRIBUTING.md) を読んでください。

### Xccode の上に構築する

Xccode に関連するプロジェクトで、名前に "xccode"（例: "xccode-dashboard" や "xccode-mobile"）を含める場合は、そのプロジェクトが Xccode チームによって作られたものではなく、いかなる形でも関係がないことを README に明記してください。

---

**コミュニティに参加** [Discord](https://discord.gg/xccode) | [X.com](https://x.com/xccode)
