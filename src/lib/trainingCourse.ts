import type { TrainingCourse } from '../types'

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

    this.courses = (await storage.get(STORAGE_KEY))[STORAGE_KEY] as TrainingCourse[]
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
    this.courses.push(course)
  }

  remove (name: string, generatedTime: number): void {
    this.courses = this.courses.filter(course => course.name !== name || course.generatedTime !== generatedTime)
  }

  getAll (): TrainingCourse[] {
    return this.courses
  }
}

const courseStorage = await TrainingCourseStorage.getInstance()

export { courseStorage }
