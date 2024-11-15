import { DomEvent, type Map } from 'leaflet'

import { type UseAnchor } from '../state/use-anchor'

import {
  setControlAnchorTitle,
  type SetControlAnchorTitleOptions,
} from './set-control-anchor-title'

export type ControlAddedListenerOptions = {
  anchorAssign: UseAnchor['assign']
  anchorOnClick: UseAnchor['onClick']
  anchorTitleStates: SetControlAnchorTitleOptions['anchorTitleStates']
  container: HTMLElement
  getFullscreenState: () => boolean
}

export type ControlAddedListener = (map: Map) => HTMLElement

export function controlAddedListener({
  anchorOnClick,
  container,
  getFullscreenState,
  ...titleOptions
}: ControlAddedListenerOptions): ControlAddedListener {
  return function handleControlAdded(map: Map): HTMLElement {
    setControlAnchorTitle({
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
