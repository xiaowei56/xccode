#!/usr/bin/env bash
# render-homebrew.sh <sign-macos dir> <build-archives dir> <tap dir>: writes Formula xiaochuan-v2.rb with the
# hashes of the signed macOS and the Linux archives.
. "$(dirname "$0")/lib.sh"

macos=$1 archives=$2 tap=$3
sum() { sha256 "$1" | cut -c1-64; }
base="https://xiaochuan.ai/files/bin/$XIAOCHUAN_VERSION"
cat > "$tap/xiaochuan-v2.rb" <<FORMULA
# typed: false
# frozen_string_literal: true

class XiaochuanV2 < Formula
  desc "Xiaochuan V2 - the AI coding agent for the terminal"
  homepage "https://github.com/xiaowei56/xiaochuan"
  version "$XIAOCHUAN_VERSION"
  license "MIT"

  depends_on "ripgrep"
  conflicts_with "xiaochuan", because: "both install an xiaochuan binary"

  on_macos do
    if Hardware::CPU.arm?
      url "$base/xiaochuan-darwin-arm64.zip"
      sha256 "$(sum "$macos/xiaochuan-darwin-arm64.zip")"
    else
      url "$base/xiaochuan-darwin-x64-baseline.zip"
      sha256 "$(sum "$macos/xiaochuan-darwin-x64-baseline.zip")"
    end
  end

  on_linux do
    if Hardware::CPU.arm?
      url "$base/xiaochuan-linux-arm64.tar.gz"
      sha256 "$(sum "$archives/xiaochuan-linux-arm64.tar.gz")"
    else
      url "$base/xiaochuan-linux-x64-baseline.tar.gz"
      sha256 "$(sum "$archives/xiaochuan-linux-x64-baseline.tar.gz")"
    end
  end

  def install
    bin.install "xiaochuan"
  end
end
FORMULA
cat "$tap/xiaochuan-v2.rb"
