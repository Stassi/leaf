import { type UseBooleanGet } from '../state/use-boolean'

import { type ControlAnchorAssign } from './anchor/anchor'

export type ControlAnchorTitleStates = Record<'false' | 'true', string>
export type AnchorAssignTitleOptions = {
  assign: ControlAnchorAssign
  titleStates: ControlAnchorTitleStates
}

export type SetControlAnchorTitleOptions = {
  anchor: AnchorAssignTitleOptions
  fullscreen: { state: { get: UseBooleanGet } }
}

export function setControlAnchorTitle({
  anchor: { assign: anchorAssign, titleStates: anchorTitleStates },
  fullscreen: {
    state: { get: getFullscreenState },
  },
}: SetControlAnchorTitleOptions): HTMLElement {
  return anchorAssign({
    title:
      anchorTitleStates[
        <keyof ControlAnchorTitleStates>getFullscreenState().toString()
      ],
  })
}
