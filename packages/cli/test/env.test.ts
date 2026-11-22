import { expect, test } from "bun:test"
import { Env } from "../src/env"

test("session environment omits server credentials", () => {
  const previousPassword = process.env.XCCODE_PASSWORD
  const previousLegacyPassword = process.env.XCCODE_SERVER_PASSWORD
  const previousValue = process.env.XCCODE_SESSION_ENV_TEST
  process.env.XCCODE_PASSWORD = "password"
  process.env.XCCODE_SERVER_PASSWORD = "legacy"
  process.env.XCCODE_SESSION_ENV_TEST = "included"

  const environment = Env.session()

  if (previousPassword === undefined) delete process.env.XCCODE_PASSWORD
  else process.env.XCCODE_PASSWORD = previousPassword
  if (previousLegacyPassword === undefined) delete process.env.XCCODE_SERVER_PASSWORD
  else process.env.XCCODE_SERVER_PASSWORD = previousLegacyPassword
  if (previousValue === undefined) delete process.env.XCCODE_SESSION_ENV_TEST
  else process.env.XCCODE_SESSION_ENV_TEST = previousValue

  expect(environment.XCCODE_PASSWORD).toBeUndefined()
  expect(environment.XCCODE_SERVER_PASSWORD).toBeUndefined()
  expect(environment.XCCODE_SESSION_ENV_TEST).toBe("included")
})
