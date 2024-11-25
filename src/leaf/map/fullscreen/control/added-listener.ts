import { DomEvent, type Map } from 'leaflet'

import { type ControlAnchorOnClick } from './anchor/anchor'
import { type RefreshableControlAnchorTitle } from './anchor/refreshable-title'

import { type ControlOnAdd, type ToggleableState } from '@stassi/leaf'

export type ControlAddedListenerOptions = {
  map: {
    control: {
      anchor: {
        onClick: ControlAnchorOnClick
        refreshTitle: RefreshableControlAnchorTitle
      }
      container: { element: HTMLElement }
    }
    fullscreen: { enabled: ToggleableState }
  }
}

export function controlAddedListener({
  map: {
    control: {
      anchor: {
        onClick: anchorOnClick,
        refreshTitle: refreshControlAnchorTitle,
      },
      container: { element: containerElement },
    },
    fullscreen: { enabled: fullscreenMapEnabled },
  },
}: ControlAddedListenerOptions): ControlOnAdd {
  return function handleControlAdded(map: Map): HTMLElement {
    refreshControlAnchorTitle()

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
