import type { XiaochuanEvent } from "@xiaochuan/client"
import type { SelectedEvent, SubscribeOptions } from "@xiaochuan/client/promise/api"

type EventType = Exclude<XiaochuanEvent["type"], "server.connected">

export interface EventDomain {
  readonly subscribe: <Type extends EventType = EventType>(
    options?: SubscribeOptions<Type>,
  ) => AsyncIterable<SelectedEvent<XiaochuanEvent, Type>>
}
