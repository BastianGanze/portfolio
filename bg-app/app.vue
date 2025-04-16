<script setup lang="ts">
const { setThemeName, setLocale } = usePreferencesStore()
const { t } = useLocalizationStore()
const { locale, themeName } = storeToRefs(usePreferencesStore())
useThemeStore().init()
useLocalizationStore().init()
const themeIcon = ref(themeName.value === 'dark'
  ? 'line-md:moon-rising-filled-loop'
  : 'line-md:sunny-filled-loop')

watch(themeName, () => {
  themeIcon.value = themeName.value === 'dark'
    ? 'line-md:sunny-filled-loop-to-moon-filled-loop-transition'
    : 'line-md:moon-filled-to-sunny-filled-loop-transition'
})
</script>

<template>
  <div :key="locale" class="flex justify-center align-middle flex-wrap relative h-full">
    <div class="main relative w-9/10">
      <div class="navbar">
        <div class="navbar-start gap-3">
          <NuxtLink to="/" aria-label="Go to main page" class="btn btn-ghost btn-circle">
            <Icon name="line-md:home-md" size="2rem" />
          </NuxtLink>
          <NuxtLink aria-label="Go to games" to="/games" class="btn btn-ghost btn-circle">
            <Icon name="line-md:play-filled" size="2rem" />
          </NuxtLink>
        </div>
        <div class="navbar-end gap-3">
          <button type="button" aria-label="Switch Theme" class="btn btn-ghost btn-circle" @click="() => setThemeName(themeName === 'dark' ? 'light' : 'dark')">
            <Icon size="2rem" :name="themeIcon" />
          </button>
          <button type="button" aria-label="Switch Language" class="btn btn-ghost btn-circle" @click="() => setLocale(locale === 'en' ? 'de' : 'en')">
            {{ locale }}
          </button>
        </div>
      </div>
      <NuxtPage />
      <div class="footer footer-center footer-horizontal bg-base-200 bg-footer">
        <nav class="grid grid-flow-col gap-4">
          <NuxtLink aria-label="Go to legal notice" to="/impressum" class="link link-hover">
            {{ t('legalNotice') }}
          </NuxtLink>
          <NuxtLink aria-label="Go to contact info" to="/about-me" class="link link-hover">
            {{ t('aboutMe') }}
          </NuxtLink>
        </nav>
        <nav>
          <div class="grid grid-flow-col gap-4">
            <a aria-label="Bastian Ganze LinkedIn profile" target="_blank" href="https://linkedin.com/in/bastianganze">
              <Icon size="2rem" name="line-md:linkedin" />
            </a>
            <a aria-label="Bastian Ganze Github page" target="_blank" href="https://github.com/BastianGanze">
              <Icon size="2rem" name="line-md:github-loop" />
            </a>
          </div>
        </nav>
        <aside>
          <p>© {{ new Date().getFullYear() }} - {{ t('allRightsReserved') }}</p>
        </aside>
      </div>
    </div>
  </div>
</template>

<style>
.main {
  max-width: 1080px;
}
.bg-footer {
  margin-top: 2em;
}
</style>
