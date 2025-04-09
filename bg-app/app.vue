<script setup lang="ts">
const showNavBubbles = ref(false)
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
  <div :key="locale" class="flex justify-center align-middle flex-wrap relative">
    <div class="main flex justify-center align-middle flex-wrap relative w-9/10 gap-5">
      <div class="navbar">
        <div class="navbar-start">
          <NuxtLink to="/" class="btn btn-ghost normal-case text-xl">
            Bastian Ganze
          </NuxtLink>
        </div>
        <div class="navbar-end gap-3">
          <button type="button" class="btn btn-ghost btn-circle" @click="() => showNavBubbles = !showNavBubbles">
            <Icon size="2rem" name="line-md:compass-filled-loop" />
          </button>
          <button type="button" class="btn btn-ghost btn-circle" @click="() => setThemeName(themeName === 'dark' ? 'light' : 'dark')">
            <Icon size="2rem" :name="themeIcon" />
          </button>
          <button type="button" class="btn btn-ghost btn-circle" @click="() => setLocale(locale === 'en' ? 'de' : 'en')">
            {{ locale }}
          </button>
        </div>
      </div>
      <div v-if="showNavBubbles" class="bubbles-overlay">
        <div class="bubbles-wrap">
          <NuxtLink to="/" class="bubble bubble-1" @click="showNavBubbles = false">
            <Icon class="bubble-icon bubble-icon-1" name="line-md:home-md" />
          </NuxtLink>
          <NuxtLink to="/games" class="bubble bubble-2" @click="showNavBubbles = false">
            <Icon class="bubble-icon bubble-icon-2" name="line-md:play" />
          </NuxtLink>
          <NuxtLink to="/projects" class="bubble bubble-3" @click="showNavBubbles = false">
            <Icon class="bubble-icon bubble-icon-3" name="line-md:briefcase" />
          </NuxtLink>
          <NuxtLink to="/contact" class="bubble bubble-4" @click="showNavBubbles = false">
            <Icon class="bubble-icon bubble-icon-4" name="line-md:email" />
          </NuxtLink>
        </div>
      </div>
      <NuxtPage />
      <div class="footer footer-center footer-horizontal bg-base-200 t ext-base-content">
        <nav class="grid grid-flow-col gap-4">
          <NuxtLink to="/impressum" class="link link-hover">
            {{ t('legalNotice') }}
          </NuxtLink>
          <NuxtLink to="/contact" class="link link-hover">
            {{ t('contact') }}
          </NuxtLink>
        </nav>
        <nav>
          <div class="grid grid-flow-col gap-4">
            <a href="https://linkedin.com/in/bastianganze">
              <Icon size="2rem" name="line-md:linkedin" />
            </a>
            <a href="https://github.com/BastianGanze">
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
.bubbles-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 100px;
  z-index: 5000;
}
.bubbles-wrap {
  position: relative;
  min-width: 1px;
  min-height: 1px;
  margin-top: 50px;
}
.bubble {
  position: absolute;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  pointer-events: auto;
  cursor: pointer;
}
.bubble:after {
  position: absolute;
  content: "";
  min-width: 200px;
  min-height: 200px;
  border-radius: 50%;
  overflow: visible;
  backdrop-filter: drop-shadow(4px 4px 10px rgba(255, 255, 255, 0.45)) blur(5px);
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
.bubble:hover:after {
  opacity: 1;
}

.bubble-1 {
  background: radial-gradient(circle, rgba(119, 243, 65, 0.15) 0%, rgba(0, 50, 255, 0.15) 80%);
  left: -300px;
  top: 75px;
}

.bubble-icon-1 {
  background: radial-gradient(circle, rgba(108, 206, 66, 0.45) 0%, rgba(0, 50, 255, 0.45) 80%);
}

.bubble-2 {
  background: radial-gradient(circle, rgba(63,94,251,0.15) 20%, rgba(252,70,107,0.15) 80%);
  left: -100px;
  top: -100px;
}

.bubble-icon-2 {
  background: radial-gradient(circle, rgba(63,94,251,0.35) 20%, rgba(252,70,107,0.35) 80%);
}

.bubble-3 {
  background: radial-gradient(circle, rgba(168, 202, 255, 0.15) 20%, rgba(0, 189, 179, 0.15) 80%);
  left: 100px;
  top: 75px;
}

.bubble-icon-3 {
  background: radial-gradient(circle, rgba(201, 231, 238, 0.25) 20%, rgba(0, 161, 176, 0.25) 80%);
}

.bubble-4 {
  background: radial-gradient(circle, rgba(168, 202, 255, 0.15) 20%, rgba(0, 189, 179, 0.15) 80%);
  left: -100px;
  top: 250px;
}

.bubble-icon-4 {
  background: radial-gradient(circle, rgba(201, 231, 238, 0.25) 20%, rgba(0, 161, 176, 0.25) 80%);
}

.bubble-icon {
  width: 66%;
  height: 66%;
  font-size: 200rem;
}
</style>
