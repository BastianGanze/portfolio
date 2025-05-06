<script setup lang="ts">
import type {
  Project,
  Project_UnlockContent_Document,
  Project_UnlockContentGerman_Document,
} from '~/__generated__/graphql'
import type { DbBoardGameParam } from '~/bindings'
import { GET_PROJECT_RESTRICTED, GET_PROJECTS } from '~/queries'
import { useGameStore } from '~/stores/gameStore'

const route = useRoute()
const { currentUserId, users, gameInstances } = storeToRefs(useGameStore())
const possibleGames: DbBoardGameParam[] = [
  { tag: 'TicTacToe' },
  { tag: 'Connect4' },
  { tag: 'Go' },
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
const { t } = useLocalizationStore()
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

interface RestrictedContent {
  content: Project_UnlockContent_Document
  contentGerman: Project_UnlockContentGerman_Document
}

const restrictedContent = ref<RestrictedContent | null>(null)
const restrictedDocument = computed(() => {
  if (!restrictedContent.value) {
    return null
  }
  return locale.value === 'en' ? restrictedContent.value.content.document : restrictedContent.value.contentGerman.document
})
const restrictedDocumentsLoading = ref<boolean>(false)

const restrictedRequirementsFullfilled = computed(() => {
  if (!project.value || !currentUserId.value || !users.value) {
    return false
  }
  const player = users.value[currentUserId.value]
  if (!player) {
    return false
  }
  const gamesWon = player.gameScores.find(game => game.game.tag === gameToPlay.value?.tag)?.won || 0
  return gamesWon > 0
})
watch(restrictedRequirementsFullfilled, () => {
  if (!restrictedContent.value && restrictedRequirementsFullfilled.value && !restrictedDocumentsLoading.value) {
    loadRestrictedContent()
  }
}, { immediate: true })

async function loadRestrictedContent() {
  restrictedDocumentsLoading.value = true
  const { data: restrictedContentData } = await useAsyncQuery({
    query: GET_PROJECT_RESTRICTED,
    variables: {
      where: {
        roomId: {
          equals: Number(route.params.id),
        },
      },
    },
  })
  const project = restrictedContentData.value?.projects?.[0]
  if (!project || !project.unlockContent || !project.unlockContentGerman) {
    return null
  }

  restrictedContent.value = {
    content: project.unlockContent,
    contentGerman: project.unlockContentGerman,
  }
  restrictedDocumentsLoading.value = false
}
</script>

<template>
  <div>
    <div class="card card-border border-base-300 bg-base-100 card-xl w-full">
      <div class="card-body">
        <article v-if="project" class="prose max-w-none">
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
        <div v-if="currentUserId && gameToPlay" class="card mt-10">
          <div v-if="restrictedDocument" class="card-title alert alert-success">
            <Icon name="line-md:check-all" />
            {{ t('restrictedAreaLabel') }}
          </div>
          <div v-else class="card-title alert alert-warning">
            <Icon name="line-md:alert-loop" />
            {{ t('restrictedAreaLabel') }}
          </div>
          <div class="card-body">
            <article v-if="restrictedDocument" class="prose max-w-none">
              <RichText :document="restrictedDocument" />
            </article>
            <div v-else>
              {{ t('restrictedAreaExplanationText', { game: gameToPlay.tag }) }}
            </div>
          </div>
        </div>
        <GameBoardManager
          v-if="currentUserId && gameToPlay"
          class="mt-5"
          :board-game-param="gameToPlay" :current-user-id="currentUserId"
          :game-instances="gameInstances"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
