import { constants } from 'boot/constants'
import { ColorIconConstEntry } from 'src/types'

class TaskCategory {
  value: number
  label: string
  code: string
  constructor (status: ColorIconConstEntry) {
    this.value = status.value
    this.label = status.label
    this.code = status.code
  }
}

const cache: Record<string, TaskCategory | 'N/A'> = {

}

const categories = () => {
  return constants.TASK_CATEGORIES
    .sort((statusA, statusB) =>  statusA.value - statusB.value)
    .map((status: ColorIconConstEntry) => {
      return new TaskCategory(status)
    })
}

/**
 * @deprecated use useColorIconConstEntries instead
 */
export default function useTaskCategories () {
  return {
    get categories () {
      return categories()
    },
    getCategoryByValue: (recId: number) => {
      if (cache[recId]) {
        return cache[recId]
      }
      cache[recId] = categories().find(t => t.value === recId) || 'N/A'

      return cache[recId]
    }
  }
}
