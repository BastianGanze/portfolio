<script setup lang="ts">
import type { Project } from '~/__generated__/graphql'
import { GET_PAGES, GET_PROJECTS } from '~/queries'

const { t } = useLocalizationStore()
const { locale } = storeToRefs(useLocalizationStore())
const { data: projectData } = await useAsyncQuery({
  query: GET_PROJECTS,
  variables: {
    where: {},
  },
})

const { data: pageData } = await useAsyncQuery({
  query: GET_PAGES,
  variables: {
    where: {
      name: {
        equals: 'projects',
      },
    },
  },
})

const { rooms } = storeToRefs(useGameStore())

const projects = computed(() => {
  const p = projectData.value?.projects?.map((p) => {
    return {
      id: p.id,
      startedAt: p.startedAt ? new Date(p.startedAt) : null,
      finishedAt: p.finishedAt ? new Date(p.finishedAt) : null,
      title: locale.value === 'en' ? p.title! : p.titleGerman!,
      mainImage: p.mainImage ? { url: p.mainImage.url } : null,
      link: p.link || null,
      shortDescription: locale.value === 'en' ? p.shortDescription?.document : p.shortDescriptionGerman?.document,
      roomId: p.roomId ?? 0,
    } satisfies Omit<Project, 'mainImage'> & {
      mainImage: { url: string } | null
    }
  })
  p?.sort((a, b) => {
    if (a.startedAt && b.startedAt) {
      return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    }
    return 0
  })
  return p
})

const page = computed(() => {
  if (pageData.value?.pages?.length !== 1) {
    return null
  }
  const p = pageData.value.pages[0]
  return {
    id: p.id,
    name: p.name,
    title: locale.value === 'en' ? p.title : p.titleGerman,
    document: locale.value === 'en' ? p.content?.document : p.contentGerman?.document,
  }
})

function getUsersInRoom(roomId: number) {
  return rooms.value[roomId]?.users ?? 0
}
</script>

<template>
  <div class="card card-border border-base-300 bg-base-100 w-full">
    <div class="card-body">
      <article v-if="page" class="prose max-w-none">
        <h2>{{ page.title }}</h2>
        <RichText :document="page?.document" />
      </article>
      <div class="relative flex py-5 items-center">
        <div class="flex-grow border-t border-gray-400" />
      </div>
      <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
        <li v-for="(project, index) in projects" :key="project.id" class="gap-x-2 flex">
          <div class="timeline-middle timeline-middle-custom">
            <Icon
              size="2rem" :class="{ 'text-success': project.finishedAt }"
              :name="project.finishedAt ? 'line-md:confirm-circle' : 'line-md:cog-filled-loop'"
            />
            <div class="timeline-connect" />
          </div>
          <div
            :class="{ 'timeline-start md:text-end': index % 2 === 0, 'timeline-end md:text-start': index % 2 !== 0 }"
          >
            <article v-if="project.shortDescription" class="prose pb-8">
              <h2>
                <a v-if="project.link" class="no-underline font-bold" :href="project.link">{{ project.title }}
                  <Icon size="0.8em" class="inline-block ml-1" name="line-md:link" />
                </a>
                <span v-else>{{ project.title }}</span>
                <span class="text-sm block text-gray-400">
                  {{
                    $dayjs(project.startedAt).format('MMMM YYYY')
                  }}{{ project.finishedAt ? ` - ${$dayjs(project.finishedAt).format('MMMM YYYY')}` : '' }}
                </span>
              </h2>
              <RichText :document="project.shortDescription" />
              <NuxtLink :to="`/project/${project.roomId}`">
                {{ t('projectGetMoreInfoLink') }}
              </NuxtLink>
              <span
                class="badge badge-sm mx-1"
                :class="{ 'badge-ghost': getUsersInRoom(project.roomId) === 0, 'badge-primary': getUsersInRoom(project.roomId) > 0 }"
              >
                {{ t('playersInsideRoomBadgeLabel', { count: getUsersInRoom(project.roomId) }) }}
              </span>
            </article>
          </div>
          <div
            v-if="project.mainImage" class="h-full pt-1.5 text-l"
            :class="{ 'timeline-end md:text-start': index % 2 === 0, 'timeline-start md:text-end': index % 2 !== 0 }"
          >
            <img class="pt-10 max-h-50" aria-label="Project Image" :src="project.mainImage.url" alt="Project Image">
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
  background-color: var(--color-base-content);
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
