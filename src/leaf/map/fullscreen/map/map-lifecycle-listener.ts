import { DomEvent, DomUtil, type Map } from 'leaflet'

import {
  setControlAnchorTitle,
  type SetControlAnchorTitleOptions,
} from '../control/set-control-anchor-title'
import { type UseAnchor } from '../state/use-anchor'

export type MapLifecycleListenerOptions = {
  document: {
    map: {
      control: {
        anchor: {
          assign: UseAnchor['assign']
          titleStates: SetControlAnchorTitleOptions['anchor']['titleStates']
        }
      }
      fullscreen: {
        classNames: string
        state: {
          get: () => boolean
          toggle: () => void
        }
      }
      lifecycleEvent: 'ready' | 'unload'
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
          fullscreen: getFullscreenState(),
        })
      },
    )
  }
}
