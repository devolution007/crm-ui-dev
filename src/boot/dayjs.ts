import { boot } from 'quasar/wrappers'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc' // import plugin
import timezone from 'dayjs/plugin/timezone' // import plugin
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en' // import locale

dayjs.extend(utc) // use plugin
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(duration)

dayjs.locale('en') // use locale

export default boot(async ({ app }) => {
  app.config.globalProperties.$dayjs = dayjs
  // ^ ^ ^ this will allow you to use this.$dayjs (for Vue Options API form)
  //       so you won't necessarily have to import dayjs in each vue file
})

export { dayjs }
