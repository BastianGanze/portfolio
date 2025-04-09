<script setup lang="ts">
import type { VariablesOf } from '@graphql-typed-document-node/core'

import type { SlateNode } from '~/components/RichText'
import { storeToRefs } from 'pinia'
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

interface Post {
  id: string
  title: string
  document?: SlateNode[]
}

const { locale } = storeToRefs(usePreferencesStore())

const posts = computed(() => {
  return data.value?.posts?.map((p) => {
    return {
      id: p.id,
      title: locale.value === 'en' ? p.title! : p.titleGerman!,
      document: locale.value === 'en' ? p.content?.document : p.contentGerman?.document,
    } satisfies Post
  })
})
</script>

<template>
  <div class="card card-border border-base-300 bg-base-100 card-xl w-full">
    <div class="card-body">
      <div v-if="error" class="alert alert-error">
        <p>
          Error: {{ error.message }}
        </p>
      </div>
      <div v-for="post in posts" :key="post.id">
        <article class="prose">
          <h2>
            {{ post.title }}
          </h2>
          <RichText v-if="post.document" :document="post.document" />
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
