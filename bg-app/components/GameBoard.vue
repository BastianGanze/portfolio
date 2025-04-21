<script setup lang="ts">
import type { VersusGameInstance } from '~/bindings'
import { useGameStore } from '~/stores/gameStore'

const props = defineProps<{ instance: VersusGameInstance, currentUserId: string }>()
const { instance } = toRefs(props)
const { makeBoardGameMove } = useGameStore()

function ticTacToeMove(index: number) {
  if (instance.value.playerOne && instance.value.playerTwo) {
    return
  }
  makeBoardGameMove(instance.value.id, { tag: 'TicTacToe', value: { index } })
}
</script>

<template>
  <div v-if="instance">
    <div v-if="instance.gameState.tag === 'TicTacToe'" class="tic-tac-toe-board">
      <div
        v-for="(player, i) in instance.gameState.value.tiles" :key="i" class="tic-tac-toe-cell"
        @click="() => !player && ticTacToeMove(i)"
      >
        <SvgCrossPreventAnimationCaching v-if="player?.tag === 'A'" />
        <SvgCirclePreventAnimationCaching v-else-if="player?.tag === 'B'" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tic-tac-toe-board {
  width: 120px;
  height: 120px;
  display: grid;
  grid-template-columns: auto auto auto;
}

.tic-tac-toe-cell {
  width: 40px;
  height: 40px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
