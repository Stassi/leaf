import { DomEvent, type Map } from 'leaflet'

import { type UseBooleanGet } from '../state/use-boolean'

import { type ControlAnchor } from './anchor/anchor'
import {
  type AnchorAssignTitleOptions,
  setControlAnchorTitle,
} from './set-control-anchor-title'

export type ControlAddedListenerOptions = {
  map: {
    control: {
      anchor: AnchorAssignTitleOptions & ControlAnchor
      container: { element: HTMLElement }
    }
    fullscreen: { state: { get: UseBooleanGet } }
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
      fullscreen: {
        state: { get: getFullscreenState },
      },
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
