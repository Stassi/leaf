type Callback<T> = () => T
export type ToggleableState = Callback<boolean>
export type ToggleableToggle = Callback<void>
export type Toggleable = {
  state: ToggleableState
  toggle: ToggleableToggle
}

export function useToggle(initialState: boolean): Toggleable {
  let innerState: boolean = initialState
  return {
    state(): boolean {
      return innerState
    },
    toggle(): void {
      innerState = !innerState
    },
  }
}
