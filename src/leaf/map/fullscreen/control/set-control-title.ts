import { type UseAnchor } from '../state/use-anchor'

export type SetControlTitleOptions = {
  anchorAssign: UseAnchor['assign']
  fullscreen: boolean
  title: Record<'false' | 'true', string>
}

export function setControlTitle({
  anchorAssign,
  fullscreen,
  title,
}: SetControlTitleOptions): HTMLElement {
  return anchorAssign({ title: title[<'false' | 'true'>fullscreen.toString()] })
}
