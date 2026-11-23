<p align="center">
  <a href="https://xiaochuan.ai">
    <picture>
      <source srcset=".github/assets/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset=".github/assets/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src=".github/assets/logo-ornate-light.svg" alt="Xiaochuan logo">
    </picture>
  </a>
</p>
<p align="center">Der Open-Source KI-Coding-Agent.</p>
<p align="center">
  <a href="https://xiaochuan.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/@xiaochuan/cli"><img alt="npm" src="https://img.shields.io/npm/v/@xiaochuan/cli?style=flat-square" /></a>
  <a href="https://github.com/xiaowei56/xiaochuan/actions/workflows/release.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/xiaowei56/xiaochuan/release.yml?style=flat-square&branch=dev" /></a>
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

[![Xiaochuan Terminal UI](services/site/public/v1/docs/assets/lander/screenshot.png)](https://xiaochuan.ai)

---

### Installation

```bash
# YOLO
curl -fsSL https://xiaochuan.ai/v2/install | bash

# Paketmanager
npm i -g @xiaochuan/cli@latest      # oder bun/pnpm/yarn
brew install anomalyco/tap/xiaochuan-v2 # macOS und Linux (empfohlen, immer aktuell)
brew install xiaochuan              # macOS und Linux (offizielle Brew-Formula, seltener aktualisiert)
sudo pacman -S xiaochuan            # Arch Linux (Stable)
paru -S xiaochuan-beta              # Arch Linux (Latest from AUR)
mise use -g xiaochuan               # jedes Betriebssystem
nix run github:xiaowei56/xiaochuan  # Nix
```

> [!TIP]
> Entferne Versionen älter als 0.1.x vor der Installation.

### Desktop-App (BETA)

Xiaochuan ist auch als Desktop-Anwendung verfügbar. Lade sie von [xiaochuan.ai/download](https://xiaochuan.ai/download) herunter.

| Plattform             | Download                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `xiaochuan-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `xiaochuan-desktop-mac-x64.dmg`     |
| Windows               | `xiaochuan-desktop-win-x64.exe`     |
| Linux                 | `.deb`, `.rpm` oder AppImage       |

```bash
# macOS (Homebrew)
brew install --cask xiaochuan-desktop
```

#### Installationsverzeichnis

Das Installationsskript installiert Xiaochuan in `$HOME/.xiaochuan/bin`.

### Agents

Xiaochuan enthält zwei eingebaute Agents, zwischen denen du mit der `Tab`-Taste wechseln kannst.

- **build** - Standard-Agent mit vollem Zugriff für Entwicklungsarbeit
- **plan** - Nur-Lese-Agent für Analyse und Code-Exploration
  - Verweigert Datei-Edits standardmäßig
  - Fragt vor dem Ausführen von bash-Befehlen nach
  - Ideal zum Erkunden unbekannter Codebases oder zum Planen von Änderungen

Außerdem ist ein **general**-Subagent für komplexe Suchen und mehrstufige Aufgaben enthalten.
Dieser wird intern genutzt und kann in Nachrichten mit `@general` aufgerufen werden.

Mehr dazu unter [Agents](https://xiaochuan.ai/docs/agents).

### Dokumentation

Mehr Infos zur Konfiguration von Xiaochuan findest du in unseren [**Docs**](https://xiaochuan.ai/docs).

### Beitragen

Wenn du zu Xiaochuan beitragen möchtest, lies bitte unsere [Contributing Docs](./CONTRIBUTING.md), bevor du einen Pull Request einreichst.

### Auf Xiaochuan aufbauen

Wenn du an einem Projekt arbeitest, das mit Xiaochuan zusammenhängt und "xiaochuan" als Teil seines Namens verwendet (z.B. "xiaochuan-dashboard" oder "xiaochuan-mobile"), füge bitte einen Hinweis in deine README ein, dass es nicht vom Xiaochuan-Team gebaut wird und nicht in irgendeiner Weise mit uns verbunden ist.

---

**Tritt unserer Community bei** [Discord](https://discord.gg/xiaochuan) | [X.com](https://x.com/xiaochuan)
