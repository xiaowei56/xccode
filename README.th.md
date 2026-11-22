<p align="center">
  <a href="https://xccode.ai">
    <picture>
      <source srcset=".github/assets/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset=".github/assets/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src=".github/assets/logo-ornate-light.svg" alt="Xccode logo">
    </picture>
  </a>
</p>
<p align="center">เอเจนต์การเขียนโค้ดด้วย AI แบบโอเพนซอร์ส</p>
<p align="center">
  <a href="https://xccode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/@xccode/cli"><img alt="npm" src="https://img.shields.io/npm/v/@xccode/cli?style=flat-square" /></a>
  <a href="https://github.com/xiaowei56/xccode/actions/workflows/release.yml"><img alt="สถานะการสร้าง" src="https://img.shields.io/github/actions/workflow/status/xiaowei56/xccode/release.yml?style=flat-square&branch=dev" /></a>
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

### การติดตั้ง

```bash
# YOLO
curl -fsSL https://xccode.ai/v2/install | bash

# ตัวจัดการแพ็กเกจ
npm i -g @xccode/cli@latest      # หรือ bun/pnpm/yarn
brew install anomalyco/tap/xccode-v2 # macOS และ Linux (แนะนำ อัปเดตเสมอ)
brew install xccode              # macOS และ Linux (brew formula อย่างเป็นทางการ อัปเดตน้อยกว่า)
sudo pacman -S xccode            # Arch Linux (Stable)
paru -S xccode-beta              # Arch Linux (Latest from AUR)
mise use -g xccode               # ระบบปฏิบัติการใดก็ได้
nix run github:xiaowei56/xccode  # Nix
```

> [!TIP]
> ลบเวอร์ชันที่เก่ากว่า 0.1.x ก่อนติดตั้ง

### แอปพลิเคชันเดสก์ท็อป (เบต้า)

Xccode มีให้ใช้งานเป็นแอปพลิเคชันเดสก์ท็อป ดาวน์โหลดจาก [xccode.ai/download](https://xccode.ai/download)

| แพลตฟอร์ม             | ดาวน์โหลด                          |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `xccode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `xccode-desktop-mac-x64.dmg`     |
| Windows               | `xccode-desktop-win-x64.exe`     |
| Linux                 | `.deb`, `.rpm`, หรือ AppImage      |

```bash
# macOS (Homebrew)
brew install --cask xccode-desktop
```

#### ไดเรกทอรีการติดตั้ง

สคริปต์การติดตั้งจะติดตั้ง Xccode ไว้ที่ `$HOME/.xccode/bin`

### เอเจนต์

Xccode รวมเอเจนต์ในตัวสองตัวที่คุณสามารถสลับได้ด้วยปุ่ม `Tab`

- **build** - เอเจนต์เริ่มต้น มีสิทธิ์เข้าถึงแบบเต็มสำหรับงานพัฒนา
- **plan** - เอเจนต์อ่านอย่างเดียวสำหรับการวิเคราะห์และการสำรวจโค้ด
  - ปฏิเสธการแก้ไขไฟล์โดยค่าเริ่มต้น
  - ขอสิทธิ์ก่อนเรียกใช้คำสั่ง bash
  - เหมาะสำหรับสำรวจโค้ดเบสที่ไม่คุ้นเคยหรือวางแผนการเปลี่ยนแปลง

นอกจากนี้ยังมีเอเจนต์ย่อย **general** สำหรับการค้นหาที่ซับซ้อนและงานหลายขั้นตอน
ใช้ภายในและสามารถเรียกใช้ได้โดยใช้ `@general` ในข้อความ

เรียนรู้เพิ่มเติมเกี่ยวกับ [เอเจนต์](https://xccode.ai/docs/agents)

### เอกสารประกอบ

สำหรับข้อมูลเพิ่มเติมเกี่ยวกับวิธีกำหนดค่า Xccode [**ไปที่เอกสารของเรา**](https://xccode.ai/docs)

### การมีส่วนร่วม

หากคุณสนใจที่จะมีส่วนร่วมใน Xccode โปรดอ่าน [เอกสารการมีส่วนร่วม](./CONTRIBUTING.md) ก่อนส่ง Pull Request

### การสร้างบน Xccode

หากคุณทำงานในโปรเจกต์ที่เกี่ยวข้องกับ Xccode และใช้ "xccode" เป็นส่วนหนึ่งของชื่อ เช่น "xccode-dashboard" หรือ "xccode-mobile" โปรดเพิ่มหมายเหตุใน README ของคุณเพื่อชี้แจงว่าไม่ได้สร้างโดยทีม Xccode และไม่ได้เกี่ยวข้องกับเราในทางใด

---

**ร่วมชุมชนของเรา** [Discord](https://discord.gg/xccode) | [X.com](https://x.com/xccode)
