<p align="center">
  <a href="https://xiaochuan.ai">
    <picture>
      <source srcset=".github/assets/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset=".github/assets/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src=".github/assets/logo-ornate-light.svg" alt="Xiaochuan logo">
    </picture>
  </a>
</p>
<p align="center">Открытый AI-агент для программирования.</p>
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

### Установка

```bash
# YOLO
curl -fsSL https://xiaochuan.ai/v2/install | bash

# Менеджеры пакетов
npm i -g @xiaochuan/cli@latest      # или bun/pnpm/yarn
brew install anomalyco/tap/xiaochuan-v2 # macOS и Linux (рекомендуем, всегда актуально)
brew install xiaochuan              # macOS и Linux (официальная формула brew, обновляется реже)
sudo pacman -S xiaochuan            # Arch Linux (Stable)
paru -S xiaochuan-beta              # Arch Linux (Latest from AUR)
mise use -g xiaochuan               # любая ОС
nix run github:xiaowei56/xiaochuan  # Nix
```

> [!TIP]
> Перед установкой удалите версии старше 0.1.x.

### Десктопное приложение (BETA)

Xiaochuan также доступен как десктопное приложение. Скачайте его с [xiaochuan.ai/download](https://xiaochuan.ai/download).

| Платформа             | Загрузка                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `xiaochuan-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `xiaochuan-desktop-mac-x64.dmg`     |
| Windows               | `xiaochuan-desktop-win-x64.exe`     |
| Linux                 | `.deb`, `.rpm` или AppImage        |

```bash
# macOS (Homebrew)
brew install --cask xiaochuan-desktop
```

#### Каталог установки

Скрипт установки устанавливает Xiaochuan в `$HOME/.xiaochuan/bin`.

### Agents

В Xiaochuan есть два встроенных агента, между которыми можно переключаться клавишей `Tab`.

- **build** - По умолчанию, агент с полным доступом для разработки
- **plan** - Агент только для чтения для анализа и изучения кода
  - По умолчанию запрещает редактирование файлов
  - Запрашивает разрешение перед выполнением bash-команд
  - Идеален для изучения незнакомых кодовых баз или планирования изменений

Также включен сабагент **general** для сложных поисков и многошаговых задач.
Он используется внутренне и может быть вызван в сообщениях через `@general`.

Подробнее об [agents](https://xiaochuan.ai/docs/agents).

### Документация

Больше информации о том, как настроить Xiaochuan: [**наши docs**](https://xiaochuan.ai/docs).

### Вклад

Если вы хотите внести вклад в Xiaochuan, прочитайте [contributing docs](./CONTRIBUTING.md) перед тем, как отправлять pull request.

### Разработка на базе Xiaochuan

Если вы делаете проект, связанный с Xiaochuan, и используете "xiaochuan" как часть имени (например, "xiaochuan-dashboard" или "xiaochuan-mobile"), добавьте примечание в README, чтобы уточнить, что проект не создан командой Xiaochuan и не аффилирован с нами.

---

**Присоединяйтесь к нашему сообществу** [Discord](https://discord.gg/xiaochuan) | [X.com](https://x.com/xiaochuan)
