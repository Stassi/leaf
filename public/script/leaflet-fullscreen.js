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

function useLink(initialValue) {
  const state = initialValue
  return {
    assign(props) {
      Object.assign(state, props)
    },
    onClick(handler) {
      DomEvent.on(state, 'click', handler)
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

function createFullscreenControl(
  { position, title, ...optionsProps } = {},
  getFullscreen,
  setFullscreen,
) {
  const fullscreenControl = control({ position })

  fullscreenControl.onAdd = function onAdd(map) {
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
      toggleFullscreen(map, optionsProps, getFullscreen, setFullscreen)
    })

    linkAssign({ href: '#' })

    function updateTitle() {
      linkAssign({ title: title[getFullscreen()] })
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

function toggleFullscreen(
  map,
  { pseudoFullscreen } = {},
  getFullscreen,
  setFullscreen,
) {
  const container = map.getContainer()

  if (getFullscreen()) {
    if (pseudoFullscreen)
      disablePseudoFullscreen(map, getFullscreen, setFullscreen)
    else if (document.exitFullscreen) document.exitFullscreen()
    else disablePseudoFullscreen(map, getFullscreen, setFullscreen)
  } else if (pseudoFullscreen)
    enablePseudoFullscreen(map, getFullscreen, setFullscreen)
  else if (container.requestFullscreen) container.requestFullscreen()
  else enablePseudoFullscreen(map, getFullscreen, setFullscreen)
}

export function fullscreenMap({
  fullscreenControlOptions = {
    position: 'topleft',
    title: {
      false: 'View Fullscreen',
      true: 'Exit Fullscreen',
    },
  },
  id,
  ...mapOptions
}) {
  const { get: getFullscreen, set: setFullscreen } = useBoolean(),
    map = leafletMap(id, mapOptions)

  createFullscreenControl(
    fullscreenControlOptions,
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
