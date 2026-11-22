#!/usr/bin/env bash
# render-homebrew.sh <sign-macos dir> <build-archives dir> <tap dir>: writes Formula xccode-v2.rb with the
# hashes of the signed macOS and the Linux archives.
. "$(dirname "$0")/lib.sh"

macos=$1 archives=$2 tap=$3
sum() { sha256 "$1" | cut -c1-64; }
base="https://xccode.ai/files/bin/$XCCODE_VERSION"
cat > "$tap/xccode-v2.rb" <<FORMULA
# typed: false
# frozen_string_literal: true

class XccodeV2 < Formula
  desc "Xccode V2 - the AI coding agent for the terminal"
  homepage "https://github.com/xiaowei56/xccode"
  version "$XCCODE_VERSION"
  license "MIT"

  depends_on "ripgrep"
  conflicts_with "xccode", because: "both install an xccode binary"

  on_macos do
    if Hardware::CPU.arm?
      url "$base/xccode-darwin-arm64.zip"
      sha256 "$(sum "$macos/xccode-darwin-arm64.zip")"
    else
      url "$base/xccode-darwin-x64-baseline.zip"
      sha256 "$(sum "$macos/xccode-darwin-x64-baseline.zip")"
    end
  end

  on_linux do
    if Hardware::CPU.arm?
      url "$base/xccode-linux-arm64.tar.gz"
      sha256 "$(sum "$archives/xccode-linux-arm64.tar.gz")"
    else
      url "$base/xccode-linux-x64-baseline.tar.gz"
      sha256 "$(sum "$archives/xccode-linux-x64-baseline.tar.gz")"
    end
  end

  def install
    bin.install "xccode"
  end
end
FORMULA
cat "$tap/xccode-v2.rb"
