import logoTransparentLight from "../../asset/brand/xiaochuan-logo-transparent-light.svg?no-inline"
import logoTransparentDark from "../../asset/brand/xiaochuan-logo-transparent-dark.svg?no-inline"
import logoSolidLight from "../../asset/brand/xiaochuan-logo-solid-light.svg?no-inline"
import logoSolidDark from "../../asset/brand/xiaochuan-logo-solid-dark.svg?no-inline"
import wordmarkTransparentLight from "../../asset/brand/xiaochuan-wordmark-transparent-light.svg?no-inline"
import wordmarkTransparentDark from "../../asset/brand/xiaochuan-wordmark-transparent-dark.svg?no-inline"
import wordmarkSolidLight from "../../asset/brand/xiaochuan-wordmark-solid-light.svg?no-inline"
import wordmarkSolidDark from "../../asset/brand/xiaochuan-wordmark-solid-dark.svg?no-inline"

/**
 * The extra logo files for the logo menus, by style, logo or wordmark, and tone. "transparent" lets the
 * background show through the inner shadow; "solid" is one colour with the shadow filled in.
 */
export const logoVariantSvgs = {
  transparent: {
    logo: { light: logoTransparentLight, dark: logoTransparentDark },
    wordmark: { light: wordmarkTransparentLight, dark: wordmarkTransparentDark },
  },
  solid: {
    logo: { light: logoSolidLight, dark: logoSolidDark },
    wordmark: { light: wordmarkSolidLight, dark: wordmarkSolidDark },
  },
}
