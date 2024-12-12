class FileProfileModel {
  /**
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} city
   * @param {string} state
   * @param {string} zipCode
   * @param {string} addressOptionalString
   * @param {string} addressString
   * @param {string} countryCode
   * @param {string} phone
   */
  constructor ({
    firstName,
    lastName,
    city,
    state,
    zipCode,
    addressOptionalString,
    addressString,
    countryCode,
    phone
  }) {
    this.firstName = firstName
    this.lastName = lastName
    this.city = city
    this.state = state
    this.zipCode = zipCode
    this.addressOptionalString = addressOptionalString
    this.addressString = addressString
    this.countryCode = countryCode
    this.phone = phone
  }
}

export default FileProfileModel
