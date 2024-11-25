import { DomUtil } from 'leaflet'

import { type ControlAnchorAssign } from './control/anchor/anchor'
import {
  type ControlAnchorTitleStates,
  updateControlAnchorTitle,
} from './control/anchor/update-title'

import {
  type Map,
  type Toggleable,
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
      state: Toggleable
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
      state: { state: getFullscreenState, toggle: toggleFullscreenState },
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
        ;(getFullscreenState() ? DomUtil.removeClass : DomUtil.addClass)(
          map.getContainer(),
          fullscreenMapClassName,
        )

        map.invalidateSize()
        toggleFullscreenState()
        updateControlAnchorTitle({
          map: {
            control: {
              anchor: { assign: anchorAssign, titleStates: anchorTitleStates },
            },
            fullscreen: { state: { get: getFullscreenState } },
          },
        })
      },
    })
  }
}
