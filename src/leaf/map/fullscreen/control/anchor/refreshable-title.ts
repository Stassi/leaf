import { type ControlAnchorAssign } from './anchor'

import { type ToggleableState } from '@stassi/leaf'

type StringifyBoolean<T extends boolean> = `${T}`
export type ControlAnchorTitleStates = Record<StringifyBoolean<boolean>, string>
export type RefreshableControlAnchorTitleOptions = {
  map: {
    control: {
      anchor: {
        assign: ControlAnchorAssign
        titleStates: ControlAnchorTitleStates
      }
    }
    fullscreen: {
      enabled: ToggleableState
    }
  }
}

type Callback<T> = () => T
export type RefreshableControlAnchorTitle = Callback<void>

export function refreshableControlAnchorTitle({
  map: {
    control: {
      anchor: { assign: anchorAssign, titleStates: anchorTitleStates },
    },
    fullscreen: { enabled: fullscreenMapEnabled },
  },
}: RefreshableControlAnchorTitleOptions): RefreshableControlAnchorTitle {
  return function refreshControlAnchorTitle(): void {
    anchorAssign({
      title:
        anchorTitleStates[
          <keyof ControlAnchorTitleStates>fullscreenMapEnabled().toString()
        ],
    })
  }
}
