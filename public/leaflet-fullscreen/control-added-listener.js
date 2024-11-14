import { DomEvent } from '../leaflet/leaflet-src.esm.js'

import { setControlTitle } from './set-control-title.js'

export function controlAddedListener({
  container,
  getFullscreenState,
  linkAssign,
  onLinkClick,
  title,
}) {
  return function handleControlAdded(map) {
    setControlTitle({
      fullscreen: getFullscreenState(),
      linkAssign,
      title,
    })

    onLinkClick(async function handleLinkClick(e) {
      DomEvent.stopPropagation(e)
      DomEvent.preventDefault(e)

      await (getFullscreenState()
        ? document?.exitFullscreen()
        : map.getContainer()?.requestFullscreen())
    })

    return container
  }
}
