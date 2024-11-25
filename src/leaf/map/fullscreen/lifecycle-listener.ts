import { DomUtil } from 'leaflet'

import { type RefreshableControlAnchorTitle } from './control/anchor/refreshable-title'

import {
  type Map,
  type ToggleableState,
  type ToggleableToggle,
  domEventOff,
  domEventOn,
} from '@stassi/leaf'

export type FullscreenMapLifecycleEvent = 'ready' | 'unload'
export type FullscreenMapLifecycleListenerOptions = {
  map: {
    control: {
      anchor: {
        refreshTitle: RefreshableControlAnchorTitle
      }
    }
    fullscreen: {
      className: string
      enabled: ToggleableState
      toggle: ToggleableToggle
    }
    lifecycleEvent: FullscreenMapLifecycleEvent
    map: Map
  }
}

export type FullscreenMapLifecycleListener = () => void

export function fullscreenMapLifecycleListener({
  map: {
    control: {
      anchor: { refreshTitle: refreshControlAnchorTitle },
    },
    fullscreen: {
      className: fullscreenMapClassName,
      enabled: fullscreenMapEnabled,
      toggle: toggleFullscreenMap,
    },
    lifecycleEvent: mapLifecycleEvent,
    map,
  },
}: FullscreenMapLifecycleListenerOptions): FullscreenMapLifecycleListener {
  return function handleFullscreenMapLifecycleEvent(): void {
    ;(mapLifecycleEvent === 'ready' ? domEventOn : domEventOff)({
      element: document,
      event: 'fullscreenchange',
      handler: function handleFullscreenMapChange(): void {
        ;(fullscreenMapEnabled() ? DomUtil.removeClass : DomUtil.addClass)(
          map.getContainer(),
          fullscreenMapClassName,
        )

        map.invalidateSize()
        toggleFullscreenMap()
        refreshControlAnchorTitle()
      },
    })
  }
}
