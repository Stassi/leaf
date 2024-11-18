import { type EventHandler, domEventOn } from '../../../../../dom/event'

export type ControlAnchorAttributes = Record<string, string>
export type ControlAnchorOptions = {
  attributes: ControlAnchorAttributes
  element: HTMLElement
}

export type ControlAnchorAssign = (
  props: ControlAnchorAttributes,
) => HTMLElement

type EventHandlerAsync = EventHandler<true>
export type ControlAnchor = {
  assign: ControlAnchorAssign
  onClick: (handler: EventHandlerAsync) => void
}

export function controlAnchor({
  attributes,
  element,
}: ControlAnchorOptions): ControlAnchor {
  function assign(anchorAttributes: ControlAnchorAttributes): HTMLElement {
    return Object.assign(element, anchorAttributes)
  }

  assign(attributes)

  return {
    assign,
    onClick(handler: EventHandlerAsync): void {
      domEventOn({ element, event: 'click', handler })
    },
  }
}
