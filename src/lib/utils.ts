export const processAssetPath = (path: string): string => {
  // for storybook
  if (chrome?.runtime === undefined) return path
  return chrome.runtime.getURL(path)
}

export const waitFor = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export const genUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const openRatingPage = (): void => {
  const popup = window.open()
  if (popup === null) return
  popup.window.location.href = `chrome-extension://${chrome.runtime.id}/rating.html`
}
