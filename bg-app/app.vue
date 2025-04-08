<script setup lang="ts">
import type { VariablesOf } from '@graphql-typed-document-node/core'

import { OrderDirection } from '~/__generated__/graphql'
import { GET_POSTS } from '~/queries'

const { data, error } = await useAsyncQuery({
  query: GET_POSTS,
  variables: {
    take: 10,
    skip: 0,
    orderBy: [
      {
        createdAt: OrderDirection.Asc,
      },
    ],
  } satisfies VariablesOf<typeof GET_POSTS>,
})

const posts = computed(() => {
  return data.value?.posts
})
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
  <div class="flex justify-center align-middle flex-wrap relative">
    <div class="main flex justify-center align-middle flex-wrap relative w-9/12">
      <div class="navbar">
        <div class="navbar-start">
          <a class="btn btn-ghost normal-case text-xl">Bastian Ganze</a>
        </div>
        <div class="navbar-end gap-3">
          <button class="btn btn-ghost btn-circle" @click="() => showNavBubbles = !showNavBubbles">
            <Icon size="2rem" name="line-md:compass-filled-loop" />
          </button>
          <button class="btn btn-ghost btn-circle" @click="() => setThemeName(themeName === 'dark' ? 'light' : 'dark')">
            <Icon size="2rem" :name="themeIcon" />
          </button>
          <button class="btn btn-ghost btn-circle" @click="() => setLocale(locale === 'en' ? 'de' : 'en')">
            {{ locale }}
          </button>
        </div>
      </div>
      <div class="card card-border border-base-300 bg-base-100 card-xl w-full">
        <div class="card-body">
          <h1 class="text-3xl font-bold underline">
            {{ t('title') }}
          </h1>
          <div v-if="error" class="alert alert-error">
            <p>
              Error: {{ error.message }}
            </p>
          </div>
          <div v-for="post in posts" :key="post.id">
            <h2>{{ post.title }}</h2>
            <RichText v-if="post.content?.document" :initial-value="post.content?.document" />
          </div>
        </div>
      </div>
      <div v-if="showNavBubbles" class="bubbles-overlay">
        <div class="bubble">
          <Icon class="bubble-icon" name="line-md:home-md" />
        </div>
        <div class="bubble">
          <Icon class="bubble-icon" name="line-md:briefcase" />
        </div>
        <div class="bubble">
          <Icon class="bubble-icon" name="line-md:email" />
        </div>
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
  gap: 20px;
  padding: 200px;
}
.bubble {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(63,94,251,0.15) 20%, rgba(252,70,107,0.15) 80%);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  pointer-events: auto;
  cursor: pointer;
}

.bubble-icon {
  width: 66%;
  height: 66%;
  background: radial-gradient(circle, rgba(63,94,251,0.35) 20%, rgba(252,70,107,0.35) 80%);
  font-size: 200rem;
}
</style>
