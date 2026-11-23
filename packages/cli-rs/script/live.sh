#!/bin/sh
# Runs xiaochuan-native against the elected xiaochuan background service, as the root `dev:live` does for the
# TypeScript TUI: the dev storage channel, the service's URL, and its private password.
#
# Usage: script/live.sh [xiaochuan-native arguments...]
set -eu

rs=$(cd "$(dirname "$0")/.." && pwd)
server=$(xiaochuan service status)
XIAOCHUAN_PASSWORD=$(xiaochuan service get password)
XIAOCHUAN_TUI_CHANNEL=dev
export XIAOCHUAN_PASSWORD XIAOCHUAN_TUI_CHANNEL
# Builds from the workspace so cargo reads .cargo/config.toml, then runs in the caller's directory.
(cd "$rs" && cargo build --quiet --bin xiaochuan-native)
exec "$rs/target/debug/xiaochuan-native" "$@" --server "$server"
