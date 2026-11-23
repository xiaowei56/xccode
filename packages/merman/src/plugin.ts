import { Plugin } from "@xiaochuan/plugin/tui"
import { createMermaidCodeBlockRenderer } from "./markdown.js"
import { resolveXiaochuanDiagramPalette } from "./palette.js"

export default Plugin.define({
  id: "xiaochuan.merman",
  setup(context) {
    context.markdown.registerCodeBlockRenderer(
      "mermaid",
      createMermaidCodeBlockRenderer(context.renderer, () => ({
        colors: resolveXiaochuanDiagramPalette(context.theme, context.themeMode),
      })),
    )
  },
})
