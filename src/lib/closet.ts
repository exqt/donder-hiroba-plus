import type { KisekaeReqData } from 'hiroba-js'

const STORAGE_KEY = 'closet'

export class Closet {
  private static instance: Closet | null = null
  static async getInstance (): Promise<Closet> {
    if (this.instance !== null) {
      return this.instance
    }

    this.instance = new Closet()
    await this.instance.load()
    return this.instance
  }

  presets: KisekaeReqData[] = []

  private async load (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      return
    }

    const data = (await storage.get(STORAGE_KEY))[STORAGE_KEY] as KisekaeReqData[]
    if (Array.isArray(data)) {
      this.presets = [...data]
    }
  }

  async save (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.warn('storage is not available')
      return
    }

    await storage.set({ [STORAGE_KEY]: this.presets })
  }
}
