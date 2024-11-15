import { type Map, DomEvent, DomUtil } from 'leaflet'

import { type UseBoolean } from '../state/use-boolean'
import { type ControlAnchorAssign } from '../control/anchor/anchor'
import {
  type ControlAnchorTitleStates,
  updateControlAnchorTitle,
} from '../control/anchor/update-title'

export type FullscreenMapLifecycleEvent = 'ready' | 'unload'
export type FullscreenMapLifecycleListenerOptions = {
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
      lifecycleEvent: FullscreenMapLifecycleEvent
      map: Map
    }
  }
}

export type FullscreenMapLifecycleListener = () => void

export function fullscreenMapLifecycleListener({
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
          anchor: { assign: anchorAssign, titleStates: anchorTitleStates },
          fullscreen: { state: { get: getFullscreenState } },
        })
      },
    )
  }
}
