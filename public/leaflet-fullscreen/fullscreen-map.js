import {
  control as leafletControl,
  DomEvent,
  DomUtil,
  map as leafletMap,
} from '../leaflet/leaflet-src.esm.js'

import { joinClassNames } from './join-class-names.js'

function useBoolean(initialValue) {
  let state = initialValue
  return {
    get() {
      return state
    },
    toggle() {
      state = !state
    },
  }
}

function useLink(element) {
  return {
    assign(props) {
      Object.assign(element, props)
    },
    onClick(handler) {
      DomEvent.on(element, 'click', handler)
    },
  }
}

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
  const { get: getFullscreen, toggle: toggleFullscreen } = useBoolean(false),
    container = DomUtil.create('div', joinClassNames(containerClassNames)),
    { assign: linkAssign, onClick: onLinkClick } = useLink(
      DomUtil.create('a', joinClassNames(linkClassNames), container),
    ),
    control = leafletControl({ position }),
    map = leafletMap(id, mapOptions)

  function updateTitle() {
    linkAssign({ title: title[getFullscreen()] })
  }

  function mapLifecycleListener(documentFirstReady) {
    return function onMapLifecycleEvent() {
      DomEvent[documentFirstReady ? 'on' : 'off'](
        document,
        'fullscreenchange',
        function handleFullscreenChange() {
          ;(getFullscreen() ? DomUtil.removeClass : DomUtil.addClass)(
            map.getContainer(),
            mapFullscreenClassName,
          )

          toggleFullscreen()
          updateTitle()
          map.invalidateSize()
        },
      )
    }
  }

  linkAssign({ href: '#' })

  control.onAdd = function onControlAdd(addedMap) {
    updateTitle()

    onLinkClick(async function handleLinkClick(e) {
      DomEvent.stopPropagation(e)
      DomEvent.preventDefault(e)

      await (getFullscreen()
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
