import { type UseLink } from '../state/use-link'

export type SetControlTitleOptions = {
  fullscreen: boolean
  linkAssign: UseLink['assign']
  title: Record<'false' | 'true', string>
}

export function setControlTitle({
  fullscreen,
  linkAssign,
  title,
}: SetControlTitleOptions): HTMLAnchorElement {
  return linkAssign({ title: title[<'false' | 'true'>fullscreen.toString()] })
}
