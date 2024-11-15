import { DomEvent, DomUtil, type Map } from 'leaflet'

import { setControlTitle } from '../control/set-control-title'
import { type UseAnchor } from '../state/use-anchor'

export type MapLifecycleListenerOptions = {
  anchorAssign: UseAnchor['assign']
  documentFirstReady: boolean
  getFullscreenState: () => boolean
  map: Map
  mapFullscreenClassName: string
  title: Record<string, string>
  toggleFullscreenState: () => void
}

export function mapLifecycleListener({
  anchorAssign,
  documentFirstReady,
  getFullscreenState,
  map,
  mapFullscreenClassName,
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
          mapFullscreenClassName,
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
