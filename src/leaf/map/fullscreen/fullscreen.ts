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
    containerElement: HTMLElement = DomUtil.create(
      containerTag,
      joinClassNames(containerClassNames),
    ),
    { assign: anchorAssign, onClick: anchorOnClick }: UseAnchor = useAnchor({
      attributes: anchorAttributes,
      element: DomUtil.create(
        anchorTag,
        joinClassNames(anchorClassNames),
        containerElement,
      ),
    }),
    control: Control = leafletControl({ position }),
    map: Map = leafletMap(id, mapOptions),
    handleMapLifecycleChange: (documentFirstReady: boolean) => () => void = (
      documentFirstReady: boolean,
    ): (() => void) =>
      mapLifecycleListener({
        anchor: {
          assign: anchorAssign,
          titleStates: anchorTitleStates,
        },
        document: { firstReady: documentFirstReady },
        map: {
          fullscreen: {
            classNames: fullscreenMapClassNames,
            state: { get: getFullscreenState, toggle: toggleFullscreenState },
          },
          map,
        },
      })

  control.onAdd = controlAddedListener({
    control: {
      anchor: {
        assign: anchorAssign,
        onClick: anchorOnClick,
        titleStates: anchorTitleStates,
      },
      container: { element: containerElement },
    },
    map: {
      fullscreen: {
        state: { get: getFullscreenState },
      },
    },
  })
  control.addTo(map)

  map.whenReady(handleMapLifecycleChange(true))
  map.on('unload', handleMapLifecycleChange(false))

  return map
}
