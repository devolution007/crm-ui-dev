import { boot } from 'quasar/wrappers'
import {
  createI18n,
  FallbackLocale,
  I18nOptions
} from 'vue-i18n'
import { LocalStorage, Quasar } from 'quasar'

import messages from 'src/i18n'

export type MessageLanguages = keyof typeof messages;
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = typeof messages['en-US'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    I18nT: typeof import('vue-i18n/dist/vue-i18n')['Translation']
  }
}

/* eslint-enable @typescript-eslint/no-empty-interface */
const defaultLocale = 'en-US'// as MessageLanguages
const autoDetectedLocale = Quasar.lang.getLocale()// as MessageLanguages || defaultLocale
let userLocale: string | undefined = String(LocalStorage.getItem('locale') || autoDetectedLocale)

if (!messages[userLocale] && userLocale.includes('-')) {
  userLocale = userLocale.split('-')[0]// as MessageLanguages
}

if (!userLocale || !messages[userLocale]) {
  userLocale = defaultLocale
}

export default boot(({ app }) => {
  const options: I18nOptions = {
    locale: userLocale as string,
    fallbackLocale: defaultLocale as FallbackLocale,
    globalInjection: true,
    legacy: false,
    messages
  }

  const i18n = createI18n<false, typeof options>(options)

  // Set i18n instance on app
  app.use(i18n)
})
