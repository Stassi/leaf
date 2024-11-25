import { DomUtil } from 'leaflet'

import { type ControlAnchorAssign } from './control/anchor/anchor'
import {
  type ControlAnchorTitleStates,
  updateControlAnchorTitle,
} from './control/anchor/update-title'

import {
  type Map,
  type ToggleableState,
  type ToggleableToggle,
  domEventOff,
  domEventOn,
} from '@stassi/leaf'

export type FullscreenMapLifecycleEvent = 'ready' | 'unload'
export type FullscreenMapLifecycleListenerOptions = {
  map: {
    control: {
      anchor: {
        assign: ControlAnchorAssign
        titleStates: ControlAnchorTitleStates
      }
    }
    fullscreen: {
      className: string
      enabled: ToggleableState
      toggle: ToggleableToggle
    }
    lifecycleEvent: FullscreenMapLifecycleEvent
    map: Map
  }
}

export type FullscreenMapLifecycleListener = () => void

export function fullscreenMapLifecycleListener({
  map: {
    control: {
      anchor: { assign: anchorAssign, titleStates: anchorTitleStates },
    },
    fullscreen: {
      className: fullscreenMapClassName,
      enabled: fullscreenMapEnabled,
      toggle: toggleFullscreenMap,
    },
    lifecycleEvent: mapLifecycleEvent,
    map,
  },
}: FullscreenMapLifecycleListenerOptions): FullscreenMapLifecycleListener {
  return function handleFullscreenMapLifecycleEvent(): void {
    ;(mapLifecycleEvent === 'ready' ? domEventOn : domEventOff)({
      element: document,
      event: 'fullscreenchange',
      handler: function handleFullscreenMapChange(): void {
        ;(fullscreenMapEnabled() ? DomUtil.removeClass : DomUtil.addClass)(
          map.getContainer(),
          fullscreenMapClassName,
        )

        map.invalidateSize()
        toggleFullscreenMap()
        updateControlAnchorTitle({
          map: {
            control: {
              anchor: { assign: anchorAssign, titleStates: anchorTitleStates },
            },
            fullscreen: { enabled: fullscreenMapEnabled },
          },
        })
      },
    })
  }
}
