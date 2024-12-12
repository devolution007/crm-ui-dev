import { boot } from 'quasar/wrappers'

interface AppVersion {
  tag: string
  commit: string
  date: string
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $version: AppVersion;
  }
}

const version: AppVersion = {
  tag: process.env.versionTag as string,
  commit: process.env.versionCommit as string,
  date: process.env.versionDate as string
}

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$version

  app.config.globalProperties.$version = version
  // ^ ^ ^ this will allow you to use this.$version (for Vue Options API form)
  //       so you won't necessarily have to import version in each vue file
})

export { version }
