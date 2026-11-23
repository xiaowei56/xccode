import type { XiaochuanEvent } from "@xiaochuan/client"
import { useClient } from "./client"

type EventMetadata = {
  directory: string | undefined
}
type XiaochuanEventMap = { [Type in XiaochuanEvent["type"]]: Extract<XiaochuanEvent, { type: Type }> }

export function useEvent() {
  const client = useClient()

  function subscribe(handler: (event: XiaochuanEvent, metadata: EventMetadata) => void) {
    return client.event.listen(({ details }) => {
      if (details.type === "server.connected") return
      handler(details, { directory: details.location?.directory })
    })
  }

  function on<T extends XiaochuanEvent["type"]>(
    type: T,
    handler: (event: XiaochuanEventMap[T], metadata: EventMetadata) => void,
  ) {
    return client.event.on(type, (event) => {
      handler(event, { directory: event.location?.directory })
    })
  }

  return {
    subscribe,
    on,
  }
}
