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
import { joinClassNames } from './dom-element/join-class-names'
import { mapLifecycleListener } from './map/map-lifecycle-listener'
import { useBoolean } from './state/use-boolean'
import { type UseAnchor, useAnchor } from './state/use-anchor'

const leafletControl = <(options: ControlOptions) => Control>(
  (<unknown>untypedLeafletControl)
)

export type FullscreenMapOptions = MapOptions & {
  id: string
} & Partial<{
    fullscreenOptions: {
      classNames: Record<'anchor' | 'container', string[]> & {
        mapFullscreen: string
      }
      control: {
        anchor: {
          attributes: Record<string, string>
          tag: string
        }
        container: {
          tag: string
        }
        position: ControlPosition
        title: Record<'false' | 'true', string>
      }
    }
  }>

export function fullscreenMap({
  fullscreenOptions: {
    classNames: {
      anchor: anchorClassNames,
      container: containerClassNames,
      mapFullscreen: mapFullscreenClassName,
    },
    control: {
      anchor: { attributes: anchorAttributes, tag: anchorTag },
      container: { tag: containerTag },
      position,
      title,
    },
  } = {
    classNames: {
      anchor: ['leaflet-bar-part', 'leaflet-control-fullscreen-button'],
      container: [
        'leaflet-bar',
        'leaflet-control',
        'leaflet-control-fullscreen',
      ],
      mapFullscreen: 'leaflet-fullscreen-on',
    },
    control: {
      anchor: {
        attributes: { href: '#' },
        tag: 'a',
      },
      container: {
        tag: 'div',
      },
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
    container: HTMLElement = DomUtil.create(
      containerTag,
      joinClassNames(containerClassNames),
    ),
    { assign: anchorAssign, onClick: anchorOnClick }: UseAnchor = useAnchor({
      attributes: anchorAttributes,
      element: DomUtil.create(
        anchorTag,
        joinClassNames(anchorClassNames),
        container,
      ),
    }),
    control: Control = leafletControl({ position }),
    map: Map = leafletMap(id, mapOptions),
    handleMapLifecycleChange: (documentFirstReady: boolean) => () => void = (
      documentFirstReady: boolean,
    ): (() => void) =>
      mapLifecycleListener({
        anchorAssign,
        documentFirstReady,
        getFullscreenState,
        map,
        mapFullscreenClassName,
        title,
        toggleFullscreenState,
      })

  control.onAdd = controlAddedListener({
    anchorAssign,
    anchorOnClick,
    container,
    getFullscreenState,
    title,
  })
  control.addTo(map)

  map.whenReady(handleMapLifecycleChange(true))
  map.on('unload', handleMapLifecycleChange(false))

  return map
}
