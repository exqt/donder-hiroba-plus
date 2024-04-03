import type { Language } from '../types'
import { SettingsStorage } from './settings'

export default class I18N {
  data: Partial<Record<Language, Record<string, string>>> = {}
  language: Language = 'en'

  private static instance: I18N

  public static async getInstance (): Promise<I18N> {
    if (I18N.instance === undefined) {
      I18N.instance = new I18N()
      await I18N.instance.load()
    }

    return I18N.instance;
  }

  async load (): Promise<void> {
    const settings = await SettingsStorage.getInstance()
    const language = settings.language
    this.language = language

    this.data.ko = (await import('../i18n/ko.json')).default
    this.data.ja = (await import('../i18n/ja.json')).default
    this.data.en = (await import('../i18n/en.json')).default
  }

  t (key: string): string {
    const langData = this.data[this.language]
    if (langData === undefined) return key

    const translated = langData[key]
    if (translated === undefined) {
      // console.log(`Translation not found: ${key}`)
      return key
    }

    return translated
  }
}
