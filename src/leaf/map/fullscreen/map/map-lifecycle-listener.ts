import { DomEvent, DomUtil, type Map } from 'leaflet'

import { type ControlAnchorAssign } from '../control/anchor/anchor'
import { type UseBoolean } from '../state/use-boolean'
import {
  setControlAnchorTitle,
  type ControlAnchorTitleStates,
} from '../control/set-control-anchor-title'

export type LeafletMapLifecycleEvent = 'ready' | 'unload'
export type MapLifecycleListenerOptions = {
  document: {
    map: {
      control: {
        anchor: {
          assign: ControlAnchorAssign
          titleStates: ControlAnchorTitleStates
        }
      }
      fullscreen: {
        classNames: string
        state: UseBoolean
      }
      lifecycleEvent: LeafletMapLifecycleEvent
      map: Map
    }
  }
}

export function mapLifecycleListener({
  document: {
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
  },
}: MapLifecycleListenerOptions) {
  return function handleFullscreenMapLifecycleEvent() {
    DomEvent[mapLifecycleEvent === 'ready' ? 'on' : 'off'](
      // @ts-expect-error -- `Document` type is assignable to first DomEvent.on argument
      document,
      'fullscreenchange',
      function handleFullscreenMapChange() {
        ;(getFullscreenState() ? DomUtil.removeClass : DomUtil.addClass)(
          map.getContainer(),
          fullscreenMapClassNames,
        )

        map.invalidateSize()
        toggleFullscreenState()
        setControlAnchorTitle({
          anchor: { assign: anchorAssign, titleStates: anchorTitleStates },
          fullscreen: { state: { get: getFullscreenState } },
        })
      },
    )
  }
}
