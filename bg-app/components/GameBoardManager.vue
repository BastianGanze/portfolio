<script setup lang="ts">
import type { DbBoardGameParam, VersusGameInstance } from '~/bindings'
import { useGameStore } from '~/stores/gameStore'

const props = defineProps<{
  boardGameParam: DbBoardGameParam
  gameInstances: Record<number, VersusGameInstance>
  currentUserId: string
}>()
const { boardGameParam, gameInstances, currentUserId } = toRefs(props)

const activeInstance = computed(() => {
  console.log(currentUserId.value)
  const playerInstancesForGame = Object.values(gameInstances.value).filter(instance => (instance.playerOne?.toHexString() === currentUserId.value || instance.playerTwo?.toHexString() === currentUserId.value) && instance.gameStateParam.tag === boardGameParam.value.tag)
  playerInstancesForGame.sort((a, b) =>
    Number(a.gameDone) - Number(b.gameDone),
  )
  if (playerInstancesForGame.length > 0) {
    return playerInstancesForGame[0]
  }
  return null
})

const canAddBot = computed(() => {
  if (activeInstance.value) {
    console.log(activeInstance.value.playerOne?.toHexString(), currentUserId.value)
    return (activeInstance.value.playerOne?.toHexString() === currentUserId.value && !activeInstance.value.playerTwo)
      || (activeInstance.value.playerTwo?.toHexString() === currentUserId.value && !activeInstance.value.playerOne)
  }
  return false
})

const { joinRandomGame } = useGameStore()
</script>

<template>
  <div>
    <button v-if="!activeInstance" class="btn" @click="() => joinRandomGame(boardGameParam)">
      Join game
    </button>
    <button
      v-else-if="activeInstance && activeInstance.gameDone" class="btn"
      @click="() => joinRandomGame(boardGameParam)"
    >
      Play again
    </button>
    <button
      v-if="canAddBot" class="btn"
      @click="() => joinRandomGame(boardGameParam)"
    >
      Play agains Bot
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
