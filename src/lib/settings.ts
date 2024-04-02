import type { DifficultyType, DonderInfo, ExtensionSetting, Language } from '../types'

const STORAGE_KEY = 'settings'

export class SettingsStorage implements ExtensionSetting {
  private static instance: SettingsStorage

  preferringDifficulty: DifficultyType = 'oni'
  language: Language = 'en'
  lastTabIndex: number = 0
  donderInfo: DonderInfo | undefined

  private constructor () {}

  public static async getInstance (): Promise<SettingsStorage> {
    if (SettingsStorage.instance === undefined) {
      SettingsStorage.instance = new SettingsStorage()
      await SettingsStorage.instance.load()
    }

    return SettingsStorage.instance
  }

  private async load (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      return
    }

    const data = (await storage.get(STORAGE_KEY))[STORAGE_KEY] as ExtensionSetting

    this.donderInfo = data?.donderInfo ?? this.donderInfo ?? {}
    this.preferringDifficulty = data?.preferringDifficulty ?? this.preferringDifficulty
    this.language = data?.language ?? this.language
    this.lastTabIndex = data?.lastTabIndex ?? this.lastTabIndex
  }

  async save (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.warn('storage is not available')
      return
    }

    await storage.set({
      [STORAGE_KEY]: {
        donderInfo: this.donderInfo,
        preferringDifficulty: this.preferringDifficulty,
        language: this.language,
        lastTabIndex: this.lastTabIndex
      }
    })
  }

  async reset (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.error('storage is not available')
      return
    }

    this.preferringDifficulty = 'oni'
    this.language = 'en'
    this.lastTabIndex = 0
    this.donderInfo = {}

    await this.save()
  }
}
