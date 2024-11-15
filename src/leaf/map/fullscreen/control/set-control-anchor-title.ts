import { type UseAnchor } from '../state/use-anchor'

export type SetControlAnchorTitleOptions = {
  anchor: {
    assign: UseAnchor['assign']
    titleStates: Record<'false' | 'true', string>
  }
  fullscreen: boolean
}

export function setControlAnchorTitle({
  anchor: { assign: anchorAssign, titleStates: anchorTitleStates },
  fullscreen,
}: SetControlAnchorTitleOptions): HTMLElement {
  return anchorAssign({
    title:
      anchorTitleStates[
        <keyof SetControlAnchorTitleOptions['anchor']['titleStates']>(
          fullscreen.toString()
        )
      ],
  })
}
