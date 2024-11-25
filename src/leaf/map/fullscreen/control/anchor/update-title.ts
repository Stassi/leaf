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
    fullscreen: { state: { get: ToggleableState } }
  }
}

export function updateControlAnchorTitle({
  map: {
    control: {
      anchor: { assign: anchorAssign, titleStates: anchorTitleStates },
    },
    fullscreen: {
      state: { get: getFullscreenState },
    },
  },
}: UpdateControlAnchorTitleOptions): HTMLElement {
  return anchorAssign({
    title:
      anchorTitleStates[
        <keyof ControlAnchorTitleStates>getFullscreenState().toString()
      ],
  })
}
