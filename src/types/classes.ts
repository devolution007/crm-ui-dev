import { StringMap } from 'src/types/index'

export class ErrorContainer {
  general: string | null = null
  constructor (data: StringMap = {}) {
    Object.assign(this, data)
  }
}
