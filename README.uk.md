<p align="center">
  <a href="https://xccode.ai">
    <picture>
      <source srcset=".github/assets/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset=".github/assets/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src=".github/assets/logo-ornate-light.svg" alt="Xccode logo">
    </picture>
  </a>
</p>
<p align="center">AI-агент для програмування з відкритим кодом.</p>
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

### Встановлення

```bash
# YOLO
curl -fsSL https://xccode.ai/v2/install | bash

# Менеджери пакетів
npm i -g @xccode/cli@latest      # або bun/pnpm/yarn
brew install anomalyco/tap/xccode-v2 # macOS і Linux (рекомендовано, завжди актуально)
brew install xccode              # macOS і Linux (офіційна формула Homebrew, оновлюється рідше)
sudo pacman -S xccode            # Arch Linux (Stable)
paru -S xccode-beta              # Arch Linux (Latest from AUR)
mise use -g xccode               # Будь-яка ОС
nix run github:xiaowei56/xccode  # Nix
```

> [!TIP]
> Перед встановленням видаліть версії старші за 0.1.x.

### Десктопний застосунок (BETA)

Xccode також доступний як десктопний застосунок. Завантажуйте з [xccode.ai/download](https://xccode.ai/download).

| Платформа             | Завантаження                       |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `xccode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `xccode-desktop-mac-x64.dmg`     |
| Windows               | `xccode-desktop-win-x64.exe`     |
| Linux                 | `.deb`, `.rpm` або AppImage        |

```bash
# macOS (Homebrew)
brew install --cask xccode-desktop
```

#### Каталог встановлення

Скрипт встановлення встановлює Xccode в `$HOME/.xccode/bin`.

### Агенти

Xccode містить два вбудовані агенти, між якими можна перемикатися клавішею `Tab`.

- **build** - Агент за замовчуванням із повним доступом для завдань розробки
- **plan** - Агент лише для читання для аналізу та дослідження коду
  - За замовчуванням забороняє редагування файлів
  - Запитує дозвіл перед запуском bash-команд
  - Ідеально підходить для дослідження незнайомих кодових баз або планування змін

Також доступний допоміжний агент **general** для складного пошуку та багатокрокових завдань.
Він використовується всередині системи й може бути викликаний у повідомленнях через `@general`.

Дізнайтеся більше про [agents](https://xccode.ai/docs/agents).

### Документація

Щоб дізнатися більше про налаштування Xccode, [**перейдіть до нашої документації**](https://xccode.ai/docs).

### Внесок

Якщо ви хочете зробити внесок в Xccode, будь ласка, прочитайте нашу [документацію для контриб'юторів](./CONTRIBUTING.md) перед надсиланням pull request.

### Проєкти на базі Xccode

Якщо ви працюєте над проєктом, пов'язаним з Xccode, і використовуєте "xccode" у назві, наприклад "xccode-dashboard" або "xccode-mobile", додайте примітку до свого README.
Уточніть, що цей проєкт не створений командою Xccode і жодним чином не афілійований із нами.

---

**Приєднуйтеся до нашої спільноти** [Discord](https://discord.gg/xccode) | [X.com](https://x.com/xccode)
