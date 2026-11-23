import { Plugin } from "@xiaochuan/plugin/tui"

// A dialog that throws while rendering (xiaowei56/xiaochuan#61101).
export default Plugin.define({
  id: "fixture.dialog-throw",
  setup(context) {
    context.ui.dialog.show(() => {
      throw new Error("dialog exploded")
    })
  },
})
