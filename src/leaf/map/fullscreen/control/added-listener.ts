import { DomEvent, type Map } from 'leaflet'

import { type UseBooleanGet } from '../state/use-boolean'

import { type ControlAnchor } from './anchor/anchor'
import {
  type UpdateControlAnchorTitleAnchorOptions,
  updateControlAnchorTitle,
} from './anchor/update-title'

export type ControlAddedListenerOptions = {
  map: {
    control: {
      anchor: UpdateControlAnchorTitleAnchorOptions & ControlAnchor
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
    updateControlAnchorTitle({
      anchor: {
        assign: anchorAssign,
        titleStates: anchorTitleStates,
      },
      fullscreen: {
        state: { get: getFullscreenState },
      },
    })

    anchorOnClick(async function handleAnchorClick(
      event: Event,
    ): Promise<void> {
      DomEvent.stopPropagation(event)
      DomEvent.preventDefault(event)

      await (getFullscreenState()
        ? document.exitFullscreen()
        : map.getContainer().requestFullscreen())
    })

    return containerElement
  }
}
