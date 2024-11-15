export type UseBooleanGet = () => boolean
export type UseBooleanToggle = () => void
export type UseBoolean = {
  get: UseBooleanGet
  toggle: UseBooleanToggle
}

export function useBoolean(initialValue: boolean): UseBoolean {
  let state: boolean = initialValue
  return {
    get(): boolean {
      return state
    },
    toggle(): void {
      state = !state
    },
  }
}
