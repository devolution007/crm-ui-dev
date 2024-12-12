import { boot } from 'quasar/wrappers'
import ConstantApi from 'src/api/ConstantApi'
import { api } from 'boot/axios'

import type { Constant } from 'src/types'
import { Loading } from 'quasar'
import axios, { AxiosError } from 'axios'
import { App } from 'vue'
import { FRONT_CONSTANTS } from 'components/front-constants'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $constants: Constant
  }
}

const constants = <Constant>{}

/**
 * There is a few ways to get constants:
 *
 * 1. Get constants from Vue component:
 * this.$constants.MY_CONSTANT
 *
 * 2. Directly from constants.ts:
 * import { constants } from 'src/boot/constants'
 * constants.MY_CONSTANT
 */

const dataToConstants = (app: App, data: Constant) => {
  data = { ...data, ...FRONT_CONSTANTS }
  Object.assign(constants, data)
  app.config.globalProperties.$constants = data
}

export default boot(async ({ app }) => {
  let loadedFromEnv = false
  if (process.env.serverConstants) {
    const preBuildConstants = JSON.parse(process.env.serverConstants) as Constant | null
    if (preBuildConstants) {
      dataToConstants(app, preBuildConstants)
      loadedFromEnv = true
    }
  }

  if (loadedFromEnv) {
    return
  }

  try {
    Loading.show()
    const data = await (new ConstantApi(api)).getConstants()
    dataToConstants(app, data)
    Loading.hide()
  } catch (e: unknown | AxiosError) {
    console.error(e)
    /**
     * Display a full screen error instead of the application
     * it is impossible to continue without reloading the page (failed to retrieve key data)
     */
    window.document.body.innerHTML = ''
    window.document.body.classList.add('q-pa-md')
    window.document.body.insertAdjacentHTML('beforeend', '<p>Fatal Error: Unable to start CRM App.<br> <strong>Reload page to try again.</strong></p>')
    window.document.body.insertAdjacentHTML('beforeend', '<p>If the error persists, please contact the development team. Thank you for your patience.</p><p></p>')
    const details = ['Technical details: \nCannot load constants from server.']
    if (e instanceof Error) {
      details.push('Error: ' + e.message)
    }

    if (axios.isAxiosError(e)) {
      const err = e as AxiosError
      if (err.config !== undefined) {
        details.push('URL: ' + err.config.url)
        details.push('Base URL: ' + err.config.baseURL)
      }
    }

    details.push('User agent: ' + window.navigator.userAgent)
    details.push('URL: ' + window.location.href)
    details.push('Local time: ' + new Date().toLocaleString())
    window.document.body.insertAdjacentHTML('beforeend', '<pre>' + details.join('\n') + '</pre>')
    window.document.body.insertAdjacentHTML('beforeend', '<p></p>')
    window.document.body.insertAdjacentHTML('beforeend', '<a class="q-mr-md q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-primary text-white q-btn--actionable q-focusable q-hoverable q-btn--active" href="javascript:window.location.reload()">Reload page</a>')
    window.document.body.insertAdjacentHTML('beforeend', '<a target="_blank" class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle text-primary q-btn--actionable q-focusable q-hoverable q-btn--active" href="https://betteruptime.com/report/LbZNcgiTx4VpTiL1pwN9AcN9">Report the problem</a>')
  }
})

export { constants }
