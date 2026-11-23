# C09: the database name in `debug paths`

TypeScript: `databasePath` names the file after the channel embedded at build time (`version.ts`):
`xiaochuan.db` for `latest`, `dev`, `beta`, `next`, and `prod`, else `xiaochuan-<channel>.db`. A build run from
source has channel `local`, so it prints `xiaochuan-local.db`.

Rust: the same rule, `XIAOCHUAN_DB` and `XIAOCHUAN_DISABLE_CHANNEL_DB` included, but the channel is read at run
time: `XIAOCHUAN_CHANNEL`, else `latest`. Without the variable it prints `xiaochuan.db`, the
database of a released client.

Reason: the Rust client has no build channel, and `latest` is the channel whose service and
database it uses by default. The P-CLI scenario `C.1/debug-paths` sets `XIAOCHUAN_DISABLE_CHANNEL_DB=1` so both
sides print `xiaochuan.db`.
