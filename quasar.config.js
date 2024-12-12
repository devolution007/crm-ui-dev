/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js
const { execSync } = require('child_process')
const { configure } = require('quasar/wrappers')
const path = require('path')

// This will load from `.env` if it exists, but not override existing `process.env.*` values
require('dotenv').config()

module.exports = configure(async function (/* ctx */) {
  const serverConstants = await loadServerConstants()

  const versionInfo = loadVersionInfo()

  return {
    eslint: {
      // fix: true,
      // include = [],
      // exclude = [],
      // rawOptions = {},
      warnings: true,
      errors: false
    },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: [
      'bus',
      'i18n',
      'dayjs',
      'helper',
      'axios',
      'constants',
      'hotkeys',
      'version'
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: [
      'app.scss'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
      'material-symbols-outlined'
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16'
      },

      vueRouterMode: 'history', // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,
      env: {
        API_URL: process.env.API_URL,
        serverConstants: JSON.stringify(serverConstants),
        versionTag: versionInfo.tag,
        versionCommit: versionInfo.commit,
        versionDate: versionInfo.date
      },
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      extendViteConf (viteConf) {
        viteConf.build.cssCodeSplit = false
        // viteConf.build.manifest = true
      },
      // viteVuePluginOptions: {},

      vitePlugins: [
        ['@intlify/vite-plugin-vue-i18n', {
          // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
          // compositionOnly: false,

          // if you want to use named tokens in your Vue I18n messages, such as 'Hello {name}',
          // you need to set `runtimeOnly: false`
          runtimeOnly: false,

          // you need to set i18n resource including paths !
          include: path.resolve(__dirname, './src/i18n/**')
        }],
        ['unplugin-vue-components/vite', {
          // generate `components.d.ts` global declarations,
          // also accepts a path for custom filename
          // default: `true` if package typescript is installed
          dts: true,

          // Allow subdirectories as namespace prefix for components.
          directoryAsNamespace: true
        }]
      ]
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true
      open: true // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        notify: { /* look at QuasarConfOptions from the API card */ },
        loadingBar: { /* look at QuasarConfOptions from the API card */ },
        loading: { /* look at QuasarConfOptions from the API card */ }
      },

      iconSet: 'material-symbols-outlined', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [
        'LocalStorage',
        'Notify',
        'LoadingBar',
        'Dialog',
        'Meta',
        'BottomSheet',
        'Loading'
      ]
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [
      'fadeIn',
      'fadeOut',
      'fadeInDown',
      'fadeInUp',
      'fadeInLeft',
      'fadeOutLeft',
      'fadeOutDown',
      'fadeOutUp'
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        'render' // keep this as last one
      ]
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'generateSW', // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false
      // useFilenameHashes: true,
      // extendGenerateSWOptions (cfg) {}
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,

      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'crm-ui'
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: [
        'my-content-script'
      ]

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    }
  }
})

async function loadServerConstants () {
  if (!process.env.PREBUILD_CONSTANTS_FROM_URL) {
    return null
  }
  console.log('Loading constants for build from', process.env.PREBUILD_CONSTANTS_FROM_URL)
  const axios = require('axios')
  const axiosConfig = {}
  if (process.env.PREBUILD_PROXY) {
    console.log(`(using proxy: ${process.env.PREBUILD_PROXY})`)
    const url = new URL(process.env.PREBUILD_PROXY)
    axiosConfig.proxy = {
      protocol: url.protocol.replace(':', ''),
      host: url.hostname,
      port: url.port
    }
  }
  try {
    const serverConstantsResponse = await axios.get(process.env.PREBUILD_CONSTANTS_FROM_URL, axiosConfig)
    if (serverConstantsResponse.status !== 200) {
      console.error('Failed to load constants')
      return null
    }

    const serverConstants = serverConstantsResponse.data

    console.log(`Loaded ${Object.keys(serverConstants).length} constants`)
    return serverConstants
  } catch (e) {
    console.error(`Failed to load constants: ${e.message} (${e.code})`)
  }
  return null
}

function loadVersionInfo () {
  let tag = 'unknown'
  let commit = 'unknown'
  const date = Date.now()

  try {
    // Getting the latest tag
    tag = execSync('git describe --abbrev=0 --tags').toString().trim()
    // Getting the latest commit hash
    commit = execSync('git rev-parse --short HEAD').toString().trim()
    console.log(`Building version ${tag} (${commit})`)
  } catch (e) {
    console.warn(`Failed to load version info: ${e.message}`)
  }

  return {
    tag,
    commit,
    date
  }
}
