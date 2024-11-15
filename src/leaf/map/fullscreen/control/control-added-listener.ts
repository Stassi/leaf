import { DomEvent, type Map } from 'leaflet'

import { type UseAnchor } from '../state/use-anchor'

import {
  setControlAnchorTitle,
  type SetControlAnchorTitleOptions,
} from './set-control-anchor-title'

export type ControlAddedListenerOptions = {
  map: {
    control: {
      anchor: {
        assign: UseAnchor['assign']
        onClick: UseAnchor['onClick']
        titleStates: SetControlAnchorTitleOptions['anchor']['titleStates']
      }
      container: { element: HTMLElement }
    }
    fullscreen: { state: { get: () => boolean } }
  }
}

export type ControlAddedListener = (map: Map) => HTMLElement

export function controlAddedListener({
  map: {
    control: {
      anchor: {
        assign: anchorAssign,
        onClick: anchorOnClick,
        titleStates: anchorTitleStates,
      },
      container: { element: containerElement },
    },
    fullscreen: {
      state: { get: getFullscreenState },
    },
  },
}: ControlAddedListenerOptions): ControlAddedListener {
  return function handleControlAdded(map: Map): HTMLElement {
    setControlAnchorTitle({
      anchor: {
        assign: anchorAssign,
        titleStates: anchorTitleStates,
      },
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
