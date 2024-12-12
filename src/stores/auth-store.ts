import { defineStore } from 'pinia'
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'
import { LocalStorage, Notify } from 'quasar'
import { api } from 'boot/axios'
import MemberModel from 'src/models/MemberModel'
import { constants } from 'boot/constants'
import BUS_EVENT from 'src/types/bus-events'
import { bus } from 'boot/bus'

const TOKEN_MAX_AGE = 3600
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30

const LS_REFRESH_TOKEN_KEY = 'refreshToken'
const LS_TOKEN_KEY = 'token'
const LS_TOKEN_EXPIRES_KEY = 'tokenExpiresAt'
const LS_USER_KEY = 'user'
const LS_REFRESH_TOKEN_EXPIRES_KEY = 'refreshTokenExpiresAt'

export const FEATURE_ACCESS_PAGE_REFUNDS = 'refund_accept'
export const FEATURE_ACCESS_PAGE_STAFF = 'staff_edit'
export const FEATURE_ACCESS_PAGE_CATALOG_SYNC = 'catalog_sync'
export const FEATURE_ACCESS_PAGE_CUSTOMERS = 'crm_customers'
export const FEATURE_ACCESS_PAGE_FACILITIES = 'crm_facilities'
export const FEATURE_ACCESS_PAGE_ORDERS = 'crm_orders'
export const FEATURE_ACCESS_PAGE_REPORTS = 'crm_reports'
export const FEATURE_ACCESS_PAGE_TARGETS = 'crm_targets'

export const FEATURE_ACCESS_PAGE_BROKERS = 'crm_brokers'

/**
 * The Auth store is used to manage the authentication state of the user.
 * It is used to store the user's token, refresh token, and user data.
 * It is also used to perform authentication actions such as login, logout, and refresh.
 *
 * Has a few sustainability features such as auto-refreshing the token when it expires or damaged.
 */
export const useAuthStore = () => {

  const store = defineStore('auth', {
    state: () => ({
      token: null as string | null,
      refreshToken: null as string | null,
      user: null as MemberModel | null
    }),

    getters: {
      isLoggedIn: (state) => state.user !== null,
      hasAccessFeature: (state) => (feature: string) => {
        if (state.user === null) {
          return false
        }
        if (!constants.FEATURES_ACCESS_ROLES[feature]) {
          return false
        }
        return constants.FEATURES_ACCESS_ROLES[feature].includes(state.user.role)
      },
      hasAccessProject: (state) => (projectDomain: string) => {
        if (!state.user || !state.user.allowedOrganizations) {
          return false
        }
        return state.user.allowedOrganizations.find((organization) => {
          if (organization.domainPrefix === projectDomain) {
            return true
          }
        }) !== undefined
      },
      accessToken: (state) => state.token
    },

    actions: {
      loadUserInfo () {
        // todo make it through repository
        return api.get('/crm/api/v2/member/info').then((response) => {
          this.user = response.data.user
          bus.emit(BUS_EVENT.AUTH_USER_INFO_LOADED, this.user)
        }
        ).catch(async (error) => {
          console.log(error)
        })
      },
      login (username: string, password: string) {
        return api.post('/api/login_check', {
          username,
          password
        }, <AxiosAuthRefreshRequestConfig>{ skipAuthRefresh: true })
          .then(async (response) => {
            this.token = response.data.token
            this.refreshToken = response.data.refresh_token

            this.authorizeApi()

            await this.loadUserInfo()

            this.saveAuthInfo()
          }
          ).catch((error) => {
            console.log(error)
            const message = error.response?.data?.message || 'Authentication failed'
            Notify.create(message)
          })
      },
      isAutologinAvailable () {
        return LocalStorage.has(LS_TOKEN_KEY) || LocalStorage.has(LS_REFRESH_TOKEN_KEY)
      },
      authorizeApi () {
        api.interceptors.request.use((config) => {
          config.headers.Authorization = `Bearer ${this.token}`
          return config
        })
      },
      renewToken () {
        return api.post('/api/ajax/token/refresh', {
          refresh_token: this.refreshToken
        }, <AxiosAuthRefreshRequestConfig>{ skipAuthRefresh: true })
          .then((response) => {
            this.token = response.data.token
            this.refreshToken = response.data.refresh_token

            this.authorizeApi()

            this.saveAuthInfo()

            return response
          }).catch((error) => {
            console.log(error)
            if (error.response.status === 401) {
              this.logout()
            }
          })
      },
      logout () {
        this.token = null
        this.refreshToken = null
        this.user = null

        LocalStorage.remove(LS_TOKEN_KEY)
        LocalStorage.remove(LS_REFRESH_TOKEN_KEY)
        LocalStorage.remove(LS_USER_KEY)

        this.router.push('/login')
      },
      saveAuthInfo () {
        LocalStorage.set(LS_TOKEN_KEY, this.token)
        LocalStorage.set(LS_REFRESH_TOKEN_KEY, this.refreshToken)
        LocalStorage.set(LS_USER_KEY, this.user)
        LocalStorage.set(LS_TOKEN_EXPIRES_KEY, Date.now() + TOKEN_MAX_AGE * 1000)
        LocalStorage.set(LS_REFRESH_TOKEN_EXPIRES_KEY, Date.now() + REFRESH_TOKEN_MAX_AGE * 1000)
      },
      restoreAuthInfo () {
        this.token = LocalStorage.getItem(LS_TOKEN_KEY)
        this.refreshToken = LocalStorage.getItem(LS_REFRESH_TOKEN_KEY)
        this.user = LocalStorage.getItem(LS_USER_KEY)
        const tokenExpiresAt = LocalStorage.getItem(LS_TOKEN_EXPIRES_KEY)
        const refreshTokenExpiresAt = LocalStorage.getItem(LS_REFRESH_TOKEN_EXPIRES_KEY)
        if (tokenExpiresAt && Date.now() > tokenExpiresAt) {
          this.token = null
        }
        if (refreshTokenExpiresAt && Date.now() > refreshTokenExpiresAt) {
          this.refreshToken = null
        }
        if (this.token && this.refreshToken) {
          this.authorizeApi()

          this.loadUserInfo()
            .catch((error) => {
              console.log(error)
            })
        } else if (!this.token && !this.refreshToken) {
          this.logout()
        }
      }
    }
  })

  const s = store()
  if (!s.isLoggedIn && s.isAutologinAvailable()) {
    s.restoreAuthInfo()
  }
  return s
}
