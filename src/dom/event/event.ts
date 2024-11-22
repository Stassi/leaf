import { DomEvent } from 'leaflet'

export type EventHandler<Async extends boolean> = Async extends true
  ? (event: Event) => void | Promise<void>
  : (event: Event) => void
type EventHandlerSync = EventHandler<false>
export type EventHandlerAsync = EventHandler<true>
type EventHandlersSync = Record<string, EventHandlerSync>
type EventHandlersAsync = Record<string, EventHandlerAsync>

type DomEventSwitchOptionsBase = {
  element: Document | HTMLElement
} & Partial<{
  context: unknown
}>

type DomEventSwitchOptionsHandlerSingle = {
  event: string
  handler: EventHandlerAsync
}

type DomEventSwitchOptionsHandlerMultiple = {
  handlers: EventHandlersAsync
}

export type DomEventSwitchOptionsUsesHandler = DomEventSwitchOptionsBase &
  (DomEventSwitchOptionsHandlerSingle | DomEventSwitchOptionsHandlerMultiple)

type SwitchableStates = 'on' | 'off'
export type DomEventSwitchOptions<Switchable extends SwitchableStates> =
  Switchable extends 'on'
    ? DomEventSwitchOptionsUsesHandler
    : DomEventSwitchOptionsUsesHandler | DomEventSwitchOptionsBase

export type LeafletDomEvent = typeof DomEvent

type DomEventSwitch<Switchable extends SwitchableStates> = (
  options: DomEventSwitchOptions<Switchable>,
) => LeafletDomEvent

function domEventSwitch<Switchable extends SwitchableStates>(
  switchable: Switchable,
): (options: DomEventSwitchOptions<Switchable>) => LeafletDomEvent {
  return function eventSwitch(
    options: DomEventSwitchOptions<Switchable>,
  ): LeafletDomEvent {
    const { element, context } = <
      DomEventSwitchOptions<Switchable> & { element: HTMLElement }
    >options

    if ('event' in options && 'handler' in options) {
      const { handler, event }: DomEventSwitchOptionsHandlerSingle = options
      return DomEvent[switchable](
        element,
        event,
        <EventHandlerSync>handler,
        context,
      )
    } else if ('handlers' in options) {
      const { handlers }: DomEventSwitchOptionsHandlerMultiple = options
      return DomEvent[switchable](element, <EventHandlersSync>handlers, context)
    } else if (switchable === 'off') return DomEvent.off(element)

    throw new TypeError(`Invalid DomEvent.${switchable} options.`)
  }
}

export const domEventOn: DomEventSwitch<'on'> = domEventSwitch('on')
export const domEventOff: DomEventSwitch<'off'> = domEventSwitch('off')
