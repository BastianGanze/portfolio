import type { TranslateOptions } from 'i18n-js'
import dayjs from 'dayjs'
import { I18n } from 'i18n-js'
import { storeToRefs } from 'pinia'
import { de } from '~/locales/de'
import { en } from '~/locales/en'
import { usePreferencesStore } from '~/stores/preferenceStore'

export type TranslationKey = keyof typeof en
export type Language = 'en' | 'de'

export const LANG_TRANSLATION_MAP: { [key in Language]: TranslationKey } = {
  de: 'languagesGerman',
  en: 'languagesEnglish',
}

const i18n = new I18n({
  en,
  de,
})
i18n.locale = 'en'
i18n.enableFallback = true
i18n.defaultLocale = 'en'

export const useLocalizationStore = defineStore('localization', () => {
  const { locale } = storeToRefs(usePreferencesStore())
  const t = (key: TranslationKey, options?: TranslateOptions): string => {
    return i18n.t(key as string, options)
  }

  const switchLocale = (l: Language) => {
    dayjs.locale(l)
    i18n.locale = l
  }

  const init = () => {
    switchLocale(locale.value)
  }

  watch(locale, async () => {
    if (locale.value) {
      switchLocale(locale.value)
    }
  })

  return { t, switchLocale, locale, init }
})
