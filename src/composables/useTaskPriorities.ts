import { constants } from 'boot/constants'
import { ColorIconConstEntry } from 'src/types'

class TaskPriority {
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

const cache: Record<string, TaskPriority> = {

}

const priorities = () => {
  return constants.TASK_PRIORITIES
    .sort((statusA, statusB) => statusB.value - statusA.value)
    .map((status: ColorIconConstEntry) => {
      return new TaskPriority(status)
    })
}

/**
 * @deprecated use useColorIconConstEntries instead
 */
export default function useTaskPriorities () {
  return {
    get priorities () {
      return priorities()
    },
    getPriorityByValue: (recId: number) => {
      if (cache[recId]) {
        return cache[recId]
      }
      cache[recId] = priorities().find(t => t.value === recId) || priorities()[0]

      return cache[recId]
    }
  }
}
