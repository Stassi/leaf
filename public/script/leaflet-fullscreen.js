import {
  control as leafletControl,
  DomEvent,
  DomUtil,
  map as leafletMap,
} from '../leaflet/leaflet-src.esm.js'

function joinClasses(classes) {
  return classes.join(' ')
}

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

const fullscreenChangeEvent = 'fullscreenchange'

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
      joinClasses([
        'leaflet-bar',
        'leaflet-control',
        'leaflet-control-fullscreen',
      ]),
    )

    const { assign: linkAssign, onClick: onLinkClick } = useLink(
      DomUtil.create(
        'a',
        joinClasses(['leaflet-bar-part', 'leaflet-control-fullscreen-button']),
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
    addedMap.on(fullscreenChangeEvent, updateTitle)

    return container
  }

  control.addTo(map)

  function handleFullscreenChange() {
    ;(getFullscreen() ? DomUtil.removeClass : DomUtil.addClass)(
      map.getContainer(),
      'leaflet-fullscreen-on',
    )

    toggleFullscreen()

    map.invalidateSize()
    map.fire(fullscreenChangeEvent)
  }

  map.whenReady(function readyHandler() {
    DomEvent.on(document, fullscreenChangeEvent, handleFullscreenChange)
  })

  map.on('unload', function unloadHandler() {
    DomEvent.off(document, fullscreenChangeEvent, handleFullscreenChange)
  })

  return map
}
