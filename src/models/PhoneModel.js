class PhoneModel {
  /**
   * @param {number} id
   * @param {string} callType
   * @param {string} formattedPhone
   * @param {boolean} isAvailableCalls
   * @param {boolean} isAvailableSms
   * @param {boolean} isValid
   * @param {boolean} noEdit
   * @param {string} phone
   * @param {string|null} type
   */
  constructor ({
    id,
    callType,
    formattedPhone,
    isAvailableCalls = true,
    isAvailableSms = true,
    isValid = true,
    noEdit,
    phone,
    type
  } = {}) {
    this.id = id
    this.callType = callType
    this.formattedPhone = formattedPhone
    this.isAvailableCalls = isAvailableCalls
    this.isAvailableSms = isAvailableSms
    this.isValid = isValid
    this.noEdit = noEdit
    this.phone = phone
    this.type = type || 'secondary'
  }
}

export default PhoneModel
