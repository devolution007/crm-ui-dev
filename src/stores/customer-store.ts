import { defineStore } from 'pinia'

import { constants } from 'src/boot/constants'
import { api } from 'boot/axios'

import CustomerApi from 'src/api/CustomerApi'
import CustomerModel from 'src/models/CustomerModel'
import PhoneModel from 'src/models/PhoneModel'
import LanguageModel from 'src/models/LanguageModel'
import EmailModel from 'src/models/EmailModel'
import AddressModel from 'src/models/AddressModel'
import { PaymentProcessorCode, SelectOption } from 'src/types'
import CartItemInterface from 'src/models/CartItem'
import { useCartStore } from 'stores/cart-store'
import { EmailAddDto } from 'src/models/customer/EmailAddDto'
import { EmailEditDto } from 'src/models/customer/EmailEditDto'
import { useInsuranceCardsStore } from 'stores/insurance-cards-store'
import { computed, ComputedRef, watch } from 'vue'
import { PhoneInterface } from 'src/models/Phone'
import { Feature } from 'src/models/Features'
import { Dialog } from 'quasar'
import ListEditDialog from 'components/customer/insurance-card/ListEditDialog.vue'
import { CustomerNoteInput, CustomerNotePatch } from 'src/models/NoteModelShort'
import NoteEditDialog from 'components/customer/notes/NoteEditDialog.vue'
import NoteApi from 'src/api/NoteApi'
import useVirtualTempCard from 'src/composables/useVirtualTempCard'

