import type { XccodeEvent } from "@xccode/client"
import type { SelectedEvent, SubscribeOptions } from "@xccode/client/promise/api"

type EventType = Exclude<XccodeEvent["type"], "server.connected">

export interface EventDomain {
  readonly subscribe: <Type extends EventType = EventType>(
    options?: SubscribeOptions<Type>,
  ) => AsyncIterable<SelectedEvent<XccodeEvent, Type>>
}
