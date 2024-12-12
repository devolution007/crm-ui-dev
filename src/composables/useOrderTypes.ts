import { constants } from 'boot/constants'

const typesMap: {
  [key: string]: string
} = {}
export function useOrderTypes () {
  if (Object.keys(typesMap).length === 0) {
    const types = constants.ORDER_TYPES
    for (const typeLabel of Object.keys(types)) {
      typesMap[types[typeLabel]] = typeLabel
    }
  }
  return {
    labelByType: (type: string) => {
      return typesMap[type] || ''
    }
  }
}
