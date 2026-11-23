// `debug paths db` with a relative `XIAOCHUAN_DB`, which resolves against the data directory.
import { defineCli } from "../../cli/run"

export default defineCli({
  args: ["debug", "paths", "db"],
  env: { XIAOCHUAN_DB: "../custom/./my.db" },
})
