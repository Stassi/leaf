export type SwitchGet = () => boolean
export type SwitchToggle = () => void
export type UseSwitch = {
  get: SwitchGet
  toggle: SwitchToggle
}

export function useSwitch(initialState: boolean): UseSwitch {
  let state: boolean = initialState
  return {
    get(): boolean {
      return state
    },
    toggle(): void {
      state = !state
    },
  }
}
