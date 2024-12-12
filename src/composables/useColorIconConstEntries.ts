import { ColorIconConstEntry } from 'src/types'

class LocalEntryModified implements ColorIconConstEntry {
  value: number
  label: string
  code: string
  color: string
  icon: string
  constructor (status: ColorIconConstEntry) {
    this.value = status.value
    this.label = status.label
    this.code = status.code
    this.color = `${status.color}-2`
    this.icon = status.icon
  }
}

const cache: Record<string, LocalEntryModified> = {}

export default function useColorIconConstEntries (entriesRaw: ColorIconConstEntry[]) {
  const entries = () => {
    return entriesRaw.map((entry: ColorIconConstEntry) => {
      return new LocalEntryModified(entry)
    })
  }

  return {
    get entries () {
      return entries()
    },
    getEntryByValue: (entryId: number) => {
      if (cache[entryId]) {
        return cache[entryId]
      }
      return entries().find(t => t.value === entryId)
    },
    getEntryByCode: (entryCode: string) => {
      if (cache[entryCode]) {
        return cache[entryCode]
      }
      return entries().find(t => t.code === entryCode)
    },
    getEntryByLabel: (entryLabel: string) => {
      if (cache[entryLabel]) {
        return cache[entryLabel]
      }
      return entries().find(t => t.label === entryLabel)
    }
  }
}
