<script setup lang="ts">
import type { VariablesOf } from '@graphql-typed-document-node/core'
import type { SlateNode } from '~/components/RichText'
import type { GET_POSTS } from '~/queries'
import { OrderDirection } from '~/__generated__/graphql'
import { GET_PROJECTS } from '~/queries'

const { t } = useLocalizationStore()
const { locale } = storeToRefs(useLocalizationStore())

const { data } = await useAsyncQuery({
  query: GET_PROJECTS,
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

interface Project {
  id: string
  title: string
  shortDescription?: SlateNode[]
  mainImage?: { url?: string } | null
  startedAt?: string
  finishedAt?: string
}

const projects = computed(() => {
  const p = data.value?.projects?.map((p) => {
    return {
      id: p.id,
      startedAt: p.startedAt,
      finishedAt: p.finishedAt,
      title: locale.value === 'en' ? p.title! : p.titleGerman!,
      mainImage: p.mainImage,
      shortDescription: locale.value === 'en' ? p.shortDescription?.document : p.shortDescriptionGerman?.document,
    } satisfies Project
  })
  p?.sort((a, b) => {
    if (a.startedAt && b.startedAt) {
      return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    }
    return 0
  })
  return p
})
</script>

<template>
  <div class="card card-border border-base-300 bg-base-100 card-xl w-full">
    <div class="card-body">
      <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
        <li v-for="(project, index) in projects" :key="project.id">
          <div class="timeline-middle">
            <Icon size="2rem" :name="project.finishedAt ? 'line-md:confirm-circle' : 'line-md:cog-filled-loop'" />
          </div>
          <div class="mb-10" :class="{ 'timeline-start md:text-end': index % 2 === 0, 'timeline-end md:text-start': index % 2 !== 0 }">
            <h2>
              {{ project.title }}
            </h2>
            <p v-if="project.shortDescription">
              <RichText :document="project.shortDescription" />
            </p>
            <p v-if="project.startedAt">
              {{ project.startedAt }}
            </p>
            <p v-if="project.finishedAt">
              {{ project.finishedAt }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>
