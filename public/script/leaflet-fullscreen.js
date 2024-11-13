import {
  control as leafletControl,
  DomEvent,
  DomUtil,
  map as leafletMap,
} from '../leaflet/leaflet-src.esm.js'

function joinClassNames(classNames) {
  return classNames.join(' ')
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
    map = leafletMap(id, mapOptions),
    container = DomUtil.create(
      'div',
      joinClassNames([
        'leaflet-bar',
        'leaflet-control',
        'leaflet-control-fullscreen',
      ]),
    ),
    { assign: linkAssign, onClick: onLinkClick } = useLink(
      DomUtil.create(
        'a',
        joinClassNames([
          'leaflet-bar-part',
          'leaflet-control-fullscreen-button',
        ]),
        container,
      ),
    )

  linkAssign({ href: '#' })

  function updateTitle() {
    linkAssign({ title: title[getFullscreen()] })
  }

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

  function mapLifecycleListener(documentFirstReady) {
    return function onMapLifecycleEvent() {
      DomEvent[documentFirstReady ? 'on' : 'off'](
        document,
        fullscreenChangeEvent,
        function handleFullscreenChange() {
          ;(getFullscreen() ? DomUtil.removeClass : DomUtil.addClass)(
            map.getContainer(),
            'leaflet-fullscreen-on',
          )

          toggleFullscreen()
          updateTitle()
          map.invalidateSize()
        },
      )
    }
  }

  map.whenReady(mapLifecycleListener(true))
  map.on('unload', mapLifecycleListener(false))

  return map
}
