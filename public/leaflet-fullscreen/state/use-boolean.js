export function useBoolean(initialValue) {
  let state = initialValue
  return {
    get() {
      return state
    },
    toggle() {
      state = !state
    },
  }
}
