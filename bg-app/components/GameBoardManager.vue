<script setup lang="ts">
import type { DbBoardGameParam, VersusGameInstance } from '~/bindings'
import { useGameStore } from '~/stores/gameStore'

const props = defineProps<{
  boardGameParam: DbBoardGameParam
  gameInstances: Record<number, VersusGameInstance>
  currentUserId: string
}>()
const { boardGameParam, gameInstances, currentUserId } = toRefs(props)

const activeInstanceId = ref<number | null>(null)
const activeInstance = computed(() => {
  if (activeInstanceId.value) {
    return gameInstances.value[activeInstanceId.value]
  }
  return null
})
const seekRunningGame = ref(true)
watch([gameInstances, seekRunningGame], () => {
  if (seekRunningGame.value) {
    const playerInstancesForGame = Object.values(gameInstances.value).filter(instance => (instance.playerOne?.toHexString() === currentUserId.value || instance.playerTwo?.toHexString() === currentUserId.value) && instance.gameStateParam.tag === boardGameParam.value.tag)
    playerInstancesForGame.sort((a, b) =>
      Number(a.gameDone) - Number(b.gameDone),
    )
    if (playerInstancesForGame.length > 0 && !playerInstancesForGame[0].gameDone) {
      activeInstanceId.value = playerInstancesForGame[0].id
      seekRunningGame.value = false
    }
  }
}, { deep: true })

const canAddBot = computed(() => {
  if (activeInstance.value) {
    return (activeInstance.value.playerOne?.toHexString() === currentUserId.value && !activeInstance.value.playerTwo)
      || (activeInstance.value.playerTwo?.toHexString() === currentUserId.value && !activeInstance.value.playerOne)
  }
  return false
})

const { joinRandomGame } = useGameStore()

function joinGame() {
  activeInstanceId.value = null
  seekRunningGame.value = true
  joinRandomGame(boardGameParam.value)
}
</script>

<template>
  <div>
    <button v-if="!activeInstance" class="btn" @click="joinGame">
      Join game
    </button>
    <button
      v-else-if="activeInstance && activeInstance.gameDone" class="btn"
      @click="joinGame"
    >
      Play again
    </button>
    <button
      v-if="canAddBot" class="btn"
    >
      Play against Bot
    </button>
    <div v-if="canAddBot">
      Waiting for player...
    </div>
    <div v-if="activeInstance">
      <GameBoard :instance="activeInstance" :current-user-id="currentUserId" />
    </div>
  </div>
</template>

<style scoped>

</style>
