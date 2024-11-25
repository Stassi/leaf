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
    fullscreen: { enabled: ToggleableState }
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
    fullscreen: { enabled: fullscreenMapEnabled },
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
          enabled: fullscreenMapEnabled,
        },
      },
    })

    anchorOnClick(async function handleAnchorClick(
      event: Event,
    ): Promise<void> {
      DomEvent.stopPropagation(event)
      DomEvent.preventDefault(event)

      await (fullscreenMapEnabled()
        ? document.exitFullscreen()
        : map.getContainer().requestFullscreen())
    })

    return containerElement
  }
}
