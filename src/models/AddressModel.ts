export class AddressDto {
  addressOptionalString = ''
  addressString = ''
  city = ''
  firstName = ''
  lastName = ''
  note = ''
  phone = ''
  state = ''
  zipCode = ''
  county = ''

  constructor (address: AddressModelAbstract | undefined = undefined) {
    if (address) {
      this.addressOptionalString = address.addressOptionalString
      this.addressString = address.addressString
      this.city = address.city
      this.firstName = address.firstName
      this.lastName = address.lastName
      this.note = address.note
      this.phone = address.phone
      this.state = address.state
      this.zipCode = address.zipCode
      this.county = address.county
    }
  }
}

export interface AddressInputInterface {
  addressOptionalString: string
  addressString: string
  city: string
  firstName: string
  lastName: string
  note: string
  phone: string
  state: string
  zipCode: string
  type: string
}

export interface AddressInterface {
  id: string
  addressOptionalString: string
  addressString: string
  city: string
  firstName: string
  lastName: string
  state: string
  zipCode: string
  phone: string
  note: string
  county: string
  company: string
  type: string
  fullAddressString: string
}

export class AddressModelAbstract {
  fullAddressString: string
  addressOptionalString: string
  addressString: string
  city: string
  firstName: string
  inline: string
  deleted: boolean
  valid: boolean
  lastName: string
  note: string
  phone: string
  shortAddress: string
  state: string
  zipCode: string
  type: string
  company: string
  county: string

  constructor ({
    fullAddressString,
    addressOptionalString,
    addressString,
    city,
    firstName,
    inline,
    deleted,
    valid,
    lastName,
    note,
    phone,
    shortAddress,
    state,
    zipCode,
    type,
    company,
    county
  }: Record<string, string | boolean> | AddressModel = {}) {
    this.fullAddressString = fullAddressString as string
    this.valid = valid as boolean
    this.deleted = deleted as boolean
    this.inline = inline as string
    this.firstName = firstName as string
    this.lastName = lastName as string
    this.city = city as string
    this.state = state as string
    this.zipCode = zipCode as string
    this.addressOptionalString = addressOptionalString as string
    this.addressString = addressString as string
    this.phone = phone as string
    this.note = note as string
    this.shortAddress = shortAddress as string
    this.type = type as string
    this.company = company as string
    this.county = county as string
  }
}

class AddressModel extends AddressModelAbstract {
  id: string

  constructor (data: Record<string, string> = {}) {
    super(data)
    this.id = data.id
  }
}

export default AddressModel
