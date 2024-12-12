class NoteModel {
  /**
   * @param {string} addedAt
   * @param {string} addedAtEst
   * @param {string} addedBy
   * @param {string} authorName
   * @param {number} id
   * @param {boolean} show
   * @param {string} text
   */
  constructor ({
    addedAt,
    addedAtEst,
    addedBy,
    authorName,
    id,
    show,
    text
  }) {
    this.addedAt = addedAt
    this.addedAtEst = addedAtEst
    this.addedBy = addedBy
    this.authorName = authorName
    this.id = id
    this.show = show
    this.text = text
  }
}

export default NoteModel
