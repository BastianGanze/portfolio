<script setup lang="ts">
import type { VersusGameInstance } from '~/bindings'
import { Player } from '~/bindings'
import { useGameStore } from '~/stores/gameStore'

const props = defineProps<{ instance: VersusGameInstance, currentUserId: string }>()
const { instance, currentUserId } = toRefs(props)
const { makeBoardGameMove } = useGameStore()

function ticTacToeMove(index: number) {
  if (!instance.value.matchStarted) {
    return
  }
  makeBoardGameMove(instance.value.id, { tag: 'TicTacToe', value: { index } })
}

const currentUserPlayerTag = computed(() => {
  if (instance.value.playerOne?.toHexString() === currentUserId.value) {
    return Player.A.tag
  }
  if (instance.value.playerTwo?.toHexString() === currentUserId.value) {
    return Player.B.tag
  }
  return null
})
</script>

<template>
  <div v-if="instance && currentUserPlayerTag">
    <div v-if="instance.gameState.tag === 'TicTacToe'" class="tic-tac-toe-board">
      <div class="tic-tac-toe-bg-grid masked-overflow">
        <div
          v-for="(player, i) in instance.gameState.value.tiles" :key="i" class="tic-tac-toe-bg-grid-cell"
        />
      </div>
      <div class="tic-tac-toe-grid">
        <div
          v-for="(player, i) in instance.gameState.value.tiles" :key="i" class="tic-tac-toe-grid-cell"
          :class="{ 'text-primary': player?.tag && currentUserPlayerTag === player.tag, 'text-secondary': player?.tag && currentUserPlayerTag !== player.tag }"
          @click="() => !player && ticTacToeMove(i)"
        >
          <SvgCrossPreventAnimationCaching v-if="player?.tag === 'A'" />
          <SvgCirclePreventAnimationCaching v-else-if="player?.tag === 'B'" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tic-tac-toe-board {
  width: 200px;
  height: 200px;
  position: relative;
}

.tic-tac-toe-bg-grid {
  pointer-events: none;
  width: 200px;
  height: 200px;
  position: absolute;
  display: grid;
  grid-template-columns: auto auto auto;
  left: 0;
  top: 0;
}

.tic-tac-toe-grid {
  width: 200px;
  height: 200px;
  display: grid;
  grid-template-columns: auto auto auto;
}

.tic-tac-toe-bg-grid-cell {
  width: 66px;
  height: 66px;
  border-right: 2px solid var(--color-base-content);
  border-bottom: 2px solid var(--color-base-content);
  box-sizing: content-box;
}

.tic-tac-toe-grid-cell {
  width: 66px;
  height: 66px;
  display: flex;
  border-right: 2px solid var(--color-base-100);
  border-bottom: 2px solid var(--color-base-100);
  box-sizing: content-box;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.tic-tac-toe-bg-grid-cell:nth-child(3n) {
  border-right: none;
}

.tic-tac-toe-bg-grid-cell:nth-child(n+7) {
  border-bottom: none;
}

.masked-overflow {
  mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 100%);
  mask-composite: intersect;
  mask-repeat: no-repeat, no-repeat;
}
</style>
