import {
  control as leafletControl,
  DomEvent,
  DomUtil,
  map as leafletMap,
} from '../leaflet/leaflet-src.esm.js'

function useBoolean(initialValue = false) {
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

function getFullscreenChangeEventName() {
  if ('onfullscreenchange' in document) return 'fullscreenchange'
  else if ('onmozfullscreenchange' in document) return 'mozfullscreenchange'
  else if ('onwebkitfullscreenchange' in document)
    return 'webkitfullscreenchange'
  else if ('onmsfullscreenchange' in document) return 'MSFullscreenChange'
  return null
}

export function fullscreenMap({
  fullscreenControlOptions: { position, title } = {
    position: 'topleft',
    title: {
      false: 'View Fullscreen',
      true: 'Exit Fullscreen',
    },
  },
  id,
  ...mapOptions
}) {
  const { get: getFullscreen, toggle: toggleFullscreen } = useBoolean(),
    control = leafletControl({ position }),
    map = leafletMap(id, mapOptions)

  control.onAdd = function onControlAdd(addedMap) {
    const container = DomUtil.create(
      'div',
      'leaflet-control-fullscreen leaflet-bar leaflet-control',
    )

    const { assign: linkAssign, onClick: onLinkClick } = useLink(
      DomUtil.create(
        'a',
        'leaflet-control-fullscreen-button leaflet-bar-part',
        container,
      ),
    )

    onLinkClick(function handleLinkClick(e) {
      DomEvent.stopPropagation(e)
      DomEvent.preventDefault(e)

      const addedMapContainer = addedMap.getContainer()

      if (getFullscreen()) {
        if (document.exitFullscreen) document.exitFullscreen()
      } else if (addedMapContainer.requestFullscreen)
        addedMapContainer.requestFullscreen()
    })

    linkAssign({ href: '#' })

    function updateTitle() {
      linkAssign({ title: title[getFullscreen()] })
    }

    updateTitle()
    addedMap.on('fullscreenchange', updateTitle)

    return container
  }

  control.addTo(map)

  const fullscreenChangeEvent = getFullscreenChangeEventName()

  function handleFullscreenChange() {
    const container = map.getContainer(),
      fullscreen = getFullscreen()

    if (
      container ===
      (document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement)
    ) {
      if (!fullscreen) {
        toggleFullscreen()

        DomUtil.addClass(container, 'leaflet-fullscreen-on')

        map.invalidateSize()
        map.fire('fullscreenchange')
      }
    } else if (fullscreen) {
      toggleFullscreen()

      DomUtil.removeClass(container, 'leaflet-fullscreen-on')

      map.invalidateSize()
      map.fire('fullscreenchange')
    }
  }

  if (fullscreenChangeEvent) {
    map.whenReady(function readyHandler() {
      DomEvent.on(document, fullscreenChangeEvent, handleFullscreenChange)
    })

    map.on('unload', function unloadHandler() {
      DomEvent.off(document, fullscreenChangeEvent, handleFullscreenChange)
    })
  }

  return map
}
