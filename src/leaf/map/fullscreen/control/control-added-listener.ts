import { DomEvent, type Map } from 'leaflet'

import { type UseAnchor } from '../state/use-anchor'

import {
  setControlAnchorTitle,
  type SetControlAnchorTitleOptions,
} from './set-control-anchor-title'

export type ControlAddedListenerOptions = {
  control: {
    anchor: {
      assign: UseAnchor['assign']
      onClick: UseAnchor['onClick']
      titleStates: SetControlAnchorTitleOptions['anchorTitleStates']
    }
    container: { element: HTMLElement }
  }
  map: { fullscreen: { state: { get: () => boolean } } }
}

export type ControlAddedListener = (map: Map) => HTMLElement

export function controlAddedListener({
  control: {
    anchor: {
      assign: anchorAssign,
      onClick: anchorOnClick,
      titleStates: anchorTitleStates,
    },
    container: { element: containerElement },
  },
  map: {
    fullscreen: {
      state: { get: getFullscreenState },
    },
  },
}: ControlAddedListenerOptions): ControlAddedListener {
  return function handleControlAdded(map: Map): HTMLElement {
    setControlAnchorTitle({
      anchorAssign,
      anchorTitleStates,
      fullscreen: getFullscreenState(),
    })

    anchorOnClick(async function handleAnchorClick(e: Event): Promise<void> {
      DomEvent.stopPropagation(e)
      DomEvent.preventDefault(e)

      await (getFullscreenState()
        ? document.exitFullscreen()
        : map.getContainer().requestFullscreen())
    })

    return containerElement
  }
}
