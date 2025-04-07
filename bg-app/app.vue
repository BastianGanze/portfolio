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

const { setThemeName, setLocale } = usePreferencesStore()
const { t } = useLocalizationStore()
const { locale, themeName } = storeToRefs(usePreferencesStore())
useThemeStore().init()
useLocalizationStore().init()
</script>

<template>
  <div class="flex justify-center align-middle flex-wrap">
    <div class="navbar max-w-9/10">
      <div class="navbar-start">
        <a class="btn btn-ghost normal-case text-xl">Bastian Ganze</a>
      </div>
      <div class="navbar-end">
        <a class="btn btn-ghost"><Icon size="2rem" name="line-md:compass-filled-loop" /></a>
      </div>
    </div>
    <div class="card w-full max-w-9/10">
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
        <p>{{ post.content }}</p>
      </div>
      <button class="btn" @click="() => setThemeName(themeName === 'dark' ? 'light' : 'dark')">
        {{ themeName }}
      </button>
      <button class="btn" @click="() => setLocale(locale === 'en' ? 'de' : 'en')">
        {{ locale }}
      </button>
    </div>
  </div>
</template>
