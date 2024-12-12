import { constants } from 'src/boot/constants'

export interface Language {
  iso: string
  name: string
  icon: string
}

export interface LangData {
  iso: string
  type: string
  name: string
}

class LanguageModel implements LangData {
  public iso: string
  public type: string
  public name: string

  constructor (lang: LangData) {
    this.iso = lang.iso
    this.type = lang.type
    this.name = constants.LANGUAGES?.find((item: LangData) => item.iso === lang.iso)?.name ?? ''
  }
}

export default LanguageModel
