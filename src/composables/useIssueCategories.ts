import { constants } from 'boot/constants'

function flattenCategories (categories: Record<string, any>): { name: string; disabled: boolean }[] {
  const result = []

  let restAdded = false

  for (const [key, value] of Object.entries(categories)) {
    if (typeof value === 'object') {
      result.push({
        name: key,
        disabled: true
      })
      for (const subKey of Object.keys(value)) {
        result.push({
          name: subKey,
          disabled: false
        })
      }
    } else {
      if (!restAdded) {
        result.push({
          name: 'Rest',
          disabled: true
        })
        restAdded = true
      }

      result.push({
        name: key,
        disabled: false
      })
    }
  }

  return result
}

export default function useIssueCategories () {
  const issueCategories = flattenCategories(constants.ISSUE_CATEGORIES_LIST)

  return {
    issueCategories
  }
}
