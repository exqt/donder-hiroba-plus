export const processAssetPath = (path: string): string => {
  // for storybook
  if (chrome?.runtime === undefined) return path
  return chrome.runtime.getURL(path)
}

export const waitFor = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
