import { type AnchorAssign } from '../state/use-anchor'
import { type UseBooleanGet } from '../state/use-boolean'

export type ControlAnchorTitleStates = Record<'false' | 'true', string>
export type AnchorAssignTitleOptions = {
  assign: AnchorAssign
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
