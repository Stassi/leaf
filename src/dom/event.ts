import { DomEvent } from 'leaflet'

export type EventHandler<Async extends boolean> = Async extends true
  ? (event: Event) => void | Promise<void>
  : (event: Event) => void
type EventHandlerSync = EventHandler<false>
export type EventHandlerAsync = EventHandler<true>
type EventHandlersSync = Record<string, EventHandlerSync>
type EventHandlersAsync = Record<string, EventHandlerAsync>

type DomEventSwitchOptionsBase = {
  element: HTMLElement
} & Partial<{
  context: unknown
}>

export type DomEventSwitchOptionsUsesHandler =
  | (DomEventSwitchOptionsBase & {
      event: string
      handler: EventHandlerAsync
    })
  | (DomEventSwitchOptionsBase & {
      handlers: EventHandlersAsync
    })

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
    const { element, context } = options

    if ('event' in options && 'handler' in options) {
      const { handler, event } = options
      return DomEvent[switchable](
        element,
        event,
        <EventHandlerSync>handler,
        context,
      )
    } else if ('handlers' in options) {
      const { handlers } = options
      return DomEvent[switchable](element, <EventHandlersSync>handlers, context)
    } else if (switchable === 'off') return DomEvent.off(element)

    throw new TypeError(`Invalid DomEvent.${switchable} options.`)
  }
}

export const domEventOn: DomEventSwitch<'on'> = domEventSwitch('on')
export const domEventOff: DomEventSwitch<'off'> = domEventSwitch('off')
