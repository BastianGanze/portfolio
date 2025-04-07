import { storeToRefs } from 'pinia'

export type ThemeName = 'dark' | 'light'
export const useThemeStore = defineStore('themeStore', () => {
  const { themeName } = storeToRefs(usePreferencesStore())
  const switchTheme = (n: ThemeName) => {
    document.documentElement.setAttribute('data-theme', n)
  }

  watch(themeName, () => {
    if (themeName.value) {
      switchTheme(themeName.value)
    }
  })

  const init = () => {
    useHead({
      htmlAttrs: {
        'data-theme': themeName.value,
      },
    })
  }

  return { themeName, switchTheme, init }
})
