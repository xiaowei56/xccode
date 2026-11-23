<p align="center">
  <a href="https://xiaochuan.ai">
    <picture>
      <source srcset=".github/assets/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset=".github/assets/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src=".github/assets/logo-ornate-light.svg" alt="Logo Xiaochuan">
    </picture>
  </a>
</p>
<p align="center">L'agent de codage IA open source.</p>
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

# Gestionnaires de paquets
npm i -g @xiaochuan/cli@latest      # ou bun/pnpm/yarn
brew install anomalyco/tap/xiaochuan-v2 # macOS et Linux (recommandé, toujours à jour)
brew install xiaochuan              # macOS et Linux (formule officielle brew, mise à jour moins fréquente)
sudo pacman -S xiaochuan            # Arch Linux (Stable)
paru -S xiaochuan-beta              # Arch Linux (Latest from AUR)
mise use -g xiaochuan               # n'importe quel OS
nix run github:xiaowei56/xiaochuan  # Nix
```

> [!TIP]
> Supprimez les versions antérieures à 0.1.x avant d'installer.

### Application de bureau (BETA)

Xiaochuan est aussi disponible en application de bureau. Téléchargez-la depuis [xiaochuan.ai/download](https://xiaochuan.ai/download).

| Plateforme            | Téléchargement                     |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `xiaochuan-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `xiaochuan-desktop-mac-x64.dmg`     |
| Windows               | `xiaochuan-desktop-win-x64.exe`     |
| Linux                 | `.deb`, `.rpm`, ou AppImage        |

```bash
# macOS (Homebrew)
brew install --cask xiaochuan-desktop
```

#### Répertoire d'installation

Le script d'installation installe Xiaochuan dans `$HOME/.xiaochuan/bin`.

### Agents

Xiaochuan inclut deux agents intégrés que vous pouvez basculer avec la touche `Tab`.

- **build** - Par défaut, agent avec accès complet pour le travail de développement
- **plan** - Agent en lecture seule pour l'analyse et l'exploration du code
  - Refuse les modifications de fichiers par défaut
  - Demande l'autorisation avant d'exécuter des commandes bash
  - Idéal pour explorer une base de code inconnue ou planifier des changements

Un sous-agent **general** est aussi inclus pour les recherches complexes et les tâches en plusieurs étapes.
Il est utilisé en interne et peut être invoqué via `@general` dans les messages.

En savoir plus sur les [agents](https://xiaochuan.ai/docs/agents).

### Documentation

Pour plus d'informations sur la configuration d'Xiaochuan, [**consultez notre documentation**](https://xiaochuan.ai/docs).

### Contribuer

Si vous souhaitez contribuer à Xiaochuan, lisez nos [docs de contribution](./CONTRIBUTING.md) avant de soumettre une pull request.

### Construire avec Xiaochuan

Si vous travaillez sur un projet lié à Xiaochuan et que vous utilisez "xiaochuan" dans le nom du projet (par exemple, "xiaochuan-dashboard" ou "xiaochuan-mobile"), ajoutez une note dans votre README pour préciser qu'il n'est pas construit par l'équipe Xiaochuan et qu'il n'est pas affilié à nous.

---

**Rejoignez notre communauté** [Discord](https://discord.gg/xiaochuan) | [X.com](https://x.com/xiaochuan)
