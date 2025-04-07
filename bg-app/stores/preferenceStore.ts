export const usePreferencesStore = defineStore('preferenceStore', () => {
  const themeName = useCookie<ThemeName>('themeName', { default: () => 'dark' })
  const locale = useCookie<Language>('locale', { default: () => 'en' })

  const setLocale = async (l: Language) => {
    locale.value = l
  }

  const setThemeName = async (n: ThemeName) => {
    themeName.value = n
  }

  return {
    locale,
    themeName,
    setLocale,
    setThemeName,
  }
})
