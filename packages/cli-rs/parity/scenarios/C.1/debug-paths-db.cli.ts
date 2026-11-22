// `debug paths db` with a relative `XCCODE_DB`, which resolves against the data directory.
import { defineCli } from "../../cli/run"

export default defineCli({
  args: ["debug", "paths", "db"],
  env: { XCCODE_DB: "../custom/./my.db" },
})
