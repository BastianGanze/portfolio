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
</script>

<template>
  <div>
    <div v-if="error" class="alert alert-error">
      <p>
        Error: {{ error.message }}
      </p>
    </div>
    <div v-for="post in posts" :key="post.id">
      <h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p>
    </div>
    <button class="btn">
      Button
    </button>
    <h1 class="text-3xl font-bold underline">
      Try something different again. {{ version }}
    </h1>
  </div>
</template>
