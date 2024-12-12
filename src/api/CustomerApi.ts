import qs from 'qs'
import Api from 'src/api/Api'
import CustomerModel, { CustomerInputInterface, CustomerInputMetro } from 'src/models/CustomerModel'
import EmailModel from 'src/models/EmailModel'
import PhoneModel from 'src/models/PhoneModel'
import TagModel from 'src/models/TagModel'
import LanguageModel, { LangData } from 'src/models/LanguageModel'
import AddressModel, { AddressModelAbstract } from 'src/models/AddressModel'
import { CustomerList, CustomersFilter } from 'src/types/index'
import CartItemInterface from 'src/models/CartItem'
import { EmailAddDto } from 'src/models/customer/EmailAddDto'
import { EmailEditDto } from 'src/models/customer/EmailEditDto'
import { helper } from 'boot/helper'
import { SortBy } from 'src/types'
import { PhoneInterface } from 'src/models/Phone'
import { TimelineEntry, TimelineFilter, TimelineList } from 'src/models/Timeline'

class CustomerApi extends Api {
  protected getCart (customerId: number): CartItemInterface[] {
    const cart = localStorage.getItem(`cart${customerId}`)
    return cart ? JSON.parse(cart) : []
  }

  async getCustomer (id: number): Promise<CustomerModel> {
    const customer = (await this.axios.get('/crm/api/v2/customer/info', { params: { id } })).data
    // add cart from local storage
    customer.cart = this.getCart(customer.id)
    return new CustomerModel(customer)
  }

  async editName (firstName: string, lastName: string, customerId: number): Promise<CustomerModel> {
    const data = qs.stringify({
      id: customerId,
      first_name: firstName,
      last_name: lastName
    })

    const customer = (await this.axios.post('/crm/api/v2/customer/update-data', data)).data
    return new CustomerModel(customer)
  }

  async editColor (color: string, customerId: number): Promise<CustomerModel> {
    const data = qs.stringify({
      id: customerId,
      color
    })
    const customer = (await this.axios.post('/crm/api/v2/customer/update-data', data)).data
    return new CustomerModel(customer)
  }

  async editGender (gender: string, customerId: number): Promise<CustomerModel> {
    const data = qs.stringify({
      id: customerId,
      gender
    })
    const customer = (await this.axios.post('/crm/api/v2/customer/update-data', data)).data
    return new CustomerModel(customer)
  }

  async editBirthdate (birthdate: string, customerId: number): Promise<CustomerModel> {
    const data = qs.stringify({
      id: customerId,
      birthdate
    })
    console.log({
      id: customerId,
      birthdate
    })
    const customer = (await this.axios.post('/crm/api/v2/customer/update-data', data)).data
    return new CustomerModel(customer)
  }

  async editPlan (plan: number, customerId: number): Promise<CustomerModel> {
    const data = qs.stringify({
      id: customerId,
      plan
    })
    const customer = (await this.axios.post('/crm/api/v2/customer/update-data', data)).data
    return new CustomerModel(customer)
  }

  async editRepresentative (representative: number, customerId: number): Promise<CustomerModel> {
    const data = qs.stringify({
      id: customerId,
      representative
    })
    const customer = (await this.axios.post('/crm/api/v2/customer/update-data', data)).data
    return new CustomerModel(customer)
  }

  async removeLanguage (language: string, customerId: number): Promise<void> {
    const data = qs.stringify({
      customerId,
      language
    })
    await this.axios.post('/crm/api/v2/customer/language/remove', data)
  }

  async editLanguage (language: string, customerId: number, type: string): Promise<LanguageModel[]> {
    const data = qs.stringify({
      customerId,
      type,
      language
    })
    const langs = (await this.axios.post('/crm/api/v2/customer/language/update', data)).data
    return langs.map((lang: LangData) => new LanguageModel(lang))
  }

  async addEmail (email: EmailAddDto, customerId: number) {
    const emailData = (await this.axios.post(`/crm/api/v2/customer/${customerId}/email/add`, email)).data
    return new EmailModel(emailData)
  }

  async editEmail (emailId: number, email: EmailEditDto, customerId: number) {
    const emails = (await this.axios.put(`/crm/api/v2/customer/${customerId}/email/${emailId}/update`, email)).data
    return emails.map((email: any) => new EmailModel(email))
  }

  async removeEmail (emailId: number, customerId: number) {
    const emails = (await this.axios.delete(`/crm/api/v2/customer/${customerId}/email/${emailId}/remove`)).data
    return emails.map((email: any) => new EmailModel(email))
  }

  async addTag (tagId: number, customerId: number) {
    const tags = (await this.axios.post(`/crm/api/v2/customer/${customerId}/add-tag`, { tagId })).data
    return tags.map((tag: any) => new TagModel(tag))
  }

  async removeTag (tagId: number, customerId: number) {
    const tags = (await this.axios.delete(`/crm/api/v2/customer/${customerId}/remove-tag/${tagId}`)).data
    return tags.map((tag: any) => new TagModel(tag))
  }

