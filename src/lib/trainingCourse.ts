import { CONDITION_TYPES, DIFFICULTIES } from '../constants'
import type { TrainingCourse, TrainingCourseSong } from '../types'

const STORAGE_KEY = 'training'

export default class TrainingCourseStorage {
  private static instance: TrainingCourseStorage

  private courses: TrainingCourse[] = []

  private constructor () {}

  public static async getInstance (): Promise<TrainingCourseStorage> {
    if (TrainingCourseStorage.instance === undefined) {
      TrainingCourseStorage.instance = new TrainingCourseStorage()
      await TrainingCourseStorage.instance.load()
    }
    return TrainingCourseStorage.instance
  }

  private async load (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      return
    }

    const data = (await storage.get(STORAGE_KEY))[STORAGE_KEY] as TrainingCourse[]
    if (data !== undefined) {
      this.courses = data
    }
  }

  async save (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.warn('storage is not available')
      return
    }

    await storage.set({ [STORAGE_KEY]: this.courses })
  }

  async reset (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.error('storage is not available')
      return
    }

    this.courses = []
    await this.save()
  }

  add (course: TrainingCourse): void {
    if (!this.courses.map(course => course.hash).includes(course.hash)) this.courses.push(course)
  }

  remove (hash: number): void {
    this.courses = this.courses.filter(course => course.hash !== hash)
  }

  get (hash: number): TrainingCourse | undefined {
    return this.courses.find(course => course.hash === hash)
  }

  getIndex (hash: number): number {
    return this.courses.findIndex(course => course.hash === hash)
  }

  getAll (): TrainingCourse[] {
    return this.courses
  }

  static parse (json: string): TrainingCourse {
    const parsed = JSON.parse(json)
    if (
      !('name' in parsed) || typeof (parsed.name) !== 'string' ||
      !('hash' in parsed) || typeof (parsed.hash) !== 'number' ||
      !('songs' in parsed) || !Array.isArray(parsed.songs)
    ) {
      throw new Error('invalid json')
    }

    if (
      (parsed.songs as any[]).some((value) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return !('songNo' in value) || typeof (value.songNo) !== 'number' || !('difficulty' in value) || typeof (value.difficulty) !== 'string' || !DIFFICULTIES.includes(value.difficulty) || !('conditions' in value) || !Array.isArray(value.conditions)
      })
    ) {
      throw new Error('invalid json')
    }

    if (
      (parsed.songs as TrainingCourseSong[]).some((song) => {
        return song.conditions.some(condition => {
          return !('type' in condition) || typeof (condition.type) !== 'string' || !CONDITION_TYPES.includes(condition.type) || !('criterion' in condition) || typeof (condition.criterion) !== 'number'
        })
      })
    ) {
      throw new Error('invalid json')
    }

    return parsed
  }

  static createHash (name: string, generatedTime: number): number {
    const string = name + generatedTime + Math.round(Math.random() * 10000)
    let hash = 0
    if (string.length === 0) {
      return hash
    }
    for (let i = 0; i < string.length; i++) {
      const ch = string.charCodeAt(i)
      hash = ((hash << 5) - hash) + ch
      hash = hash & hash
    }
    return hash
  }
}
