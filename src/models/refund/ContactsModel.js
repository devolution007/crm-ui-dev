import EmailModel from '../EmailModel'
import PhoneModel from '../PhoneModel'
import AddressModel from '../AddressModel'

class ContactsModel {
  emails = []
  phonesForSMS = []
  phonesForCalls = []
  addresses = []

  constructor (emails, phones, addresses) {
    for (let i = 0; i < emails.length; i++) {
      this.emails.push(new EmailModel(emails[i]))
    }
    const phoneModels = phones.map(item => new PhoneModel(item))

    this.phonesForCalls = phoneModels.filter(item => item.isAvailableCalls)
    this.phonesForSMS = phoneModels.filter(item => item.isAvailableSms)
    this.emails = emails.map(item => new EmailModel(item)).filter(item => item.isValid && item.allowMarketing)
    this.addresses = addresses.map(item => new AddressModel(item)).filter(address => address.isValid && !address.isDeleted)
  }
}

export default ContactsModel
