<script setup lang="ts">
import type { DbBoardGameParam, UserGameScores, VersusGameInstance } from '~/bindings'
import confetti from 'canvas-confetti'
import { match, P } from 'ts-pattern'
import { useGameStore } from '~/stores/gameStore'

const props = defineProps<{
  boardGameParam: DbBoardGameParam
  gameInstances: Record<number, VersusGameInstance>
  currentUserId: string
}>()
const gameBoardState = ref<'WaitingForOpponent' | 'OpponentsTurn' | 'YourTurn' | 'OpponentOffline' | 'GameEnded' | 'NoGameActive'>('NoGameActive')
const { boardGameParam, gameInstances, currentUserId } = toRefs(props)
const { users } = storeToRefs(useGameStore())
const { t } = useLocalizationStore()
const activeInstanceId = ref<number | null>(null)
const activeInstance = computed(() => {
  if (activeInstanceId.value) {
    return gameInstances.value[activeInstanceId.value]
  }
  return null
})

const confettiSettings = {
  spread: 360,
  ticks: 60,
  origin: { y: -0.1 },
  gravity: 1,
  decay: 0.95,
  startVelocity: 25,
  colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
}

function shootConfetti() {
  confetti({
    ...confettiSettings,
    particleCount: 50,
    scalar: 1.2,
    shapes: ['star'],
  })
  confetti({
    ...confettiSettings,
    particleCount: 20,
    scalar: 0.75,
    shapes: ['circle'],
  })
}

function showWonEffect() {
  setTimeout(shootConfetti, 0)
  setTimeout(shootConfetti, 100)
  setTimeout(shootConfetti, 200)
  setTimeout(shootConfetti, 800)
  setTimeout(shootConfetti, 900)
  setTimeout(shootConfetti, 1000)
}

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

const playerScore = computed((): UserGameScores => {
  return users.value[currentUserId.value]?.gameScores.find(score => score.game.tag === boardGameParam.value.tag) || {
    game: boardGameParam.value,
    won: 0,
    lost: 0,
    draws: 0,
  }
})

const { joinRandomGame, abandonGame, forceStartGame } = useGameStore()

function joinGame() {
  activeInstanceId.value = null
  seekRunningGame.value = true
  joinRandomGame(boardGameParam.value)
}

const currentPlayerTag = computed(() => {
  if (activeInstance.value?.playerOne?.toHexString() === currentUserId.value) {
    return 'A'
  }
  if (activeInstance.value?.playerTwo?.toHexString() === currentUserId.value) {
    return 'B'
  }
  return null
})

const opposingUserIdentity = computed(() => {
  if (!activeInstance.value) {
    return null
  }
  if (activeInstance.value?.playerOne?.toHexString() === currentUserId.value) {
    return activeInstance.value.playerTwo
  }
  if (activeInstance.value?.playerTwo?.toHexString() === currentUserId.value) {
    return activeInstance.value.playerOne
  }
  return null
})
const opposingUser = computed(() => {
  return opposingUserIdentity.value ? users.value[opposingUserIdentity.value.toHexString()] ?? null : null
})
const isOpponentOnline = computed(() => opposingUserIdentity.value && (opposingUser.value && opposingUser.value.online))

