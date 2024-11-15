import { DomEvent, type Map } from 'leaflet'

import { type UseLink } from '../state/use-link'

import { setControlTitle } from './set-control-title'

export type ControlAddedListenerOptions = {
  container: HTMLElement
  getFullscreenState: () => boolean
  linkAssign: UseLink['assign']
  onLinkClick: UseLink['onClick']
  title: Record<'true' | 'false', string>
}

export type ControlAddedListener = (map: Map) => HTMLElement

export function controlAddedListener({
  container,
  getFullscreenState,
  onLinkClick,
  ...titleOptions
}: ControlAddedListenerOptions): ControlAddedListener {
  return function handleControlAdded(map: Map): HTMLElement {
    setControlTitle({
      fullscreen: getFullscreenState(),
      ...titleOptions,
    })

    onLinkClick(async function handleLinkClick(e: Event): Promise<void> {
      DomEvent.stopPropagation(e)
      DomEvent.preventDefault(e)

      await (getFullscreenState()
        ? document.exitFullscreen()
        : map.getContainer().requestFullscreen())
    })

    return container
  }
}
