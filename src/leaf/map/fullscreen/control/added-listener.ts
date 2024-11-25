import { DomEvent, type Map } from 'leaflet'

import { type ControlAnchor } from './anchor/anchor'
import {
  type UpdateControlAnchorTitleAnchorOptions,
  updateControlAnchorTitle,
} from './anchor/update-title'

import { type ControlOnAdd, type ToggleableState } from '@stassi/leaf'

export type ControlAddedListenerOptions = {
  map: {
    control: {
      anchor: ControlAnchor & UpdateControlAnchorTitleAnchorOptions
      container: { element: HTMLElement }
    }
    fullscreen: { state: { get: ToggleableState } }
  }
}

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
}: ControlAddedListenerOptions): ControlOnAdd {
  return function handleControlAdded(map: Map): HTMLElement {
    updateControlAnchorTitle({
      map: {
        control: {
          anchor: {
            assign: anchorAssign,
            titleStates: anchorTitleStates,
          },
        },
        fullscreen: {
          state: { get: getFullscreenState },
        },
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
