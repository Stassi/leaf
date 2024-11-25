import { type ControlAnchorOnClick } from './anchor/anchor'
import { type RefreshableControlAnchorTitle } from './anchor/refreshable-title'

import {
  type ControlOnAdd,
  type Map,
  type ToggleableState,
  preventEventDefault,
  stopEventPropagation,
} from '@stassi/leaf'

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
      stopEventPropagation(event)
      preventEventDefault(event)

      await (fullscreenMapEnabled()
        ? document.exitFullscreen()
        : map.getContainer().requestFullscreen())
    })

    return containerElement
  }
}
