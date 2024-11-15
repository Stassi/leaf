import { DomEvent, DomUtil, type Map } from 'leaflet'

import {
  setControlAnchorTitle,
  type SetControlAnchorTitleOptions,
} from '../control/set-control-anchor-title'
import { type UseAnchor } from '../state/use-anchor'

export type MapLifecycleListenerOptions = {
  anchorAssign: UseAnchor['assign']
  anchorTitleStates: SetControlAnchorTitleOptions['anchorTitleStates']
  documentFirstReady: boolean
  fullscreenMapClassName: string
  getFullscreenState: () => boolean
  map: Map
  toggleFullscreenState: () => void
}

export function mapLifecycleListener({
  anchorAssign,
  anchorTitleStates,
  documentFirstReady,
  fullscreenMapClassName,
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
          fullscreenMapClassName,
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