const isCustomerHasFeature = (customer: CustomerModel, feature: Feature) => {
  const featuresByOrgDomainPrefix: Record<string, Feature[]> = {
    cca: ['creditBalance', 'faxOrders', 'memberInfo'],
    shop: ['insuranceCards', 'insuranceInfo'],
    metro: ['trnsxMethod', 'insuranceCards', 'insurancePlans', 'nationsMethod']
  }

  const orgDomainPrefix = customer.organization?.domainPrefix
  if (!orgDomainPrefix || !featuresByOrgDomainPrefix[orgDomainPrefix]) return false
  return featuresByOrgDomainPrefix[orgDomainPrefix].includes(feature) ?? false
}

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    isFetching: false,
    customer: new CustomerModel(),
    id: 0
  }),

  getters: {
    isReady (state) {
      return state.customer.id !== 0 && !state.isFetching && state.customer.id === state.id
    },
    cart: (state): CartItemInterface[] => state.customer.cart ?? [],
    validPhones: (state) : PhoneInterface[] => state.customer.phones.filter((phone: PhoneInterface) => !!phone.isValid) ?? [],
    phones: (state) : PhoneInterface[] => state.customer.phones,
    emails: (state) : EmailModel[] => state.customer.emails,
    primaryLanguageCode: (state): string => {
      const result: any = state.customer.languages.filter((item: LanguageModel) => item.type === constants?.PRIMARY_LANGUAGE_NAME)
      return result?.length ? result[0].iso : constants?.DEFAULT_LANGUAGE_ISO
    },
    primaryLanguage (): LanguageModel | undefined | null {
      return constants ? constants.LANGUAGES.find((item: LanguageModel) => item.iso === this.primaryLanguageCode) : null
    },
    addresses: (state) : AddressModel[] => state.customer.addresses ?? [],
    undeletedAddresses: (state) : AddressModel[] => state.customer?.addresses?.filter((item: AddressModel) => !item.deleted) ?? [],
    hasFeature: (state) => {
      return (feature: Feature): boolean => {
        return isCustomerHasFeature(state.customer, feature)
      }
    },
    unifiedBalance (state): number {
      let balance = 0
      if (this.hasFeature('creditBalance')) {
        balance = state.customer.balance
      }
      if (this.hasFeature('insuranceCards')) {
        const cardsStore = useInsuranceCardsStore()
        balance += cardsStore.activeCardBalance
      }
      if (this.hasFeature('trnsxMethod')) {
        const { virtualTempBalance } = useVirtualTempCard(state.id)
        balance += virtualTempBalance.value
      }
      // if (this.hasFeature('nationsMethod')) {
      //   const { virtualTempBalance } = useVirtualTempCard(state.id)
      //   balance += virtualTempBalance.value
      // }
      return balance
    },
    paymentProcessorsAvailableCodes (): PaymentProcessorCode[] {
      const availCodes: PaymentProcessorCode[] = []
      if (this.id === 0 || this.customer.id === 0) return availCodes
      if (this.hasFeature('creditBalance')) {
        availCodes.push('credit')
      }
      if (this.hasFeature('insuranceCards')) {
        availCodes.push('prohealth')
      }
      if (this.hasFeature('trnsxMethod')) {
        availCodes.push('trnsx')
      }
      if (this.hasFeature('nationsMethod')) {
        availCodes.push('nationsbenefits')
      }
      return availCodes
    },
    paymentProcessorsAvailableOptions (): SelectOption[] {
      return constants.PAYMENT_PROCESSORS.map((method) => ({
        label: method.label,
        value: method.code
      })).filter((method) => this.paymentProcessorsAvailableCodes.includes(method.value))
    },
    cardStyle (): object {
      if (!this.isReady || !this.customer.color) {
        return {}
      }
      const cardColors: {
        [key: string]: string
      } = {
        green: 'rgba(75,169,78,0.6)',
        red: 'rgba(255,0,0,0.6)',
        gray: 'rgba(128,128,128,0.25)',
        grey: 'rgba(128,128,128,0.25)',
        brown: 'rgba(218,146,107,0.65)',
        orange: 'rgba(245,146,10,0.7)',
        'dark grey': 'rgba(97, 97, 97, 0.8)',
        blue: 'rgba(0,140,255,0.6)'
      }
      if (!cardColors[this.customer.color]) {
        return {}
      }
      return {
        outline: '3px solid ' + cardColors[this.customer.color]
      }
    }
  },

  actions: {

    async init (id: number): Promise<CustomerModel> {
      if (this.id === id) {
        return new Promise((resolve) => {
          this.whenReady(() => {
            resolve(this.customer)
          })
        })
      }

      this.clearFetchedData()
      this.id = id

      return new Promise((resolve) => {
        this.getCustomer(id)
          .finally()
        this.whenReady(() => {
          resolve(this.customer)
        })
      })
    },
    whenReady (callback: () => void) {
      if (this.isReady) {
        callback()
      } else {
        const watcherStop = watch(() => this.isReady, (isReady) => {
          if (isReady) {
            watcherStop()
            callback()
          }
        })
      }
    },
    async getCustomer (id: number): Promise<CustomerModel> {
      this.isFetching = true
      this.id = id

      const cardsStore = useInsuranceCardsStore()
      cardsStore.loadInsuranceCards(id).finally()

      const customer = await (new CustomerApi(api)).getCustomer(id)
      this.customer = customer
      this.isFetching = false
      return customer
    },
    getCustomerLazy (id: ComputedRef<number>) {
      return computed(() => {
        if (this.customer.id === id.value) {
          return this.customer
        }
        if (!(this.isFetching && this.id === id.value)) {
          this.getCustomer(id.value)
            .finally()
        }

        return new CustomerModel()
      })
    },
    getLoadingComputed () {
      return computed(() => {
        return this.isFetching
      })
    },
    clearFetchedData () {
      this.customer = new CustomerModel()
    },
    async addEmail ({ email }: {email: EmailAddDto}) {
      const emailData = await (new CustomerApi(api)).addEmail(email, this.customer.id)
      this.customer.emails = [...this.customer.emails, emailData]
      return emailData
    },
    async editEmail ({ emailId, email }: {emailId: number, email: EmailEditDto}) {
      const emails = await (new CustomerApi(api)).editEmail(emailId, email, this.customer.id)
      this.customer.emails = emails
      return emails
    },
    async removeEmail (emailId: number) {
      const emails = await (new CustomerApi(api)).removeEmail(emailId, this.customer.id)
      this.customer.emails = emails
      return emails
    },
    async editName ({ firstName, lastName, customerId }: {firstName: string, lastName:string, customerId: number}) {
      const customer = await (new CustomerApi(api)).editName(firstName, lastName, customerId)
      this.customer = customer
      return customer
    },
    async editColor ({ color, customerId }: {color: string, customerId: number}) {
      const updatedCustomer = await (new CustomerApi(api)).editColor(color, customerId)
      this.customer.color = updatedCustomer.color
      this.customer.colorHint = updatedCustomer.colorHint
      return updatedCustomer
    },
    async editPlan ({ plan, customerId }: {plan: number, customerId: number}) {
      const updatedCustomer = await (new CustomerApi(api)).editPlan(plan, customerId)
      this.customer.insurancePlan = updatedCustomer.insurancePlan
      return updatedCustomer
    },
    async editRepresentative ({ representative, customerId }: {representative: number, customerId: number}) {
      const updatedCustomer = await (new CustomerApi(api)).editRepresentative(representative, customerId)
      this.customer.member = updatedCustomer.member
      return updatedCustomer
    },
    async addTag ({ tagId, customerId }: {tagId: number, customerId: number}) {
      const tags = await (new CustomerApi(api)).addTag(tagId, customerId)
      this.customer.tags = tags
      return tags
    },
    async removeTag ({ tagId, customerId }: {tagId: number, customerId: number}) {
      const tags = await (new CustomerApi(api)).removeTag(tagId, customerId)
      this.customer.tags = tags
      return tags
    },
    async editGender ({ gender, customerId }: {gender: string, customerId: number}) {
      const customer = await (new CustomerApi(api)).editGender(gender, customerId)
      this.customer = customer
      return customer
    },
    async editBirthdate ({ birthdate, customerId }: {birthdate: string, customerId: number}) {
      const customer = await (new CustomerApi(api)).editBirthdate(birthdate, customerId)
      this.customer = customer
      return customer
    },
    async editLanguage ({ language, customerId, type }: {language: string, customerId: number, type: string}) {
      const languagesFresh = await (new CustomerApi(api)).editLanguage(language, customerId, type)
      this.customer.languages = languagesFresh
      return languagesFresh
    },
    async removeLanguage ({ language, customerId }: {language: string, customerId: number}) {
      await (new CustomerApi(api)).removeLanguage(language, customerId)
      this.customer.languages = this.customer.languages.filter((lang: LanguageModel) => lang.iso !== language)
    },
    async addPhone ({ phone, customerId }: {phone: PhoneInterface, customerId: number}) {
      const phoneData = await (new CustomerApi(api)).addPhone(phone, customerId)
      this.customer.phones = [...this.customer.phones, phoneData]
      return phoneData
    },
    async editPhone ({ phone }: {phone: PhoneModel}) {
      const phoneData = await (new CustomerApi(api)).editPhone(phone, this.customer.id)
      const index = this.customer.phones.findIndex((phone: PhoneInterface) => phone.id === phoneData.id)
      this.customer.phones.splice(index, 1, phoneData)
      return phoneData
    },
    async removePhone (id: number, customerId: number) {
      await (new CustomerApi(api)).removePhone(id, customerId)
      this.customer.phones = this.customer.phones.filter((phone: PhoneInterface) => phone.id !== id)
    },
    async addAddress ({ address }: {address: AddressModel}) {
      const addressNew = await (new CustomerApi(api)).addAddress(address, this.customer.id)
      this.customer.addresses = [...this.customer.addresses, addressNew]
    },
    async editAddress ({ address }: {address: AddressModel}) {
      const addressUpd = await (new CustomerApi(api)).editAddress(address, this.customer.id)
      await this.updateAddressEntry(addressUpd)
    },
    async updateAddressEntry (address: AddressModel) {
      const index = this.customer.addresses.findIndex((addressExists: AddressModel) => addressExists.id === address.id)
      this.customer.addresses.splice(index, 1, address)
    },
    async removeAddress ({ id }: {id: string}) {
      const removedAddress = await (new CustomerApi(api)).removeAddress(id, this.customer.id)
      const index = this.customer.addresses.findIndex((addressExists: AddressModel) => addressExists.id === removedAddress.id)
      this.customer.addresses.splice(index, 1, removedAddress)

      const cart = useCartStore()

      // we cannot remain shippingAddressId if this address was deleted
      if (cart.shippingAddressId === id) {
        cart.shippingAddressId = null
      }
      return removedAddress
    },
    async undeleteAddress ({ id }: {id: string}) {
      const undeletedAddress = await (new CustomerApi(api)).undeleteAddress(id, this.customer.id)
      await this.updateAddressEntry(undeletedAddress)
      return undeletedAddress
    },
    async makeAddressValid ({ addressId }: {addressId: string}) {
      const address = await (new CustomerApi(api)).makeAddressValid(addressId, this.customer.id)
      await this.updateAddressEntry(address)
      return address
    },
    async makeAddressInvalid ({ addressId }: {addressId: string}) {
      const address = await (new CustomerApi(api)).makeAddressInvalid(addressId, this.customer.id)
      await this.updateAddressEntry(address)
      return address
    },
    async openInsuranceCardsEditDialog (callAdd = false) {
      return Dialog.create({
        component: ListEditDialog,
        componentProps: {
          customer: this.customer,
          callAdd
        }
      })
    },
    async editNote (noteId: number, note: CustomerNotePatch) {
      await (new NoteApi(api)).patchNote(noteId, note, this.customer.id)
      await this.getCustomer(this.customer.id)
    },
    async addNote (note: CustomerNoteInput) {
      await (new NoteApi(api)).addNote(note, this.customer.id)
      await this.getCustomer(this.customer.id)
    },
    async openAddNoteDialog (customerId?: number) {
      return Dialog.create({
        component: NoteEditDialog,
        componentProps: {
          customerId: customerId || this.customer.id
        }
      })
    },
    isCustomerHasFeature
  }
})
