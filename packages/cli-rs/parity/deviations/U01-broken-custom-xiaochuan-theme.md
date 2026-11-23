# U01: a broken custom `xiaochuan` theme falls back to the built-in one

**TypeScript.** A custom theme file named `xiaochuan` replaces the built-in `xiaochuan` theme
(`packages/tui/src/theme/index.ts:42-52`), and `xiaochuan` is the theme every failed theme falls back to. When the
custom `xiaochuan` is malformed, that fallback fails too: the `selected` memo rethrows for `xiaochuan`
(`packages/tui/src/context/theme.tsx:298-308`), so the TUI stops. For example, `setCustomThemes({ xiaochuan: { base:
{} } })` makes `parseTheme(allThemes().xiaochuan)` throw `Invalid theme: xiaochuan value is an invalid value`.

**Rust.** `ThemeState` (`crates/ui/src/theme/state.rs`) shows the failed theme's error toast as for any broken
theme, then loads the built-in `xiaochuan` theme and logs `custom theme xiaochuan: <message>; using the built-in
xiaochuan theme`. This holds whether the broken custom `xiaochuan` was selected or was the fallback of another theme
(a broken custom theme, or `system` without a terminal palette).

**Reason.** Defects the TypeScript client shares are fixed in Rust and recorded as deviations. A broken theme file should not stop the client.
