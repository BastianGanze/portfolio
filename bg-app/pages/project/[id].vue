<script setup lang="ts">
import type { Project } from '~/__generated__/graphql'
import type { DbBoardGameParam } from '~/bindings'
import { GET_PROJECTS } from '~/queries'
import { useGameStore } from '~/stores/gameStore'

const route = useRoute()
const { currentUserId, gameInstances } = storeToRefs(useGameStore())
const possibleGames: DbBoardGameParam[] = [
  { tag: 'TicTacToe' },
]

const { data } = await useAsyncQuery({
  query: GET_PROJECTS,
  variables: {
    where: {
      roomId: {
        equals: Number(route.params.id),
      },
    },
  },
})
type LocalProjectType = Omit<Project, 'mainImage'> & {
  mainImage: { url: string } | null
}
const { locale } = storeToRefs(useLocalizationStore())
const project = computed(() => {
  if (!data.value?.projects || data.value.projects.length !== 1) {
    return null
  }
  const p = data.value.projects[0]
  return {
    id: p.id,
    startedAt: p.startedAt ? new Date(p.startedAt) : null,
    finishedAt: p.finishedAt ? new Date(p.finishedAt) : null,
    title: locale.value === 'en' ? p.title! : p.titleGerman!,
    mainImage: p.mainImage || null,
    link: p.link || null,
    game: p.game || null,
    content: locale.value === 'en' ? p.content?.document : p.contentGerman?.document,
    roomId: p.roomId ?? 0,
  } satisfies LocalProjectType
})

const gameToPlay = computed(() => possibleGames.find(game => game.tag === project.value?.game) ?? null)
</script>

<template>
  <div>
    <div class="card card-border border-base-300 bg-base-100 card-xl w-full">
      <div class="card-body">
        <article v-if="project" class="prose">
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
          <RichText :document="project.content" />
        </article>
        <GameBoardManager
          v-if="currentUserId && gameToPlay"
          :board-game-param="gameToPlay" :current-user-id="currentUserId"
          :game-instances="gameInstances"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