watch([activeInstance, isOpponentOnline], () => {
  if (opposingUserIdentity.value && !isOpponentOnline.value) {
    if (gameBoardState.value === 'OpponentOffline' && activeInstance.value?.gameDone) {
      gameBoardState.value = 'NoGameActive'
      activeInstanceId.value = null
      return
    }
    gameBoardState.value = 'OpponentOffline'
    return
  }
  if (activeInstance.value && activeInstance.value.matchStarted && activeInstance.value.gameDone) {
    if (activeInstance.value?.outcome?.tag === 'WonBy' && currentPlayerTag.value === activeInstance.value.outcome.value.tag) {
      showWonEffect()
    }
    gameBoardState.value = 'GameEnded'
    return
  }
  match(gameBoardState.value)
    .with('NoGameActive', 'GameEnded', () => {
      if (activeInstance.value) {
        if (!activeInstance.value.matchStarted) {
          gameBoardState.value = 'WaitingForOpponent'
        }
        else {
          gameBoardState.value = activeInstance.value.nextPlayer.tag === currentPlayerTag.value ? 'YourTurn' : 'OpponentsTurn'
        }
      }
    })
    .with('WaitingForOpponent', () => {
      if (activeInstance.value && activeInstance.value.matchStarted && !activeInstance.value.gameDone) {
        gameBoardState.value = activeInstance.value.nextPlayer.tag === currentPlayerTag.value ? 'YourTurn' : 'OpponentsTurn'
      }
    })
    .with('YourTurn', 'OpponentsTurn', 'OpponentOffline', () => {
      if (activeInstance.value) {
        gameBoardState.value = activeInstance.value.nextPlayer.tag === currentPlayerTag.value ? 'YourTurn' : 'OpponentsTurn'
      }
    })
    .exhaustive()
}, { deep: true })
const boardStateLabel = computed(() =>
  match(gameBoardState.value)
    .with('NoGameActive', () => t('gameBoardNoGameActive'))
    .with('WaitingForOpponent', () => t('gameBoardWaitingForOpponent'))
    .with('YourTurn', () => t('gameBoardYourTurn'))
    .with('OpponentsTurn', () => t('gameBoardOpponentTurn'))
    .with('OpponentOffline', () => t('gameBoardWaitingForOpponent'))
    .with('GameEnded', () => t('gameBoardGameEnded'))
    .exhaustive(),
)
const actionButtonLabel = computed(() =>
  match(gameBoardState.value)
    .with('NoGameActive', () => t('gameBoardPlayButton'))
    .with('WaitingForOpponent', () => t('gameBoardPlayAgainstBotButton'))
    .with('OpponentOffline', () => t('gameBoardAbandonGameButton'))
    .with('GameEnded', () => t('gameBoardPlayAgainButton'))
    .with('YourTurn', 'OpponentsTurn', () => 'INVALID_STATE')
    .exhaustive(),
)
const gamePlayable = computed(() => ['YourTurn', 'OpponentsTurn'].includes(gameBoardState.value))
const gameOutcomeLabel = computed(() => {
  if (activeInstance.value?.gameDone) {
    return match(activeInstance.value.outcome)
      .with({ tag: 'WonBy', value: P.select() }, (player) => {
        if (player.tag === currentPlayerTag.value) {
          return t('gameBoardOutcomeWin')
        }
        return t('gameBoardOutcomeLose')
      })
      .with({ tag: 'Draw' }, () => t('gameBoardOutcomeDraw'))
      .with(P.nullish, () => null)
      .exhaustive()
  }
  return null
})

function onActionButtonClick() {
  return match(gameBoardState.value)
    .with('WaitingForOpponent', () => {
      if (activeInstance.value) {
        forceStartGame(activeInstance.value.id)
      }
    })
    .with('OpponentOffline', () => {
      abandonGame()
    })
    .with('GameEnded', 'NoGameActive', () => {
      joinGame()
    })
    .with('YourTurn', 'OpponentsTurn', () => {
    })
    .exhaustive()
}
</script>

<template>
  <div class="card card-border border-base-300 w-full">
    <div class="card-body p-5 flex flex-row flex-wrap w-full">
      <h2 class="text-2xl font-bold">
        {{ boardGameParam.tag }}
      </h2>
      <div class="board-status w-full pb-1">
        {{ boardStateLabel }}
      </div>
      <div class="board-wrapper">
        <GameBoard
          v-if="activeInstance" :instance="activeInstance" :current-user-id="currentUserId"
          class="board"
          :class="{ 'board--active': gamePlayable }"
        />
        <div v-if="!gamePlayable" class="board-overlay">
          <div v-if="gameOutcomeLabel" class="py-3 text-xl">
            {{ gameOutcomeLabel }}
          </div>
          <div
            v-if="gameBoardState === 'OpponentOffline'"
            class="text-red-500"
          >
            {{ t('gameBoardOpponentOfflineText') }}
          </div>
          <button class="btn btn-xl btn-secondary" @click="onActionButtonClick">
            {{ actionButtonLabel }}
          </button>
        </div>
      </div>
      <div class="card board-score my-1 flex flex-col bg-base-200">
        <div class="stats">
          <div class="stat">
            <div class="stat-title">
              {{ t('gameBoardScoreLabel') }}
            </div>
            <div class="stat-value flex items-center gap-2 text-xl">
              <Icon class="text-green-400" name="line-md:circle-to-confirm-circle-transition" />
              {{ playerScore.won }}
            </div>
            <div class="stat-value flex items-center gap-2 text-xl">
              <Icon class="text-red-400" name="line-md:close-circle" />
              {{ playerScore.lost }}
            </div>
            <div class="stat-value flex items-center gap-2 text-xl">
              <Icon class="text-gray-400" name="line-md:minus-circle" />
              {{ playerScore.draws }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-wrapper {
  flex-grow: 1;
  position: relative;
  min-height: 200px;
}

.board-score {
  width: 200px;
}

.board-overlay {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.board {
  display: inline-block;
  filter: blur(3px);
}

.board--active {
  filter: blur(0);
  transition: filter 0.3s ease-in-out;
}
</style>
