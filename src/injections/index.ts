import { parseDonderInfo, updateDonderInfo } from '../lib/donder'

export default async (): Promise<void> => {
  const donderInfo = parseDonderInfo()
  await updateDonderInfo(donderInfo)
}
