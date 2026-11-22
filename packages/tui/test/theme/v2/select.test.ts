import { expect, test } from "bun:test"
import { selectTheme, selectThemeMode, supportsThemeMode, themeModes } from "@xccode/theme/tui"
import { getXccodeClassicTheme } from "../../../src/theme"

test("selects complete light and dark themes independently", () => {
  const light = selectTheme(getXccodeClassicTheme(), "light")
  const dark = selectTheme(getXccodeClassicTheme(), "dark")
  expect(selectTheme(getXccodeClassicTheme())).toEqual(light)
  expect(light.hue).toEqual(getXccodeClassicTheme().light.hue)
  expect(dark.text).toEqual(getXccodeClassicTheme().base.text)
  expect(dark.hue).toEqual(getXccodeClassicTheme().dark.hue)
  expect(selectThemeMode(getXccodeClassicTheme(), "dark")).toEqual({ theme: dark, mode: "dark" })
})

test("selects the available mode when the requested mode is missing", () => {
  const lightOnly = { base: getXccodeClassicTheme().base, light: getXccodeClassicTheme().light } as const
  const darkOnly = { base: getXccodeClassicTheme().base, dark: getXccodeClassicTheme().dark } as const

  expect(themeModes(lightOnly)).toEqual(["light"])
  expect(themeModes(darkOnly)).toEqual(["dark"])
  expect(supportsThemeMode(lightOnly, "light")).toBeTrue()
  expect(supportsThemeMode(lightOnly, "dark")).toBeFalse()
  expect(selectThemeMode(lightOnly, "dark")).toEqual({ theme: selectTheme(getXccodeClassicTheme(), "light"), mode: "light" })
  expect(selectThemeMode(darkOnly, "light")).toEqual({ theme: selectTheme(getXccodeClassicTheme(), "dark"), mode: "dark" })
})
