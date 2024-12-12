class ColorsOptionsModel {
  /**
   * @param {string} brown
   * @param {string} green
   * @param {string} orange
   * @param {string} red
   */
  constructor ({ brown, green, orange, red }) {
    this.brown = brown
    this.green = green
    this.orange = orange
    this.red = red
  }

  asArray () {
    const arr = []
    for (const key in this) {
      arr.push({
        value: key,
        text: this[key]
      })
    }

    return arr
  }
}

export default ColorsOptionsModel
