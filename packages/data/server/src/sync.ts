import { R2Sql } from "@xccode/data-core/r2-sql"
import { layer } from "@xccode/data-core/runtime"
import { syncData } from "@xccode/data-core/stat-sync"
import { Effect, Layer } from "effect"

// Runs one sync pass in this process, for local use. Deployed stages run the
// same steps in the DataSyncWorkflow.
await Effect.runPromise(
  syncData({ history: process.argv.includes("--history") }).pipe(Effect.provide(Layer.mergeAll(layer, R2Sql.layer))),
)
