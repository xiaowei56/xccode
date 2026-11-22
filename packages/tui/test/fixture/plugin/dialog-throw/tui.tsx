import { Plugin } from "@xccode/plugin/tui"

// A dialog that throws while rendering (xiaowei56/xccode#61101).
export default Plugin.define({
  id: "fixture.dialog-throw",
  setup(context) {
    context.ui.dialog.show(() => {
      throw new Error("dialog exploded")
    })
  },
})
