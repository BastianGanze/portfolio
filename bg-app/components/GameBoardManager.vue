<script setup lang="ts">
import type { DbBoardGameParam, VersusGameInstance } from '~/bindings'
import { useGameStore } from '~/stores/gameStore'

const props = defineProps<{
  boardGameParam: DbBoardGameParam
  gameInstances: Record<number, VersusGameInstance>
  currentUserId: string
}>()
const { boardGameParam, gameInstances, currentUserId } = toRefs(props)
const { users } = storeToRefs(useGameStore())

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
    return !activeInstance.value.gameDone && !activeInstance.value.matchStarted
  }
  return false
})

const { joinRandomGame, abandonGame, forceStartGame } = useGameStore()

function joinGame() {
  activeInstanceId.value = null
  seekRunningGame.value = true
  joinRandomGame(boardGameParam.value)
}

function froceGameStart() {
  if (activeInstance.value) {
    forceStartGame(activeInstance.value.id)
  }
}

const opposingUserIdentity = computed(() => {
  if (!activeInstance.value || !activeInstance.value.playerOne || !activeInstance.value.playerTwo) {
    return null
  }
  if (activeInstance.value.playerOne.toHexString() === currentUserId.value) {
    return activeInstance.value.playerTwo
  }
  if (activeInstance.value.playerTwo.toHexString() === currentUserId.value) {
    return activeInstance.value.playerOne
  }
  return null
})
const opposingUser = computed(() => {
  return opposingUserIdentity.value ? users.value[opposingUserIdentity.value.toHexString()] ?? null : null
})
</script>

<template>
  <div>
    <div v-if="activeInstance">
      <div
        v-if="opposingUserIdentity && (!opposingUser || (opposingUser && !opposingUser.online)) && !activeInstance.gameDone"
      >
        <div class="text-red-500">
          The opponent is offline! You can wait for them to come back or join another game, but there will be no winner
          or
          looser in this game.
        </div>
        <button class="btn" @click="abandonGame">
          Abandon game
        </button>
      </div>
      <button
        v-else-if="activeInstance.gameDone" class="btn"
        @click="joinGame"
      >
        Play again
      </button>
    </div>
    <button v-else class="btn" @click="joinGame">
      Join game
    </button>
    <div v-if="canAddBot">
      Waiting for player...
    </div>
    <button
      v-if="canAddBot" class="btn" @click="froceGameStart"
    >
      Play against Bot
    </button>
    <div v-if="activeInstance">
      <GameBoard :instance="activeInstance" :current-user-id="currentUserId" />
    </div>
  </div>
</template>

<style scoped>

</style>
