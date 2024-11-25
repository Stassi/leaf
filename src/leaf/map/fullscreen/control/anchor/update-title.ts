import { type ControlAnchorAssign } from './anchor'

import { type ToggleableState } from '@stassi/leaf'

export type ControlAnchorTitleStates = Record<'false' | 'true', string>
export type UpdateControlAnchorTitleAnchorOptions = {
  assign: ControlAnchorAssign
  titleStates: ControlAnchorTitleStates
}

export type UpdateControlAnchorTitleOptions = {
  map: {
    control: { anchor: UpdateControlAnchorTitleAnchorOptions }
    fullscreen: {
      enabled: ToggleableState
    }
  }
}

export function updateControlAnchorTitle({
  map: {
    control: {
      anchor: { assign: anchorAssign, titleStates: anchorTitleStates },
    },
    fullscreen: { enabled: fullscreenMapEnabled },
  },
}: UpdateControlAnchorTitleOptions): HTMLElement {
  return anchorAssign({
    title:
      anchorTitleStates[
        <keyof ControlAnchorTitleStates>fullscreenMapEnabled().toString()
      ],
  })
}
