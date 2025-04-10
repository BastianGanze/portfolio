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
  startedAt: Date | null
  finishedAt: Date | null
}

const dayjs = useDayjs()

const projects = computed(() => {
  const p = data.value?.projects?.map((p) => {
    return {
      id: p.id,
      startedAt: p.startedAt ? new Date(p.startedAt) : null,
      finishedAt: p.finishedAt ? new Date(p.finishedAt) : null,
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
        <li v-for="(project, index) in projects" :key="project.id" class="gap-x-2 flex">
          <div class="timeline-middle timeline-middle-custom">
            <Icon size="2rem" :name="project.finishedAt ? 'line-md:confirm-circle' : 'line-md:cog-filled-loop'" />
            <div class="timeline-connect" />
          </div>
          <div :class="{ 'timeline-start md:text-end': index % 2 === 0, 'timeline-end md:text-start': index % 2 !== 0 }">
            <article v-if="project.shortDescription" class="prose">
              <h2>
                {{ project.title }}
              </h2>
              <RichText :document="project.shortDescription" />
            </article>
          </div>
          <div :class="{ 'timeline-end md:text-start': index % 2 === 0, 'timeline-start md:text-end': index % 2 !== 0 }">
            {{ $dayjs(project.startedAt).format('MMMM YYYY') }}{{ project.finishedAt ? ` - ${$dayjs(project.finishedAt).format('MMMM YYYY')}` : '' }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.timeline-connect {
  width: 5px;
  min-width: 5px;
  flex-grow: 1;
  border-radius: 2px;
  margin: 9px 0 5px 0;
  background-color: #ffffff;
}
.timeline-middle-custom {
  grid-row-start: 1;
  grid-row-end: 4;
  display: flex;
  padding-top: 4px;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
</style>
