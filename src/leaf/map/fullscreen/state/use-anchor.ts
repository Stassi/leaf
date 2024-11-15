import { DomEvent } from 'leaflet'

export type UseAnchorOptions = {
  attributes: Record<string, string>
  element: HTMLElement
}

export type UseAnchor = {
  assign: (props: Record<string, string>) => HTMLElement
  onClick: (handler: (event: Event) => Promise<void>) => void
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
  function assign(anchorAttributes: Record<string, string>): HTMLElement {
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
