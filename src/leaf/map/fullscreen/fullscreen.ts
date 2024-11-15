import {
  DomUtil,
  control as untypedLeafletControl,
  map as leafletMap,
  type Control,
  type ControlOptions,
  type ControlPosition,
  type Map,
  type MapOptions,
} from 'leaflet'

import { controlAddedListener } from './control/control-added-listener'
import { joinClassNames } from './dom-node-class/join-class-names'
import { mapLifecycleListener } from './map/map-lifecycle-listener'
import { useBoolean } from './state/use-boolean'
import { type UseLink, useLink } from './state/use-link'

const leafletControl = <(options: ControlOptions) => Control>(
  (<unknown>untypedLeafletControl)
)

export type FullscreenMapOptions = MapOptions & {
  id: string
} & Partial<{
    fullscreenOptions: {
      classNames: Record<'container' | 'link', string[]> & {
        mapFullscreen: string
      }
      control: {
        position: ControlPosition
        title: Record<'false' | 'true', string>
      }
    }
  }>

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
}: FullscreenMapOptions): Map {
  const { get: getFullscreenState, toggle: toggleFullscreenState } =
      useBoolean(false),
    container: HTMLDivElement = DomUtil.create(
      'div',
      joinClassNames(containerClassNames),
    ),
    { assign: linkAssign, onClick: onLinkClick }: UseLink = useLink({
      element: DomUtil.create('a', joinClassNames(linkClassNames), container),
      initialProps: { href: '#' },
    }),
    control: Control = leafletControl({ position }),
    map: Map = leafletMap(id, mapOptions),
    handleMapLifecycleChange: (documentFirstReady: boolean) => () => void = (
      documentFirstReady: boolean,
    ): (() => void) =>
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
