import {
  type ControlPosition,
  type Map,
  type MapOptions,
  DomUtil,
  map as leafletMap,
} from 'leaflet'

import { joinClassNames } from '../../../dom/join-class-names'

import { controlAddedListener } from './control/added-listener'
import {
  type ControlAnchor,
  type ControlAnchorAttributes,
  controlAnchor,
} from './control/anchor/anchor'
import { type ControlAnchorTitleStates } from './control/anchor/update-title'
import {
  type FullscreenMapLifecycleEvent,
  fullscreenMapLifecycleListener,
} from './map/lifecycle-listener'

import { control, useSwitch } from '@stassi/leaf'

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
      position: controlPosition,
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
      useSwitch(false),
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
    map: Map = leafletMap(id, mapOptions),
    handleMapLifecycleChange: (
      mapLifecycleEvents: FullscreenMapLifecycleEvent,
    ) => () => void = (
      mapLifecycleEvent: FullscreenMapLifecycleEvent,
    ): (() => void) =>
      fullscreenMapLifecycleListener({
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

  control({
    map,
    onAdd: controlAddedListener({
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
    }),
    position: controlPosition,
  })

  map.whenReady(handleMapLifecycleChange('ready'))
  map.on('unload', handleMapLifecycleChange('unload'))

  return map
}
