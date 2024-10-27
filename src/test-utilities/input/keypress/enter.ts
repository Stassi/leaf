export function pressEnter(): Promise<void> {
  return page.keyboard.press('Enter')
}
