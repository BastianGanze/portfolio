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
  <div :key="locale" class="flex justify-center align-middle flex-wrap relative h-full">
    <div class="main relative w-9/10" :class="{ 'main--nav-active': showNavBubbles }">
      <div class="navbar">
        <div class="navbar-start">
          <NuxtLink to="/" class="btn btn-ghost normal-case text-xl">
            Bastian Ganze
          </NuxtLink>
        </div>
        <div class="navbar-end gap-3">
          <button type="button" aria-label="Navigation" class="btn btn-ghost btn-circle" @click="() => showNavBubbles = !showNavBubbles">
            <Icon size="2rem" name="line-md:compass-filled-loop" />
          </button>
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
          <NuxtLink aria-label="Go to contact info" to="/contact" class="link link-hover">
            {{ t('contact') }}
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
    <div v-if="showNavBubbles" class="bubbles-overlay">
      <div class="bubbles-wrap">
        <NuxtLink aria-label="Go to home" to="/" class="bubble bubble-1" @click="showNavBubbles = false">
          <Icon class="bubble-icon bubble-icon-1" name="line-md:home-md" />
        </NuxtLink>
        <NuxtLink aria-label="Go to games" to="/games" class="bubble bubble-2" @click="showNavBubbles = false">
          <Icon class="bubble-icon bubble-icon-2" name="line-md:play" />
        </NuxtLink>
        <NuxtLink aria-label="Go to projects" to="/projects" class="bubble bubble-3" @click="showNavBubbles = false">
          <Icon class="bubble-icon bubble-icon-3" name="line-md:briefcase" />
        </NuxtLink>
        <button type="button" aria-label="Close navigation" class="bubble bubble-4" @click="showNavBubbles = false">
          <Icon class="bubble-icon bubble-icon-4" name="line-md:close-circle" />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.main {
  max-width: 1080px;
}
.main--nav-active{
  filter: blur(2px);
}
.bg-footer {
  margin-top: 2em;
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
  background-color: rgba(76, 118, 197, 0.11);
  padding-top: 100px;
  z-index: 5000;
  mask-composite: exclude;
  --bubble-size: 150px;
  --bubble-padding: -25px;
  --start-bubble-x: calc(var(--bubble-size) / -2);
  --start-bubble-y: -50px;
}
.bubbles-wrap {
  position: relative;
  min-width: 1px;
  min-height: 1px;
  margin-top: 50px;
}
.bubble {
  position: absolute;
  width: var(--bubble-size);
  height: var(--bubble-size);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  pointer-events: auto;
  cursor: pointer;
  transition: left 0.5s, top 0.5s;
}
.bubble:after {
  position: absolute;
  content: "";
  min-width: 150px;
  min-height: 150px;
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
  background: radial-gradient(circle, rgba(52, 120, 19, 0.5) 0%, rgba(0, 24, 120, 0.5) 80%);
  left: var(--start-bubble-x);
  top: var(--start-bubble-y);
}

.bubble-icon-1 {
  background: radial-gradient(circle, rgba(154, 255, 114, 0.75) 0%, rgba(93, 125, 255, 0.75) 80%);
}

.bubble-2 {
  background: radial-gradient(circle, rgba(43, 63, 171, 0.44) 20%, rgba(158, 33, 59, 0.51) 80%);
  left: calc(var(--start-bubble-x) - var(--bubble-size) - var(--bubble-padding));
  top: calc(var(--start-bubble-y) + var(--bubble-size) + var(--bubble-padding));
}

.bubble-icon-2 {
  background: radial-gradient(circle, rgba(104, 129, 255, 0.71) 20%, rgba(255, 65, 102, 0.76) 80%);
}

.bubble-3 {
  background: radial-gradient(circle, rgba(36, 63, 105, 0.57) 20%, rgba(43, 105, 102, 0.64) 80%);
  left: calc(var(--start-bubble-x) + var(--bubble-size) + var(--bubble-padding));
  top: calc(var(--start-bubble-y) + var(--bubble-size) + var(--bubble-padding));
}

.bubble-icon-3 {
  background: radial-gradient(circle, rgba(201, 231, 238, 0.69) 20%, rgba(0, 161, 176, 0.75) 80%);
}

.bubble-4 {
  background: radial-gradient(circle, rgba(36, 63, 105, 0.57) 20%, rgba(43, 105, 102, 0.64) 80%);
  left: calc(var(--start-bubble-x));
  top: calc(var(--start-bubble-y) + var(--bubble-size) * 2 + var(--bubble-padding) * 2);
}

.bubble-icon-4 {
  background: radial-gradient(circle, rgba(201, 231, 238, 0.72) 20%, rgba(0, 161, 176, 0.72) 80%);
}

.bubble-icon {
  width: 66%;
  height: 66%;
  font-size: 200rem;
}
</style>
