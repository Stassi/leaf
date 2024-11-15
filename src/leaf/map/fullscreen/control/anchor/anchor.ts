import { DomEvent } from 'leaflet'

export type ControlAnchorAttributes = Record<string, string>
export type ControlAnchorOptions = {
  attributes: ControlAnchorAttributes
  element: HTMLElement
}

type ControlAnchorOnClickHandler = (event: Event) => Promise<void>
export type ControlAnchorOnClick = (
  handler: ControlAnchorOnClickHandler,
) => void
export type ControlAnchorAssign = (
  props: ControlAnchorAttributes,
) => HTMLElement
export type ControlAnchor = {
  assign: ControlAnchorAssign
  onClick: ControlAnchorOnClick
}

const domEventOn = <
  (
    el: HTMLElement,
    types: string,
    fn: ControlAnchorOnClickHandler,
  ) => typeof DomEvent
>DomEvent.on

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
    onClick(handler: ControlAnchorOnClickHandler): void {
      domEventOn(element, 'click', handler)
    },
  }
}
