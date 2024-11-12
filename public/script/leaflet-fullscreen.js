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

function createFullscreenControl(options = {}) {
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

    link.href = '#'
    link.title = mergedOptions.title[isFullscreen(map)]

    DomEvent.on(link, 'click', function onClick(e) {
      DomEvent.stopPropagation(e)
      DomEvent.preventDefault(e)
      toggleFullscreen(map, mergedOptions)
    })

    return container
  }

  return fullscreenControl
}

function isFullscreen(map) {
  return map._isFullscreen || false
}

function setFullscreen(map, isFullscreen) {
  map._isFullscreen = isFullscreen
  const container = map.getContainer()
  if (isFullscreen) DomUtil.addClass(container, 'leaflet-fullscreen-on')
  else DomUtil.removeClass(container, 'leaflet-fullscreen-on')
  map.invalidateSize()
}

function enablePseudoFullscreen(map) {
  const container = map.getContainer()
  DomUtil.addClass(container, 'leaflet-pseudo-fullscreen')
  setFullscreen(map, true)
  map.fire('fullscreenchange')
}

function disablePseudoFullscreen(map) {
  const container = map.getContainer()
  DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen')
  setFullscreen(map, false)
  map.fire('fullscreenchange')
}

function toggleFullscreen(map, options = {}) {
  const container = map.getContainer()

  if (isFullscreen(map)) {
    if (options.pseudoFullscreen) disablePseudoFullscreen(map)
    else if (document.exitFullscreen) document.exitFullscreen()
    else disablePseudoFullscreen(map)
  } else if (options.pseudoFullscreen) enablePseudoFullscreen(map)
  else if (container.requestFullscreen) container.requestFullscreen()
  else enablePseudoFullscreen(map)
}

function onFullscreenChange(map) {
  const fullscreenElement =
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement

  if (fullscreenElement === map.getContainer()) {
    if (!map._isFullscreen) {
      setFullscreen(map, true)
      map.fire('fullscreenchange')
    }
  } else if (map._isFullscreen) {
    setFullscreen(map, false)
    map.fire('fullscreenchange')
  }
}

export function fullscreenMap(id, options = {}) {
  const map = leafletMap(id, options)

  map._isFullscreen = false

  if (options.fullscreenControl) {
    const fullscreenControl = createFullscreenControl(options.fullscreenControl)
    fullscreenControl.addTo(map)
  }

  const fullscreenChangeEvent = getFullscreenChangeEventName()

  function handleFullscreenChange() {
    return onFullscreenChange(map)
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
