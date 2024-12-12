class Api {
  protected axios: any

  constructor (axios: any) {
    this.axios = axios
  }
  

  /**
   * @deprecated use Api.removeEmptyFields instead
   * @param propsObject
   * @private
   */
  private static deleteExtraProps (propsObject: object): object {
    for (const key of Object.keys(propsObject)) {
      if (!isNaN(Number(key))) {
        // @ts-ignore
        if (!Api.isEmpty(Object.values(propsObject[key])[0])) {
          // @ts-ignore
          propsObject[Object.keys(propsObject[key])[0]] = Object.values(propsObject[key])[0]
        }
        // @ts-ignore
        delete propsObject[key]
      }

      // @ts-ignore
      if (Api.isEmpty(propsObject[key])) {
        // @ts-ignore
        delete propsObject[key]
      }
    }
    return propsObject
  }

  private static isEmpty (data: any): boolean {
    return (
      (!data && data !== false) ||
      data === 'nil' ||
      data === 'undefined' ||
      data === '0' ||
      (Array.isArray(data) && data.length === 0) ||
      (data instanceof Object && Object.keys(data).length === 0)
    )
  }

  /**
   * @deprecated use Api.removeEmptyFields instead
   * @todo: Get rid of this method
   */
  protected purgeParams (page: number, perPage = 25, filterBy: object|null = null, sortBy: object|null = null): object {
    filterBy = { ...filterBy }
    sortBy = { ...sortBy }
    if (filterBy) {
      filterBy = Api.deleteExtraProps(filterBy)
    }

    if (sortBy) {
      sortBy = Api.deleteExtraProps(sortBy)
    }

    return Object.assign({},
      page && { page },
      perPage && { perPage },
      filterBy && Object.keys(filterBy).length > 0 && { filterBy },
      sortBy && Object.keys(sortBy).length > 0 && { sortBy }
    )
  }

  protected removeEmptyFields (data: {[index: string]:any}, ignoreFields: string[] = [], {
    removeEmptyArrays = true,
    removeEmptyObjects = true,
    removeEmptyStrings = true,
    removeNulls = true,
    removeUndefineds = true
  } = {}): object {
    for (const key of Object.keys(data)) {
      if (ignoreFields.includes(key)) {
        continue
      }

      if (removeEmptyArrays && Array.isArray(data[key]) && data[key].length === 0) {
        delete data[key]
      }

      if (removeEmptyObjects && data[key] instanceof Object && Object.keys(data[key]).length === 0) {
        delete data[key]
      }

      if (removeEmptyStrings && typeof data[key] === 'string' && data[key].length === 0) {
        delete data[key]
      }

      if (removeNulls && data[key] === null) {
        delete data[key]
      }

      if (removeUndefineds && data[key] === undefined) {
        delete data[key]
      }
    }
    return data
  }

  protected nullToZero (data: Record<string, null | unknown>): Record<string, number | unknown> {
    for (const key of Object.keys(data)) {
      if (data[key] === null) {
        data[key] = 0
      }
    }
    return data
  }
}
export default Api
