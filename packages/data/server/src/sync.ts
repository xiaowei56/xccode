import { R2Sql } from "@xiaochuan/data-core/r2-sql"
import { layer } from "@xiaochuan/data-core/runtime"
import { syncData } from "@xiaochuan/data-core/stat-sync"
import { Effect, Layer } from "effect"

// Runs one sync pass in this process, for local use. Deployed stages run the
// same steps in the DataSyncWorkflow.
await Effect.runPromise(
  syncData({ history: process.argv.includes("--history") }).pipe(Effect.provide(Layer.mergeAll(layer, R2Sql.layer))),
)
