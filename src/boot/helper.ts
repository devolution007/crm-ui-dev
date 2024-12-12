import { dayjs } from 'boot/dayjs'
import { ProductInterface } from 'src/models/ProductModel'
import CustomerModel from 'src/models/CustomerModel'
import { boot } from 'quasar/wrappers'
import { AttachmentInfo, StringMap, StringMapArr } from 'src/types'
import FileApi from 'src/api/FileApi'
import { api } from 'boot/axios'
import AttachmentModel from 'src/models/AttachmentModel'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $helper: typeof helper;
  }
}

const helper = {
  name: 'Helper',

  implode (data: string[] | null): string | null {
    return data ? data.toString() : null
  },

  getTotalForItem (pricePerItem: number|string, qty: number): number {
    if (typeof pricePerItem === 'string') {
      pricePerItem = parseFloat(pricePerItem)
    }
    return parseFloat((pricePerItem * qty).toFixed(2))
  },

  padPrice (price: number|string): string {
    if (typeof price === 'number') {
      price = price.toFixed(2)
    }
    const priceArr = price.split('.')
    const cents = priceArr[1] || '00'
    return `${priceArr[0]}.${cents.padEnd(2, '0')}`
  },

  formatPrice (price: number|string, currencyPrefix = '$'): string {
    return `${currencyPrefix}${this.padPrice(price)}`
  },

  getMaxProductQty (product: ProductInterface): number {
    return product.inStockAmount === 0 ? 1 : product.inStockAmount
  },

  localTimezone (): string {
    return dayjs.tz.guess()
  },

  dateEst (value: string, format = 'MM/DD/YYYY HH:mm'): string {
    return dayjs.utc(value).tz('US/Eastern').format(format)
  },

  dateUtc (value: string, format = 'MM/DD/YYYY HH:mm'): string {
    return dayjs.utc(value).format(format)
  },

  dateTz (value: string, tz = 'local', format = 'MM/DD/YYYY HH:mm'): string {
    if (tz === 'local') {
      tz = this.localTimezone()
    }
    return dayjs(value).tz(tz).format(format)
  },

  fromNow (value: string | number | undefined): string {
    return dayjs(value).fromNow()
  },

  dateByUnix (value: number, format = 'MM/DD/YYYY HH:mm') {
    const timestamp = dayjs.unix(value)
    return timestamp.format(format)
  },

  secondsToDuration (seconds: number, format: string | undefined = 'HH:mm:ss'): string {
    const duration = dayjs.duration(seconds, 'seconds')
    if (format === 'relative' || duration.asHours() > 24) {
      return duration.humanize()
    }
    return `${duration.format(format)}`
  },

  dateToYMD (value: string): string {
    return dayjs(value).format('YYYY-MM-DD')
  },

  empty (data: any): boolean {
    return (!data || data === 'undefined' || data === '0' || (Array.isArray(data) && data.length === 0) || (Object.keys(data).length === 0))
  },

  money (value: number | string): string {
    if (typeof value === 'string') {
      value = parseFloat(value)
    }
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  },

  // deep copy of object
  clone (obj: object): object {
    return JSON.parse(JSON.stringify(obj))
  },

  filterApplied (filterBy: object, excepted: string[] = []): boolean {
    for (const [key, value] of Object.entries(filterBy)) {
      if (!(value === null || value === undefined || excepted.includes(key) || (Array.isArray(value) && value.length === 0))) {
        return true
      }
    }
    return false
  },

  async downloadAttachment (attachment: AttachmentModel | AttachmentInfo): Promise<void> {
    const url = await (new FileApi(api)).attachmentGetDownloadLink(attachment.id)
    window.open(url)
  },

  unknownErr (notify: any, desc = 'Unknown error') {
    notify({
      group: 'all',
      type: 'error',
      title: 'Error',
      text: desc
    })
  },

  /**
   * To output errors with dot (like attachment.0) and return all errors as array
   */
  getErrors (errResponseData: object): StringMapArr {
    const errors: any = {}
    Object.entries(errResponseData).forEach(([key, value]) => {
      const match = key.match(/(^[a-z]+)\.(\d+)$/)
      if (match) {
        const pr = match[1]
        if (errors[pr]) {
          errors[pr].push(value)
        } else {
          errors[pr] = [value]
        }
      } else if (errors[key]) {
        errors[key].push(value)
      } else {
        errors[key] = [value]
      }
    })

    return errors
  },

  objectCreateDotPath (obj: { [key: string]: any }, path: string, value: any): object {
    const keys = path.split('.')
    let i = 0
    for (i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!(key in obj)) {
        obj[key] = {} as { [key: string]: any }
      }
      obj = obj[key]
    }
    obj[keys[i]] = value
    return obj
  },

  getFirstErrors (errResponseData: object, alwaysIncludeFields: string[] = [], unPrefix: string | null = null): StringMap {
    const errorsArrays = this.getErrors(errResponseData)
    const errors: StringMap = {}

    for (const property in errorsArrays) {
      let destinationProperty = property
      if (unPrefix && property.startsWith(unPrefix)) {
        destinationProperty = property.substring(unPrefix.length + 1)
      }
      if (property.includes('.')) {
        this.objectCreateDotPath(errors, destinationProperty, this.getFirstElRecursive(errorsArrays[property]))
      } else {
        errors[destinationProperty] = this.getFirstElRecursive(errorsArrays[property])
      }
    }

    for (const field of alwaysIncludeFields) {
      if (!errors[field]) {
        errors[field] = null
      }
    }

    return errors
  },

  convertFirstValidationErrorToMessage (errResponseData: object): string {
    const firstErrorsMap = this.getFirstErrors(errResponseData) as Record<string, string>
    const firstKey = Object.keys(firstErrorsMap)[0]
    if (firstKey) {
      return firstKey + ' - ' + firstErrorsMap[firstKey]
    }
    return 'Unknown error'
  },

  unPrefixObject (obj: Record<string, string | string[]>, prefix: string): object {
    const unPrefixed: Record<string, string | string[]> = {}
    for (const key in obj) {
      unPrefixed[key.replace(prefix, '')] = obj[key]
    }
    return unPrefixed
  },

  getFirstElRecursive (arr: [][] | string[]): string {
    if (Array.isArray(arr[0])) {
      return this.getFirstElRecursive(arr[0])
    } else {
      return arr[0]
    }
  },

  parseObjectFromConstant (data: object): object[] {
    const result: any = []
    Object.entries(data).forEach(([key, value]) => {
      result.push({
        value: key,
        text: value
      })
    })
    return result
  },

  // todo rewrite this shit
  parse (data: object, withDivider = true): object[] {
    const result: any = []
    let first = true
    Object.entries(data).forEach(([header, items]) => {
      if (typeof items === 'string') {
        result.push({
          value: items,
          text: items
        })
      } else {
        if (withDivider) {
          result.push({
            header
          })

          if (!first) {
            result.push({
              divider: true
            })
          }
        }

        Object.entries(items).forEach(([text, value]) => {
          result.push({
            value,
            text
          })
        })
      }
      first = false
    })

    return result
  },

  formatPhone (phone: string): string {
    if (!phone) {
      return ''
    }
    return phone.replace(/\D/g, '').replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1($2)$3-$4')
  },

  isEmail (email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  },

  isPhone (phone: string): boolean {
    return /^\+?[0-9]{10,15}$/.test(phone)
  },

  customerAllowedToOrder (customer: CustomerModel, total: number, activeCustomerStatus: string): boolean {
    return total > 0 && customer.balance > 0 && customer.status === activeCustomerStatus && customer.balance >= total
  },

  updateObject (target: any, update: any) {
    for (const [key, value] of Object.entries(update)) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        if (['string', 'number', 'boolean'].includes(typeof value) || Array.isArray(value) || value === null || value === undefined) {
          target[key] = value
        } else {
          if (typeof value === 'object') {
            this.updateObject(target[key], value)
          }
        }
      }
    }
  }
}

export default boot(async ({ app }) => {
  app.config.globalProperties.$helper = helper
  // ^ ^ ^ this will allow you to use this.$helper (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
})

export { helper }
