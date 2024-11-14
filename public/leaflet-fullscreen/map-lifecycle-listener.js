import { DomEvent, DomUtil } from '../leaflet/leaflet-src.esm.js'

import { setControlTitle } from './control/set-control-title.js'

export function mapLifecycleListener({
  documentFirstReady,
  getFullscreenState,
  linkAssign,
  map,
  mapFullscreenClassName,
  title,
  toggleFullscreenState,
}) {
  return function handleFullscreenMapLifecycleEvent() {
    DomEvent[documentFirstReady ? 'on' : 'off'](
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
