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
import { type SetControlAnchorTitleOptions } from './control/set-control-anchor-title'
import { type UseAnchor, useAnchor } from './state/use-anchor'
import { useBoolean } from './state/use-boolean'

const leafletControl = <(options: ControlOptions) => Control>(
  (<unknown>untypedLeafletControl)
)

export type FullscreenMapOptions = MapOptions & {
  id: string
} & Partial<{
    fullscreenOptions: {
      classNames: Record<'anchor' | 'container', string[]> & {
        fullscreenMap: string
      }
      control: {
        anchor: {
          attributes: Record<string, string>
          tag: string
          titleStates: SetControlAnchorTitleOptions['anchorTitleStates']
        }
        container: {
          tag: string
        }
        position: ControlPosition
      }
    }
  }>

export function fullscreenMap({
  fullscreenOptions: {
    classNames: {
      anchor: anchorClassNames,
      container: containerClassNames,
      fullscreenMap: fullscreenMapClassNames,
    },
    control: {
      anchor: {
        attributes: anchorAttributes,
        tag: anchorTag,
        titleStates: anchorTitleStates,
      },
      container: { tag: containerTag },
      position,
    },
  } = {
    classNames: {
      anchor: ['leaflet-bar-part', 'leaflet-control-fullscreen-button'],
      container: [
        'leaflet-bar',
        'leaflet-control',
        'leaflet-control-fullscreen',
      ],
      fullscreenMap: 'leaflet-fullscreen-on',
    },
    control: {
      anchor: {
        attributes: { href: '#' },
        tag: 'a',
        titleStates: {
          false: 'View Fullscreen',
          true: 'Exit Fullscreen',
        },
      },
      container: {
        tag: 'div',
      },
      position: 'topleft',
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
        anchorTitleStates,
        documentFirstReady,
        fullscreenMapClassName: fullscreenMapClassNames,
        getFullscreenState,
        map,
        toggleFullscreenState,
      })

  control.onAdd = controlAddedListener({
    anchorAssign,
    anchorOnClick,
    anchorTitleStates,
    container,
    getFullscreenState,
  })
  control.addTo(map)

  map.whenReady(handleMapLifecycleChange(true))
  map.on('unload', handleMapLifecycleChange(false))

  return map
}
