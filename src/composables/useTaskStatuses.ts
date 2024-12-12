import { constants } from 'boot/constants'
import { ColorIconConstEntry } from 'src/types'

class TaskStatus {
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

const statuses = () => {
  return constants.TASK_STATUSES.map((status: ColorIconConstEntry) => {
    return new TaskStatus(status)
  })
}

/**
 * @deprecated use useColorIconConstEntries instead
 */
export default function useTaskStatuses () {
  return {
    get statuses () {
      return statuses()
    },
    getStatusByValue: (statusId: number) => {
      return statuses().find(t => t.value === statusId)
    }
  }
}
