import { DomEvent, type Map } from 'leaflet'

import { type UseAnchor } from '../state/use-anchor'

import { setControlTitle } from './set-control-title'

export type ControlAddedListenerOptions = {
  container: HTMLElement
  getFullscreenState: () => boolean
  anchorAssign: UseAnchor['assign']
  anchorOnClick: UseAnchor['onClick']
  title: Record<'true' | 'false', string>
}

export type ControlAddedListener = (map: Map) => HTMLElement

export function controlAddedListener({
  anchorOnClick,
  container,
  getFullscreenState,
  ...titleOptions
}: ControlAddedListenerOptions): ControlAddedListener {
  return function handleControlAdded(map: Map): HTMLElement {
    setControlTitle({
      fullscreen: getFullscreenState(),
      ...titleOptions,
    })

    anchorOnClick(async function handleAnchorClick(e: Event): Promise<void> {
      DomEvent.stopPropagation(e)
      DomEvent.preventDefault(e)

      await (getFullscreenState()
        ? document.exitFullscreen()
        : map.getContainer().requestFullscreen())
    })

    return container
  }
}
