import { DomEvent, DomUtil } from 'leaflet'

import { type ControlAnchorAssign } from './control/anchor/anchor'
import {
  type ControlAnchorTitleStates,
  updateControlAnchorTitle,
} from './control/anchor/update-title'

import { type Map, type UseSwitch } from '@stassi/leaf'

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
      classNames: string
      state: UseSwitch
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
      classNames: fullscreenMapClassNames,
      state: { get: getFullscreenState, toggle: toggleFullscreenState },
    },
    lifecycleEvent: mapLifecycleEvent,
    map,
  },
}: FullscreenMapLifecycleListenerOptions): FullscreenMapLifecycleListener {
  return function handleFullscreenMapLifecycleEvent(): void {
    DomEvent[mapLifecycleEvent === 'ready' ? 'on' : 'off'](
      // @ts-expect-error -- `Document` type is assignable to first DomEvent.on argument
      document,
      'fullscreenchange',
      function handleFullscreenMapChange(): void {
        ;(getFullscreenState() ? DomUtil.removeClass : DomUtil.addClass)(
          map.getContainer(),
          fullscreenMapClassNames,
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
    )
  }
}
