import { type UseBooleanGet } from '../../state/use-boolean'

import { type ControlAnchorAssign } from './anchor'

export type ControlAnchorTitleStates = Record<'false' | 'true', string>
export type UpdateControlAnchorTitleAnchorOptions = {
  assign: ControlAnchorAssign
  titleStates: ControlAnchorTitleStates
}

export type UpdateControlAnchorTitleOptions = {
  anchor: UpdateControlAnchorTitleAnchorOptions
  fullscreen: { state: { get: UseBooleanGet } }
}

export function updateControlAnchorTitle({
  anchor: { assign: anchorAssign, titleStates: anchorTitleStates },
  fullscreen: {
    state: { get: getFullscreenState },
  },
}: UpdateControlAnchorTitleOptions): HTMLElement {
  return anchorAssign({
    title:
      anchorTitleStates[
        <keyof ControlAnchorTitleStates>getFullscreenState().toString()
      ],
  })
}
