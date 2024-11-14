import {
  control as leafletControl,
  DomUtil,
  map as leafletMap,
} from '../leaflet/leaflet-src.esm.js'

import { controlAddedListener } from './control/control-added-listener.js'
import { joinClassNames } from './join-class-names.js'
import { mapLifecycleListener } from './map-lifecycle-listener.js'
import { useBoolean } from './state/use-boolean.js'
import { useLink } from './state/use-link.js'

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
    { assign: linkAssign, onClick: onLinkClick } = useLink({
      element: DomUtil.create('a', joinClassNames(linkClassNames), container),
      initialProps: { href: '#' },
    }),
    control = leafletControl({ position }),
    map = leafletMap(id, mapOptions),
    handleMapLifecycleChange = (documentFirstReady) =>
      mapLifecycleListener({
        documentFirstReady,
        getFullscreenState,
        linkAssign,
        map,
        mapFullscreenClassName,
        title,
        toggleFullscreenState,
      })

  control.onAdd = controlAddedListener({
    container,
    getFullscreenState,
    linkAssign,
    onLinkClick,
    title,
  })
  control.addTo(map)

  map.whenReady(handleMapLifecycleChange(true))
  map.on('unload', handleMapLifecycleChange(false))

  return map
}
