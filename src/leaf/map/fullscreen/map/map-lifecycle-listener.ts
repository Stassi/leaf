import { DomEvent, DomUtil, type Map } from 'leaflet'

import { setControlTitle } from '../control/set-control-title'
import { type UseAnchor } from '../state/use-anchor'

export type MapLifecycleListenerOptions = {
  anchorAssign: UseAnchor['assign']
  documentFirstReady: boolean
  fullscreenMapClassName: string
  getFullscreenState: () => boolean
  map: Map
  title: Record<string, string>
  toggleFullscreenState: () => void
}

export function mapLifecycleListener({
  anchorAssign,
  documentFirstReady,
  fullscreenMapClassName,
  getFullscreenState,
  map,
  title,
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
        setControlTitle({
          anchorAssign,
          fullscreen: getFullscreenState(),
          title,
        })
      },
    )
  }
}
