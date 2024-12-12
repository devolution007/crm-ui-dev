class RowModel {
  /**
   * @param {number} id
   * @param {string} name
   */
  constructor ({ id, sku: { name } }) {
    this.id = id
    this.name = name
  }
}

export default RowModel
