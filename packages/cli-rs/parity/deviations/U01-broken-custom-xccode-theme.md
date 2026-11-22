# U01: a broken custom `xccode` theme falls back to the built-in one

**TypeScript.** A custom theme file named `xccode` replaces the built-in `xccode` theme
(`packages/tui/src/theme/index.ts:42-52`), and `xccode` is the theme every failed theme falls back to. When the
custom `xccode` is malformed, that fallback fails too: the `selected` memo rethrows for `xccode`
(`packages/tui/src/context/theme.tsx:298-308`), so the TUI stops. For example, `setCustomThemes({ xccode: { base:
{} } })` makes `parseTheme(allThemes().xccode)` throw `Invalid theme: xccode value is an invalid value`.

**Rust.** `ThemeState` (`crates/ui/src/theme/state.rs`) shows the failed theme's error toast as for any broken
theme, then loads the built-in `xccode` theme and logs `custom theme xccode: <message>; using the built-in
xccode theme`. This holds whether the broken custom `xccode` was selected or was the fallback of another theme
(a broken custom theme, or `system` without a terminal palette).

**Reason.** Defects the TypeScript client shares are fixed in Rust and recorded as deviations. A broken theme file should not stop the client.
