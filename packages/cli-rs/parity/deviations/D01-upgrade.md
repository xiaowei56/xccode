# D01: `upgrade` upgrades nothing

TypeScript: `xccode upgrade` (alias `update`) updates the TypeScript CLI it is.

Rust: `xccode-native upgrade` never delegates and upgrades nothing (`crates/cli/src/commands/upgrade.rs`). Its
flags (`--method`, the version argument) parse as in TS, with TS's errors (P-CLI `D.1/upgrade-bad-method`). Past
them, it prints one message on stderr for the install it detects, and exits 1:

| Install | Message |
| --- | --- |
| A preview build (version `0.0.0-native-<run>`), which bundles its server | `This is an Xccode native CLI preview build; re-run the install script to update it and its bundled server.` and the line below |
| `xccode` beside the binary's real path (the bundled layout) | ``This xccode-native is updated with the xccode installed beside it (<path>): run `xccode upgrade`.`` |
| A source build (version `local`) without one | `This xccode-native is a source build; rebuild it to update it.` and the line below |
| Any other build without one | `This xccode-native has no updater; update it the way you installed it.` and the line below |

The line below is ``\`xccode upgrade\` updates a separate TypeScript install, not this one.``

An `xccode` on `PATH` or named by `XCCODE_TS_BIN` is a separate TypeScript install, and `upgrade` never runs it.
Those lookups only find the binary that starts a server and runs the other delegated commands (D.1).

After the install script or `xccode upgrade` replaced both binaries, the background service still runs the old
version. The next `xccode-native` (TUI) or `xccode-native mini` restarts it on the new bundled binary, as TS's
client does after `xccode upgrade` (`S03-never-replace`).

Reason: the user decided (native-upgrade, after U8 of dx-fresh) that `xccode-native upgrade` must not upgrade
something else. Delegating to an `xccode` on `PATH` or in `XCCODE_TS_BIN` would update a separate install. In the
bundled layout users start everything through `xccode`, so the client running `xccode upgrade` would be the client
asking the server binary to replace the client: that is circular, and on Windows it cannot replace a running
`xccode-native.exe`. Preview builds come from the preview repository's install script, which the TypeScript updater
does not know about. The D.2 update flow replaces this.
