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
const { locale } = storeToRefs(useLocalizationStore())
const project = computed(() => data.value?.projects?.map(p => ({
  id: p.id,
  startedAt: p.startedAt ? new Date(p.startedAt) : null,
  finishedAt: p.finishedAt ? new Date(p.finishedAt) : null,
  title: locale.value === 'en' ? p.title! : p.titleGerman!,
  mainImage: p.mainImage || null,
  link: p.link || null,
  game: p.game || null,
  content: locale.value === 'en' ? p.content?.document : p.contentGerman?.document,
  roomId: p.roomId ?? 0,
} satisfies Omit<Project, 'mainImage'> & {
  mainImage: { url: string } | null
}))?.[0] ?? null)

const gameToPlay = computed(() => possibleGames.find(game => game.tag === project.value?.game) ?? null)
</script>

<template>
  <div>
    <div class="card card-border border-base-300 bg-base-100 card-xl w-full">
      <div class="card-body">
        <article v-if="project" class="prose">
          <h2>{{ project.title }}</h2>
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
