import { expect, test } from "bun:test"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { tmpdir } from "../../core/test/fixture/tmpdir"
import { Xccode, Session } from "../src"

test("Promise host uses the embedded router", async () => {
  await using directory = await tmpdir("xccode-promise-sdk-")
  const config = join(directory.path, "config")
  await mkdir(config)
  const xccode = await Xccode.create({
    events: { persist: true },
    config: { directory: config, project: false, content: "{}" },
  })

  try {
    const location = { directory: directory.path }
    const session = await xccode.sessions.create({ location })
    const selected = await xccode.sessions.get({ sessionID: session.id })
    const page = await xccode.sessions.list({ directory: directory.path })
    const events = Array.fromAsync(xccode.experimental.session.log({ sessionID: session.id }))

    expect(selected.id).toBe(session.id)
    expect(page.data.some((item) => item.id === session.id)).toBe(true)
    expect((await events).some((event) => event.type === "session.created")).toBe(true)

    const missingSessionID = Session.ID.create()
    const missing = await xccode.sessions.get({ sessionID: missingSessionID }).catch((error: unknown) => error)
    expect(missing).toMatchObject({ _tag: "SessionNotFoundError", sessionID: missingSessionID })
  } finally {
    await xccode.close()
    await xccode.close()
  }
})

test("Promise event streams support cancellation", async () => {
  await using directory = await tmpdir("xccode-promise-stream-")
  const config = join(directory.path, "config")
  await mkdir(config)
  {
    await using xccode = await Xccode.create({ config: { directory: config, project: false, content: "{}" } })
    const controller = new AbortController()
    const events = xccode.events.subscribe({ signal: controller.signal })[Symbol.asyncIterator]()
    expect(await events.next()).toMatchObject({ value: { type: "server.connected" }, done: false })
    const pending = events.next()
    controller.abort()
    // A caller abort ends only this subscriber; client tests pin closing the shared transport after the last one.
    expect(await pending).toEqual({ done: true, value: undefined })
    await events.return?.()
  }
})

test("closing cancels active Promise event streams", async () => {
  await using directory = await tmpdir("xccode-promise-stream-close-")
  const config = join(directory.path, "config")
  await mkdir(config)
  const xccode = await Xccode.create({ config: { directory: config, project: false, content: "{}" } })
  const events = xccode.events.subscribe()[Symbol.asyncIterator]()
  expect(await events.next()).toMatchObject({ value: { type: "server.connected" }, done: false })
  const pending = events.next()

  await xccode.close()
  const error = await pending.catch((error: unknown) => error)
  expect(error).toMatchObject({ name: "ClientError", reason: "Transport" })
})
