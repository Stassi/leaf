import { DomEvent, DomUtil, type Map } from 'leaflet'

import {
  setControlAnchorTitle,
  type SetControlAnchorTitleOptions,
} from '../control/set-control-anchor-title'
import { type UseAnchor } from '../state/use-anchor'

export type MapLifecycleListenerOptions = {
  anchor: {
    assign: UseAnchor['assign']
    titleStates: SetControlAnchorTitleOptions['anchorTitleStates']
  }
  document: {
    firstReady: boolean
  }
  map: {
    fullscreen: {
      classNames: string
      state: {
        get: () => boolean
        toggle: () => void
      }
    }
    map: Map
  }
}

export function mapLifecycleListener({
  anchorAssign,
  anchorTitleStates,
  documentFirstReady,
  fullscreenMapClassNames,
  getFullscreenState,
  map,
  toggleFullscreenState,
}: MapLifecycleListenerOptions) {
  return function handleFullscreenMapLifecycleEvent() {
    DomEvent[documentFirstReady ? 'on' : 'off'](
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
          anchorAssign,
          anchorTitleStates,
          fullscreen: getFullscreenState(),
        })
      },
    )
  }
}
