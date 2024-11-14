import { DomEvent } from 'leaflet'

export type UseLinkOptions = {
  element: HTMLAnchorElement
  initialProps: Record<string, string>
}

export type UseLink = {
  onClick: (handler: (event: Event) => Promise<void>) => void
  assign: (props: Record<string, string>) => HTMLAnchorElement
}

const domEventOn = <
  (
    el: HTMLElement,
    types: string,
    fn: (event: Event) => Promise<void>,
  ) => typeof DomEvent
>DomEvent.on

export function useLink({ element, initialProps }: UseLinkOptions): UseLink {
  function assign(props: Record<string, string>): HTMLAnchorElement {
    return Object.assign(element, props)
  }

  assign(initialProps)

  return {
    assign,
    onClick(handler: (event: Event) => Promise<void>): void {
      domEventOn(element, 'click', handler)
    },
  }
}
