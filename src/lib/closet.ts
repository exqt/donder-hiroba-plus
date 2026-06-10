import type { KisekaeReqData } from "hiroba-js";

const STORAGE_KEY = 'closet';

export class Closet {
  private static instance?: Closet;
  static async getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new Closet();
    await this.instance.load();
    return this.instance;
  }

  presets: KisekaeReqData[] = [];

  private async load() {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      return
    }

    const data = (await storage.get(STORAGE_KEY))[STORAGE_KEY] as KisekaeReqData[];
    if (Array.isArray(data)) {
      this.presets = [...data];
    }
  }

  async save() {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.warn('storage is not available')
      return
    }

    await storage.set({ [STORAGE_KEY]: this.presets });
  }
}