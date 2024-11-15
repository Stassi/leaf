import { DomEvent } from 'leaflet'

export type AnchorAttributes = Record<string, string>
export type UseAnchorOptions = {
  attributes: AnchorAttributes
  element: HTMLElement
}

export type AnchorAssign = (props: AnchorAttributes) => HTMLElement
export type AnchorOnClick = (handler: (event: Event) => Promise<void>) => void
export type UseAnchor = {
  assign: AnchorAssign
  onClick: AnchorOnClick
}

const domEventOn = <
  (
    el: HTMLElement,
    types: string,
    fn: (event: Event) => Promise<void>,
  ) => typeof DomEvent
>DomEvent.on

export function useAnchor({
  attributes,
  element,
}: UseAnchorOptions): UseAnchor {
  function assign(anchorAttributes: AnchorAttributes): HTMLElement {
    return Object.assign(element, anchorAttributes)
  }

  assign(attributes)

  return {
    assign,
    onClick(handler: (event: Event) => Promise<void>): void {
      domEventOn(element, 'click', handler)
    },
  }
}
