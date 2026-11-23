import { expect, test } from "bun:test"
import { selectTheme, selectThemeMode, supportsThemeMode, themeModes } from "@xiaochuan/theme/tui"
import { getXiaochuanClassicTheme } from "../../../src/theme"

test("selects complete light and dark themes independently", () => {
  const light = selectTheme(getXiaochuanClassicTheme(), "light")
  const dark = selectTheme(getXiaochuanClassicTheme(), "dark")
  expect(selectTheme(getXiaochuanClassicTheme())).toEqual(light)
  expect(light.hue).toEqual(getXiaochuanClassicTheme().light.hue)
  expect(dark.text).toEqual(getXiaochuanClassicTheme().base.text)
  expect(dark.hue).toEqual(getXiaochuanClassicTheme().dark.hue)
  expect(selectThemeMode(getXiaochuanClassicTheme(), "dark")).toEqual({ theme: dark, mode: "dark" })
})

test("selects the available mode when the requested mode is missing", () => {
  const lightOnly = { base: getXiaochuanClassicTheme().base, light: getXiaochuanClassicTheme().light } as const
  const darkOnly = { base: getXiaochuanClassicTheme().base, dark: getXiaochuanClassicTheme().dark } as const

  expect(themeModes(lightOnly)).toEqual(["light"])
  expect(themeModes(darkOnly)).toEqual(["dark"])
  expect(supportsThemeMode(lightOnly, "light")).toBeTrue()
  expect(supportsThemeMode(lightOnly, "dark")).toBeFalse()
  expect(selectThemeMode(lightOnly, "dark")).toEqual({ theme: selectTheme(getXiaochuanClassicTheme(), "light"), mode: "light" })
  expect(selectThemeMode(darkOnly, "light")).toEqual({ theme: selectTheme(getXiaochuanClassicTheme(), "dark"), mode: "dark" })
})
