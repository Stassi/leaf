import { type UseAnchor } from '../state/use-anchor'

export type SetControlAnchorTitleOptions = {
  anchorAssign: UseAnchor['assign']
  anchorTitleStates: Record<'false' | 'true', string>
  fullscreen: boolean
}

export function setControlAnchorTitle({
  anchorAssign,
  anchorTitleStates,
  fullscreen,
}: SetControlAnchorTitleOptions): HTMLElement {
  return anchorAssign({
    title:
      anchorTitleStates[
        <keyof SetControlAnchorTitleOptions['anchorTitleStates']>(
          fullscreen.toString()
        )
      ],
  })
}
