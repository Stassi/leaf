import {
  type Control,
  type ControlOptions,
  type ControlPosition,
  type Map,
  type MapOptions,
  control as untypedLeafletControl,
  DomUtil,
  map as leafletMap,
} from 'leaflet'

import { controlAddedListener } from './control/control-added-listener'
import { type ControlAnchorTitleStates } from './control/set-control-anchor-title'
import { joinClassNames } from './dom-element/join-class-names'
import {
  type LeafletMapLifecycleEvent,
  mapLifecycleListener,
} from './map/map-lifecycle-listener'
import {
  type ControlAnchor,
  type ControlAnchorAttributes,
  controlAnchor,
} from './control/anchor/anchor'
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
          attributes: ControlAnchorAttributes
          tag: string
          titleStates: ControlAnchorTitleStates
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
    { assign: anchorAssign, onClick: anchorOnClick }: ControlAnchor =
      controlAnchor({
        attributes: anchorAttributes,
        element: DomUtil.create(
          anchorTag,
          joinClassNames(anchorClassNames),
          containerElement,
        ),
      }),
    control: Control = leafletControl({ position }),
    map: Map = leafletMap(id, mapOptions),
    handleMapLifecycleChange: (
      mapLifecycleEvents: LeafletMapLifecycleEvent,
    ) => () => void = (
      mapLifecycleEvent: LeafletMapLifecycleEvent,
    ): (() => void) =>
      mapLifecycleListener({
        document: {
          map: {
            control: {
              anchor: {
                assign: anchorAssign,
                titleStates: anchorTitleStates,
              },
            },
            fullscreen: {
              classNames: fullscreenMapClassNames,
              state: { get: getFullscreenState, toggle: toggleFullscreenState },
            },
            lifecycleEvent: mapLifecycleEvent,
            map,
          },
        },
      })

  control.onAdd = controlAddedListener({
    map: {
      control: {
        anchor: {
          assign: anchorAssign,
          onClick: anchorOnClick,
          titleStates: anchorTitleStates,
        },
        container: { element: containerElement },
      },
      fullscreen: {
        state: { get: getFullscreenState },
      },
    },
  })
  control.addTo(map)

  map.whenReady(handleMapLifecycleChange('ready'))
  map.on('unload', handleMapLifecycleChange('unload'))

  return map
}
