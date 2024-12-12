import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { LangData, Language } from 'src/models/LanguageModel'
import { constants } from 'boot/constants'

let languages: Language[] = []
export default function useLanguages () {
  if (languages.length === 0) {
    const defaultFlag = '🏁'
    languages = constants.LANGUAGES.map((lang: LangData) => {
      return {
        iso: lang.iso,
        name: lang.name,
        icon: getUnicodeFlagIcon(lang.iso === 'en' ? 'us' : lang.iso) || defaultFlag
      }
    })
  }

  return {
    get languages () {
      return languages
    },
    getLanguageByIso: (iso: string) => {
      return languages.find(t => t.iso === iso) || languages[0]
    }
  }
}
