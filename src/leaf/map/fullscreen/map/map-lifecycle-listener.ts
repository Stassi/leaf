import { DomEvent, DomUtil, type Map } from 'leaflet'

import { setControlTitle } from '../control/set-control-title'
import { type UseLink } from '../state/use-link'

export type MapLifecycleListenerOptions = {
  documentFirstReady: boolean
  getFullscreenState: () => boolean
  linkAssign: UseLink['assign']
  map: Map
  mapFullscreenClassName: string
  title: Record<string, string>
  toggleFullscreenState: () => void
}

export function mapLifecycleListener({
  documentFirstReady,
  getFullscreenState,
  linkAssign,
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
          fullscreen: getFullscreenState(),
          linkAssign,
          title,
        })
      },
    )
  }
}
