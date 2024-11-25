import {
  type ControlPosition,
  type Map,
  type MapOptions,
  map as leafletMap,
} from 'leaflet'

import { domElement } from '../../../dom/element'
import { joinClassNames } from '../../../dom/join-class-names'

import { controlAddedListener } from './control/added-listener'
import {
  type ControlAnchor,
  type ControlAnchorAttributes,
  controlAnchor,
} from './control/anchor/anchor'
import {
  type ControlAnchorTitleStates,
  type RefreshableControlAnchorTitle,
  refreshableControlAnchorTitle,
} from './control/anchor/refreshable-title'
import {
  type FullscreenMapLifecycleEvent,
  fullscreenMapLifecycleListener,
} from './lifecycle-listener'

import { control, useToggle } from '@stassi/leaf'

type FullscreenMapDomElement = {
  classNames: string[]
  tag: string
}

export type FullscreenMapOptions = MapOptions & {
  id: string
} & Partial<{
    fullscreenOptions: {
      control: {
        anchor: FullscreenMapDomElement & {
          attributes: ControlAnchorAttributes
          titleStates: ControlAnchorTitleStates
        }
        container: FullscreenMapDomElement
        position: ControlPosition
      }
      fullscreen: Omit<FullscreenMapDomElement, 'tag'>
    }
  }>

export function fullscreenMap({
  fullscreenOptions: {
    control: {
      anchor: {
        attributes: anchorAttributes,
        classNames: anchorClassNames,
        tag: anchorTag,
        titleStates: anchorTitleStates,
      },
      container: { classNames: containerClassNames, tag: containerTag },
      position: controlPosition,
    },
    fullscreen: { classNames: fullscreenMapClassNames },
  } = {
    control: {
      anchor: {
        attributes: { href: '#' },
        classNames: ['leaflet-bar-part', 'leaflet-control-fullscreen-button'],
        tag: 'a',
        titleStates: {
          false: 'View fullscreen',
          true: 'Exit fullscreen',
        },
      },
      container: {
        classNames: [
          'leaflet-bar',
          'leaflet-control',
          'leaflet-control-fullscreen',
        ],
        tag: 'div',
      },
      position: 'topleft',
    },
    fullscreen: {
      classNames: ['leaflet-fullscreen-on'],
    },
  },
  id,
  ...mapOptions
}: FullscreenMapOptions): Map {
  const { state: fullscreenMapEnabled, toggle: toggleFullscreen } =
      useToggle(false),
    containerElement: HTMLElement = domElement({
      className: joinClassNames(containerClassNames),
      tag: containerTag,
    }),
    { assign: anchorAssign, onClick: anchorOnClick }: ControlAnchor =
      controlAnchor({
        attributes: anchorAttributes,
        element: domElement({
          className: joinClassNames(anchorClassNames),
          container: containerElement,
          tag: anchorTag,
        }),
      }),
    map: Map = leafletMap(id, mapOptions),
    refreshControlAnchorTitle: RefreshableControlAnchorTitle =
      refreshableControlAnchorTitle({
        map: {
          control: {
            anchor: {
              assign: anchorAssign,
              titleStates: anchorTitleStates,
            },
          },
          fullscreen: {
            enabled: fullscreenMapEnabled,
          },
        },
      }),
    handleMapLifecycleChange: (
      mapLifecycleEvent: FullscreenMapLifecycleEvent,
    ) => () => void = (
      mapLifecycleEvent: FullscreenMapLifecycleEvent,
    ): (() => void) =>
      fullscreenMapLifecycleListener({
        map: {
          control: {
            anchor: {
              refreshTitle: refreshControlAnchorTitle,
            },
          },
          fullscreen: {
            className: joinClassNames(fullscreenMapClassNames),
            enabled: fullscreenMapEnabled,
            toggle: toggleFullscreen,
          },
          lifecycleEvent: mapLifecycleEvent,
          map,
        },
      })

  control({
    map,
    onAdd: controlAddedListener({
      map: {
        control: {
          anchor: {
            onClick: anchorOnClick,
            refreshTitle: refreshControlAnchorTitle,
          },
          container: { element: containerElement },
        },
        fullscreen: {
          enabled: fullscreenMapEnabled,
        },
      },
    }),
    position: controlPosition,
  })

  map.whenReady(handleMapLifecycleChange('ready'))
  map.on('unload', handleMapLifecycleChange('unload'))

  return map
}
