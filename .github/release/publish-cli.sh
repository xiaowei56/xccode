#!/usr/bin/env bash
# publish-cli.sh <build-archives dir> <sign-macos dir> <sign-windows dir>: uploads the standalone CLI
# archives to xiaochuan.ai/files and registers the cli (and, off latest, cli-node) update artifacts.
. "$(dirname "$0")/lib.sh"

archives=$1 macos=$2 windows=$3
cli=()
for target in linux-arm64 linux-x64 linux-x64-baseline linux-arm64-musl linux-x64-musl linux-x64-baseline-musl; do cli+=("$archives/xiaochuan-$target.tar.gz"); done
for target in darwin-arm64 darwin-x64 darwin-x64-baseline; do cli+=("$macos/xiaochuan-$target.zip"); done
for target in windows-arm64 windows-x64 windows-x64-baseline; do cli+=("$windows/xiaochuan-$target.zip"); done

files=$(upload_files "${cli[@]}")
publish_update cli npm '{"package": "@xiaochuan/cli"}'
publish_update cli xiaochuan "$(jq -n --argjson files "$files" '{files: $files}')"

if [ "$XIAOCHUAN_CHANNEL" != latest ]; then
  node=()
  for target in linux-arm64 linux-x64; do node+=("$archives/xiaochuan2-node-$target.tar.gz"); done
  for target in darwin-arm64 windows-arm64 windows-x64; do node+=("$archives/xiaochuan2-node-$target.zip"); done
  files=$(upload_files "${node[@]}")
  publish_update cli-node npm '{"package": "@xiaochuan/cli-node"}'
  publish_update cli-node xiaochuan "$(jq -n --argjson files "$files" '{files: $files}')"
fi