  async addPhone (phone: PhoneInterface, customerId: number): Promise<PhoneInterface> {
    const data = this.removeEmptyFields({
      callType: phone.callType || null,
      number: phone.phone.replace(/\D/g, ''),
      type: phone.type || null,
      is_valid: phone.isValid || true,
      is_available_calls: phone.isAvailableCalls || true,
      is_available_sms: phone.isAvailableSms || true
    })

    const phoneData = (await this.axios.post(`/crm/api/v2/customer/${customerId}/phone/add`, data)).data
    return new PhoneModel(phoneData)
  }

  async editPhone (phone: PhoneInterface, customerId: number): Promise<PhoneInterface> {
    const data = this.removeEmptyFields({
      callType: phone.callType || null,
      number: phone.phone.replace(/\D/g, ''),
      type: phone.type,
      is_valid: phone.isValid,
      is_available_calls: phone.isAvailableCalls,
      is_available_sms: phone.isAvailableSms
    })

    const phoneData = (await this.axios.put(`/crm/api/v2/customer/${customerId}/phone/${phone.id}/update`, data)).data
    return new PhoneModel(phoneData)
  }

  async removePhone (id: number, customerId: number): Promise<void> {
    await this.axios.delete(`/crm/api/v2/customer/${customerId}/phone/${id}/remove`)
  }

  async getCustomers (
    page: number,
    perPage: number,
    sortBy: SortBy,
    filterBy: CustomersFilter
  ): Promise<CustomerList> {
    const params = this.purgeParams(page, perPage, filterBy, sortBy)
    const {
      items,
      totalItemCount,
      totalPages
    } = (await this.axios.get('/crm/api/v2/customer/list', { params })).data
    return {
      items: items.map((item: CustomerModel) => new CustomerModel(item)),
      totalItemCount,
      totalPages
    }
  }

  async addAddress (address: AddressModel, customerId: number): Promise<AddressModel> {
    const data = new AddressModelAbstract(helper.clone(address) as AddressModel)
    const addedAddress = (await this.axios.post(`/crm/api/v2/customer/${customerId}/address`, data)).data
    return new AddressModel(addedAddress)
  }

  async editAddress (address: AddressModel, customerId: number): Promise<AddressModel> {
    const data = helper.clone(address) as AddressModel
    const editedAddress = (await this.axios.put(`/crm/api/v2/customer/${customerId}/address/${address.id}`, data)).data
    return new AddressModel(editedAddress)
  }

  async removeAddress (id: string, customerId: number): Promise<AddressModel> {
    const address = (await this.axios.delete(`/crm/api/v2/customer/${customerId}/address/${id}`)).data
    return new AddressModel(address)
  }

  async undeleteAddress (id: string, customerId: number): Promise<AddressModel> {
    const address = (await this.axios.patch(`/crm/api/v2/customer/${customerId}/address/${id}/restore`)).data
    return new AddressModel(address)
  }

  async makeAddressValid (id: string, customerId: number): Promise<AddressModel> {
    const address = (await this.axios.patch(`/crm/api/v2/customer/${customerId}/address/${id}/validate`)).data
    return new AddressModel(address)
  }

  async makeAddressInvalid (id: string, customerId: number): Promise<AddressModel> {
    const address = (await this.axios.patch(`/crm/api/v2/customer/${customerId}/address/${id}/invalidate`)).data
    return new AddressModel(address)
  }

  async createPhcCustomer (data: CustomerInputInterface): Promise<CustomerModel> {
    const createdCustomer = (await this.axios.post('/crm/api/v2/customer/phc', data)).data
    return new CustomerModel(createdCustomer)
  }

  async createMetroCustomer (data: CustomerInputMetro): Promise<CustomerModel> {
    const createdCustomer = (await this.axios.post('/crm/api/v2/customer/metro', data)).data
    return new CustomerModel(createdCustomer)
  }

  async getTimelineList (
    customerId: number,
    page: number,
    filterBy: TimelineFilter,
    sortBy: SortBy,
    perPage = 25
  ): Promise<TimelineList> {
    const params = {
      page,
      perPage,
      filterBy: this.removeEmptyFields(filterBy),
      sortBy
    }
    const {
      items,
      totalPages,
      totalItemCount
    } = (await this.axios.get(`/crm/api/v2/customer/${customerId}/timeline`, { params })).data
    return {
      totalPages,
      items: items.map((item: TimelineEntry) => item),
      totalItemCount
    }
  }

  // async findCustomer (identification: string, birthdate: string | null = null) {
  //   const params = {
  //     params: {
  //       identification,
  //       birthdate
  //     }
  //   }
  //   const customers = (await this.axios.get('/csr/api/ajax/call/call-list-filtered', params)).data
  //   return customers?.map((item: any) => new CustomerModel(item)) ?? []
  // }

  // async identifyCustomer (id: number) {
  //   const customer = (await this.axios.get(`/csr/api/ajax/customer/identify/${id}`)).data
  //   return new CustomerModel(customer)
  // }

  // async unlockCustomer (id: number) {
  //   const customer = (await this.axios.get(`/csr/api/ajax/customer/unlock/${id}`)).data
  //   return new CustomerModel(customer)
  // }
}

export default CustomerApi
