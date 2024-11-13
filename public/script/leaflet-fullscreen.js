import {
  control,
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
    set(newState) {
      state = newState
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

function createFullscreenControl(options = {}, getFullscreen, setFullscreen) {
  const mergedOptions = {
    position: 'topleft',
    title: {
      false: 'View Fullscreen',
      true: 'Exit Fullscreen',
    },
    ...options,
  }

  const fullscreenControl = control({ position: mergedOptions.position })

  fullscreenControl.onAdd = function onAdd(map) {
    const container = DomUtil.create(
      'div',
      'leaflet-control-fullscreen leaflet-bar leaflet-control',
    )

    const link = DomUtil.create(
      'a',
      'leaflet-control-fullscreen-button leaflet-bar-part',
      container,
    )

    Object.assign(link, { href: '#' })

    DomEvent.on(link, 'click', function onLinkClick(e) {
      DomEvent.stopPropagation(e)
      DomEvent.preventDefault(e)
      toggleFullscreen(map, mergedOptions, getFullscreen, setFullscreen)
    })

    function updateTitle() {
      Object.assign(link, { title: mergedOptions.title[getFullscreen()] })
    }

    updateTitle()
    map.on('fullscreenchange', updateTitle)

    return container
  }

  return fullscreenControl
}

function setFullscreenState(map, newState, getFullscreen, setFullscreen) {
  setFullscreen(newState)

  const container = map.getContainer()
  if (getFullscreen()) DomUtil.addClass(container, 'leaflet-fullscreen-on')
  else DomUtil.removeClass(container, 'leaflet-fullscreen-on')

  map.invalidateSize()
}

function enablePseudoFullscreen(map, getFullscreen, setFullscreen) {
  const container = map.getContainer()
  DomUtil.addClass(container, 'leaflet-pseudo-fullscreen')
  setFullscreenState(map, true, getFullscreen, setFullscreen)
  map.fire('fullscreenchange')
}

function disablePseudoFullscreen(map, getFullscreen, setFullscreen) {
  const container = map.getContainer()
  DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen')
  setFullscreenState(map, false, getFullscreen, setFullscreen)
  map.fire('fullscreenchange')
}

function toggleFullscreen(map, options = {}, getFullscreen, setFullscreen) {
  const container = map.getContainer()

  if (getFullscreen()) {
    if (options.pseudoFullscreen)
      disablePseudoFullscreen(map, getFullscreen, setFullscreen)
    else if (document.exitFullscreen) document.exitFullscreen()
    else disablePseudoFullscreen(map, getFullscreen, setFullscreen)
  } else if (options.pseudoFullscreen)
    enablePseudoFullscreen(map, getFullscreen, setFullscreen)
  else if (container.requestFullscreen) container.requestFullscreen()
  else enablePseudoFullscreen(map, getFullscreen, setFullscreen)
}

export function fullscreenMap(id, options = {}) {
  const map = leafletMap(id, options)

  const { get: getFullscreen, set: setFullscreen } = useBoolean()

  if (options.fullscreenControl)
    createFullscreenControl(
      options.fullscreenControl,
      getFullscreen,
      setFullscreen,
    ).addTo(map)

  const fullscreenChangeEvent = getFullscreenChangeEventName()

  function handleFullscreenChange() {
    if (
      map.getContainer() ===
      (document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement)
    ) {
      if (!getFullscreen()) {
        setFullscreenState(map, true, getFullscreen, setFullscreen)
        map.fire('fullscreenchange')
      }
    } else if (getFullscreen()) {
      setFullscreenState(map, false, getFullscreen, setFullscreen)
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
