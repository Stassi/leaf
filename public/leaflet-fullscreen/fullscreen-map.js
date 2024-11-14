import {
  control as leafletControl,
  DomEvent,
  DomUtil,
  map as leafletMap,
} from '../leaflet/leaflet-src.esm.js'

import { joinClassNames } from './join-class-names.js'
import { setControlTitle } from './set-control-title.js'
import { useBoolean } from './use-boolean.js'
import { useLink } from './use-link.js'

export function fullscreenMap({
  fullscreenOptions: {
    classNames: {
      container: containerClassNames,
      link: linkClassNames,
      mapFullscreen: mapFullscreenClassName,
    },
    control: { position, title },
  } = {
    classNames: {
      container: [
        'leaflet-bar',
        'leaflet-control',
        'leaflet-control-fullscreen',
      ],
      link: ['leaflet-bar-part', 'leaflet-control-fullscreen-button'],
      mapFullscreen: 'leaflet-fullscreen-on',
    },
    control: {
      position: 'topleft',
      title: {
        false: 'View Fullscreen',
        true: 'Exit Fullscreen',
      },
    },
  },
  id,
  ...mapOptions
}) {
  const { get: getFullscreenState, toggle: toggleFullscreenState } =
      useBoolean(false),
    container = DomUtil.create('div', joinClassNames(containerClassNames)),
    { assign: linkAssign, onClick: onLinkClick } = useLink(
      DomUtil.create('a', joinClassNames(linkClassNames), container),
    ),
    control = leafletControl({ position }),
    map = leafletMap(id, mapOptions)

  function mapLifecycleListener(documentFirstReady) {
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

  linkAssign({ href: '#' })

  control.onAdd = function onControlAdd(addedMap) {
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
        : addedMap.getContainer()?.requestFullscreen())
    })

    return container
  }

  control.addTo(map)

  map.whenReady(mapLifecycleListener(true))
  map.on('unload', mapLifecycleListener(false))

  return map
}
