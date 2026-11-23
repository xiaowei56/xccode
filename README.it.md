<p align="center">
  <a href="https://xiaochuan.ai">
    <picture>
      <source srcset=".github/assets/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset=".github/assets/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src=".github/assets/logo-ornate-light.svg" alt="Logo Xiaochuan">
    </picture>
  </a>
</p>
<p align="center">L’agente di coding AI open source.</p>
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

### Installazione

```bash
# YOLO
curl -fsSL https://xiaochuan.ai/v2/install | bash

# Package manager
npm i -g @xiaochuan/cli@latest      # oppure bun/pnpm/yarn
brew install anomalyco/tap/xiaochuan-v2 # macOS e Linux (consigliato, sempre aggiornato)
brew install xiaochuan              # macOS e Linux (formula brew ufficiale, aggiornata meno spesso)
sudo pacman -S xiaochuan            # Arch Linux (Stable)
paru -S xiaochuan-beta              # Arch Linux (Latest from AUR)
mise use -g xiaochuan               # Qualsiasi OS
nix run github:xiaowei56/xiaochuan  # Nix
```

> [!TIP]
> Rimuovi le versioni precedenti alla 0.1.x prima di installare.

### App Desktop (BETA)

Xiaochuan è disponibile anche come applicazione desktop. Puoi scaricarla da [xiaochuan.ai/download](https://xiaochuan.ai/download).

| Piattaforma           | Download                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `xiaochuan-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `xiaochuan-desktop-mac-x64.dmg`     |
| Windows               | `xiaochuan-desktop-win-x64.exe`     |
| Linux                 | `.deb`, `.rpm`, oppure AppImage    |

```bash
# macOS (Homebrew)
brew install --cask xiaochuan-desktop
```

#### Directory di installazione

Lo script di installazione installa Xiaochuan in `$HOME/.xiaochuan/bin`.

### Agenti

Xiaochuan include due agenti integrati tra cui puoi passare usando il tasto `Tab`.

- **build** – Predefinito, agente con accesso completo per il lavoro di sviluppo
- **plan** – Agente in sola lettura per analisi ed esplorazione del codice
  - Nega le modifiche ai file per impostazione predefinita
  - Chiede il permesso prima di eseguire comandi bash
  - Ideale per esplorare codebase sconosciute o pianificare modifiche

È inoltre incluso un sotto-agente **general** per ricerche complesse e attività multi-step.
Viene utilizzato internamente e può essere invocato usando `@general` nei messaggi.

Scopri di più sugli [agenti](https://xiaochuan.ai/docs/agents).

### Documentazione

Per maggiori informazioni su come configurare Xiaochuan, [**consulta la nostra documentazione**](https://xiaochuan.ai/docs).

### Contribuire

Se sei interessato a contribuire a Xiaochuan, leggi la nostra [guida alla contribuzione](./CONTRIBUTING.md) prima di inviare una pull request.

### Costruire su Xiaochuan

Se stai lavorando a un progetto correlato a Xiaochuan e che utilizza “xiaochuan” come parte del nome (ad esempio “xiaochuan-dashboard” o “xiaochuan-mobile”), aggiungi una nota nel tuo README per chiarire che non è sviluppato dal team Xiaochuan e che non è affiliato in alcun modo con noi.

---

**Unisciti alla nostra community** [Discord](https://discord.gg/xiaochuan) | [X.com](https://x.com/xiaochuan)
