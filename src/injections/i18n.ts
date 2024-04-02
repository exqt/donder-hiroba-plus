import I18N from '../lib/i18n'
import { SettingsStorage } from '../lib/settings'

const isJapanese = (text: string): boolean => {
  return text.match(/[\u3040-\u30ff\u31f0-\u31ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/) !== null
}

export default async (): Promise<void> => {
  const settings = await SettingsStorage.getInstance()

  if (settings.language === 'ko') {
    const style = document.createElement('style')
    style.innerHTML = `* {
      word-break: keep-all;
    }`
    document.head.appendChild(style)
  }

  // iterate all element that has text content
  // element should have only one child node that is text node
  const body = document.querySelector('body')
  if (body === null) return

  const textNodes: Text[] = []
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node !== null) {
    const content = node.textContent
    if (content !== null && content.trim() !== '') {
      textNodes.push(node as Text)
    }
    node = walker.nextNode()
  }

  const set = new Set<string>()
  const i18n = new I18N()
  await i18n.load()

  for (const textNode of textNodes) {
    let text = textNode.textContent
    if (text === null) continue
    text = text.trim()
    if (!isJapanese(text)) continue

    const parent = textNode.parentElement
    if (parent === null) continue
    if (parent.className === null) continue
    if (parent.className.includes('songName')) continue

    set.add(text)

    // replace text content
    textNode.textContent = i18n.t(text)
  }
}
