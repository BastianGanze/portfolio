<script setup lang="ts">
import type { RouteParamsGeneric } from '#vue-router'
import { match, P } from 'ts-pattern'
import { useGameStore } from '~/stores/gameStore'

const { setThemeName, setLocale } = usePreferencesStore()
const { t } = useLocalizationStore()
const { locale, themeName } = storeToRefs(usePreferencesStore())
const router = useRouter()
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
const { moveUser, setCurrentRoomId } = useGameStore()
const { userCursors, users, currentUserId, gameInstances } = storeToRefs(useGameStore())
const mainNode = ref<HTMLElement>()
const mainNodeDimensions = ref({ left: 0, top: 0, width: 0, height: 0 })
let lastCursorPosition = { clientX: 0, clientY: 0 }

function onResize(): void {
  mainNodeDimensions.value = mainNode.value?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 }
}

function sendCursorPosition(): void {
  const { width, height, left, top } = mainNodeDimensions.value
  moveUser({
    x: (lastCursorPosition.clientX - left) / width,
    y: (lastCursorPosition.clientY - top + window.scrollY) / height,
  })
}

function onScroll(): void {
  sendCursorPosition()
}

function getRoomByPath(path: string, params: RouteParamsGeneric) {
  return match(path)
    .with('/', () => 0)
    .with('/impressum', () => 100)
    .with('/about-me', () => 200)
    .with(P.string.startsWith('/project'), () => {
      return Number(params.id)
    })
    .otherwise(() => 999)
}

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize, true)
  window.addEventListener('scroll', onScroll, true)
  setCurrentRoomId(getRoomByPath(router.currentRoute.value.path, router.currentRoute.value.params))
})

watch(router.currentRoute, () => {
  setCurrentRoomId(getRoomByPath(router.currentRoute.value.path, router.currentRoute.value.params))
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize, true)
  window.removeEventListener('scroll', onScroll, true)
})

function onMove(event: MouseEvent) {
  lastCursorPosition = { clientX: event.clientX, clientY: event.clientY }
  sendCursorPosition()
}

function onTouch(event: TouchEvent) {
  lastCursorPosition = { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY }
  sendCursorPosition()
}
</script>

<template>
  <div :key="locale" class="flex justify-center align-middle flex-wrap relative h-full">
    <div
      ref="mainNode" class="main relative w-9/10" @mousemove="onMove" @touchstart="onTouch" @touchmove="onTouch"
      @touchend="onTouch"
    >
      <GameBoardManager
        v-if="currentUserId"
        :board-game-param="{ tag: 'TicTacToe' }" :current-user-id="currentUserId"
        :game-instances="gameInstances"
      />
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
          <button
            type="button" aria-label="Switch Theme" class="btn btn-ghost btn-circle"
            @click="() => setThemeName(themeName === 'dark' ? 'light' : 'dark')"
          >
            <Icon size="2rem" :name="themeIcon" />
          </button>
          <button
            type="button" aria-label="Switch Language" class="btn btn-ghost btn-circle"
            @click="() => setLocale(locale === 'en' ? 'de' : 'en')"
          >
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
      <div class="cursors">
        <div
          v-for="(cursor, id) in userCursors" :key="id"
          class="cursor"
          :class="users[id].colorClass"
          :style="{ left: `${Math.round(cursor.position.x * mainNodeDimensions.width)}px`, top: `${Math.round(cursor.position.y * mainNodeDimensions.height)}px` }"
        >
          <Icon
            class="cursor-icon"
            name="line-md:account-small"
            size="2rem"
          />
          <span class="cursor-name">{{ users[id].name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- suppress CssUnusedSymbol -->
<style>
.cursors {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  pointer-events: none;
  overflow: hidden;
}

.cursor {
  position: absolute;
  filter: drop-shadow(0px 0px 3px var(--color-base-200));
}

.col-1 {
  color: #cb5352
}

.col-2 {
  color: #64ac48
}

.col-3 {
  color: #8f62ca
}

.col-4 {
  color: #9a963f
}

.col-5 {
  color: #6b8bcd
}

.col-6 {
  color: #c97f3e
}

.col-7 {
  color: #4aac8d
}

.col-8 {
  color: #c75d9c
}

.cursor-icon {
  position: absolute;
}

.cursor-name {
  position: absolute;
  top: 20px;
  left: 30px;
  font-size: 10px;
  font-weight: bold;
}

.main {
  position: relative;
  max-width: 1080px;
}

.bg-footer {
  margin-top: 2em;
}
</style>
