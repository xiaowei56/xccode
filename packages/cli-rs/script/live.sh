#!/bin/sh
# Runs xccode-native against the elected xccode background service, as the root `dev:live` does for the
# TypeScript TUI: the dev storage channel, the service's URL, and its private password.
#
# Usage: script/live.sh [xccode-native arguments...]
set -eu

rs=$(cd "$(dirname "$0")/.." && pwd)
server=$(xccode service status)
XCCODE_PASSWORD=$(xccode service get password)
XCCODE_TUI_CHANNEL=dev
export XCCODE_PASSWORD XCCODE_TUI_CHANNEL
# Builds from the workspace so cargo reads .cargo/config.toml, then runs in the caller's directory.
(cd "$rs" && cargo build --quiet --bin xccode-native)
exec "$rs/target/debug/xccode-native" "$@" --server "$server"
