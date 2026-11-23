import { expect, test } from "bun:test"
import { Env } from "../src/env"

test("session environment omits server credentials", () => {
  const previousPassword = process.env.XIAOCHUAN_PASSWORD
  const previousLegacyPassword = process.env.XIAOCHUAN_SERVER_PASSWORD
  const previousValue = process.env.XIAOCHUAN_SESSION_ENV_TEST
  process.env.XIAOCHUAN_PASSWORD = "password"
  process.env.XIAOCHUAN_SERVER_PASSWORD = "legacy"
  process.env.XIAOCHUAN_SESSION_ENV_TEST = "included"

  const environment = Env.session()

  if (previousPassword === undefined) delete process.env.XIAOCHUAN_PASSWORD
  else process.env.XIAOCHUAN_PASSWORD = previousPassword
  if (previousLegacyPassword === undefined) delete process.env.XIAOCHUAN_SERVER_PASSWORD
  else process.env.XIAOCHUAN_SERVER_PASSWORD = previousLegacyPassword
  if (previousValue === undefined) delete process.env.XIAOCHUAN_SESSION_ENV_TEST
  else process.env.XIAOCHUAN_SESSION_ENV_TEST = previousValue

  expect(environment.XIAOCHUAN_PASSWORD).toBeUndefined()
  expect(environment.XIAOCHUAN_SERVER_PASSWORD).toBeUndefined()
  expect(environment.XIAOCHUAN_SESSION_ENV_TEST).toBe("included")
})
