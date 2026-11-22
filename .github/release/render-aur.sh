#!/usr/bin/env bash
# render-aur.sh <build-npm dir> <aur dir>: writes PKGBUILD, .SRCINFO and the xccode2 shim for xccode-beta.
# The package installs the published npm tarballs, so their hashes come from the build-npm artifact.
# LICENSE comes from the AUR repository itself.
. "$(dirname "$0")/lib.sh"

npm=$1 aur=$2
name=xccode-beta
pkgver="${XCCODE_VERSION//-/.}"
if dry_run && [ ! -f "$aur/LICENSE" ]; then printf 'MIT License\n' > "$aur/LICENSE"; fi
test -s "$aur/LICENSE" || die "The AUR repository has no LICENSE"
printf '#!/bin/sh\nexec "$(dirname "$0")/xccode" "$@"\n' > "$aur/xccode2"
sum() { sha256 "$1" | cut -c1-64; }
x64=$(sum "$npm/xccode-cli-linux-x64-baseline-$XCCODE_VERSION.tgz")
arm64=$(sum "$npm/xccode-cli-linux-arm64-$XCCODE_VERSION.tgz")
x64_url="https://registry.npmjs.org/@xccode/cli-linux-x64-baseline/-/cli-linux-x64-baseline-$XCCODE_VERSION.tgz"
arm64_url="https://registry.npmjs.org/@xccode/cli-linux-arm64/-/cli-linux-arm64-$XCCODE_VERSION.tgz"
license=$(sum "$aur/LICENSE")
shim=$(sum "$aur/xccode2")

# Stripping a compiled Bun executable can damage its embedded application.
cat > "$aur/PKGBUILD" <<PKGBUILD
# Maintainer: Dax <mail@thdxr.com>
pkgname=$name
pkgver=$pkgver
pkgrel=1
pkgdesc='Xccode beta - the AI coding agent for the terminal'
url='https://github.com/xiaowei56/xccode'
arch=('x86_64' 'aarch64')
license=('MIT')
depends=('glibc' 'gcc-libs' 'ripgrep')
provides=('xccode' 'xccode2')
conflicts=('xccode' 'xccode2')
options=('!strip' '!debug')
source=('LICENSE' 'xccode2')
sha256sums=('$license' '$shim')
source_x86_64=('$name-$pkgver-x86_64.tgz::$x64_url')
sha256sums_x86_64=('$x64')
source_aarch64=('$name-$pkgver-aarch64.tgz::$arm64_url')
sha256sums_aarch64=('$arm64')

package() {
  install -Dm755 "\$srcdir/package/bin/xccode" "\$pkgdir/usr/bin/xccode"
  install -Dm755 "\$srcdir/xccode2" "\$pkgdir/usr/bin/xccode2"
  install -Dm644 "\$srcdir/LICENSE" "\$pkgdir/usr/share/licenses/\$pkgname/LICENSE"
}
PKGBUILD

# What makepkg --printsrcinfo prints for the PKGBUILD above.
t=$'\t'
cat > "$aur/.SRCINFO" <<SRCINFO
pkgbase = $name
${t}pkgdesc = Xccode beta - the AI coding agent for the terminal
${t}pkgver = $pkgver
${t}pkgrel = 1
${t}url = https://github.com/xiaowei56/xccode
${t}arch = x86_64
${t}arch = aarch64
${t}license = MIT
${t}depends = glibc
${t}depends = gcc-libs
${t}depends = ripgrep
${t}provides = xccode
${t}provides = xccode2
${t}conflicts = xccode
${t}conflicts = xccode2
${t}options = !strip
${t}options = !debug
${t}source = LICENSE
${t}source = xccode2
${t}sha256sums = $license
${t}sha256sums = $shim
${t}source_x86_64 = $name-$pkgver-x86_64.tgz::$x64_url
${t}sha256sums_x86_64 = $x64
${t}source_aarch64 = $name-$pkgver-aarch64.tgz::$arm64_url
${t}sha256sums_aarch64 = $arm64

pkgname = $name
SRCINFO
cat "$aur/PKGBUILD" "$aur/.SRCINFO"
