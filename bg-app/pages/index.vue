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
const { t } = useLocalizationStore()
</script>

<template>
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
</template>

<style scoped>

</style>
