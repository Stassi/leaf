export type UseBoolean = {
  get: () => boolean
  toggle: () => void
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
