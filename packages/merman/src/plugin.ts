import { Plugin } from "@xccode/plugin/tui"
import { createMermaidCodeBlockRenderer } from "./markdown.js"
import { resolveXccodeDiagramPalette } from "./palette.js"

export default Plugin.define({
  id: "xccode.merman",
  setup(context) {
    context.markdown.registerCodeBlockRenderer(
      "mermaid",
      createMermaidCodeBlockRenderer(context.renderer, () => ({
        colors: resolveXccodeDiagramPalette(context.theme, context.themeMode),
      })),
    )
  },
})
