# D01: `plugin add` of a TUI package says how xccode-native loads it

TypeScript: `xccode plugin add <package>` installs the package with npm. A package with a server or GUI part goes in
the global `xccode.json` (`Plugin "<package>" installed and added to …`); a package with only a TUI part goes in
`cli.json` (`TUI plugin "<package>" installed and added to …/cli.json`), and the TS client loads it.

Rust: `xccode-native plugin add` runs the TypeScript CLI with the same arguments, stdio and exit code, as every
`plugin` subcommand does (D.1), but as a child it waits for rather than in its place. xccode-native loads a TUI
package named in `cli.json` from the cache that install filled, on its JS host (`F16-typescript-plugins-skipped`).
The JS host is on by default, and then it prints nothing more, as TS. Only when `XCCODE_PLUGIN_JS` turns
it off (`0`, `false` or `off`), and the child succeeded and added an entry to `cli.json`, it prints one more line to
stdout for each: `xccode-native loads TUI plugin "<package>" on its JS host, which XCCODE_PLUGIN_JS turns off: unset
it to load it. The TypeScript client (xccode) loads it as it is.` A build without the cargo feature `ts` (ts-feature)
has no JS host, so it prints for each, whatever the variable says: `xccode-native will not load TUI plugin
"<package>": this build has no TypeScript plugin support (built without the ts feature). The TypeScript client
(xccode) loads it as it is.` A failed add, or one that changed nothing, prints nothing more.

Reason: with the JS host turned off, "installed and added" alone would tell the user it works (field test FT-11). The
line is driven by `crates/cli/tests/delegate.rs` `adding_a_tui_package_says_how_xccode_native_loads_it`, with a fake
TypeScript binary: a P-CLI case of `plugin add` would install from npm on both sides.
