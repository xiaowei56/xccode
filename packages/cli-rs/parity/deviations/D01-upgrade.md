# D01: `upgrade` upgrades nothing

TypeScript: `xiaochuan upgrade` (alias `update`) updates the TypeScript CLI it is.

Rust: `xiaochuan-native upgrade` never delegates and upgrades nothing (`crates/cli/src/commands/upgrade.rs`). Its
flags (`--method`, the version argument) parse as in TS, with TS's errors (P-CLI `D.1/upgrade-bad-method`). Past
them, it prints one message on stderr for the install it detects, and exits 1:

| Install | Message |
| --- | --- |
| A preview build (version `0.0.0-native-<run>`), which bundles its server | `This is an Xiaochuan native CLI preview build; re-run the install script to update it and its bundled server.` and the line below |
| `xiaochuan` beside the binary's real path (the bundled layout) | ``This xiaochuan-native is updated with the xiaochuan installed beside it (<path>): run `xiaochuan upgrade`.`` |
| A source build (version `local`) without one | `This xiaochuan-native is a source build; rebuild it to update it.` and the line below |
| Any other build without one | `This xiaochuan-native has no updater; update it the way you installed it.` and the line below |

The line below is ``\`xiaochuan upgrade\` updates a separate TypeScript install, not this one.``

An `xiaochuan` on `PATH` or named by `XIAOCHUAN_TS_BIN` is a separate TypeScript install, and `upgrade` never runs it.
Those lookups only find the binary that starts a server and runs the other delegated commands (D.1).

After the install script or `xiaochuan upgrade` replaced both binaries, the background service still runs the old
version. The next `xiaochuan-native` (TUI) or `xiaochuan-native mini` restarts it on the new bundled binary, as TS's
client does after `xiaochuan upgrade` (`S03-never-replace`).

Reason: the user decided (native-upgrade, after U8 of dx-fresh) that `xiaochuan-native upgrade` must not upgrade
something else. Delegating to an `xiaochuan` on `PATH` or in `XIAOCHUAN_TS_BIN` would update a separate install. In the
bundled layout users start everything through `xiaochuan`, so the client running `xiaochuan upgrade` would be the client
asking the server binary to replace the client: that is circular, and on Windows it cannot replace a running
`xiaochuan-native.exe`. Preview builds come from the preview repository's install script, which the TypeScript updater
does not know about. The D.2 update flow replaces this.
