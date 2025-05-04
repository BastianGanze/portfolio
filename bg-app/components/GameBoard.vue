<script setup lang="ts">
import type { Connect4, VersusGameInstance } from '~/bindings'
import { match } from 'ts-pattern'
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

function connect4Move(index: number) {
  if (!instance.value.matchStarted) {
    return
  }
  makeBoardGameMove(instance.value.id, { tag: 'Connect4', value: index })
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

type LocalConnect4Board = (Player | null)[][]
const connect4Width = 7
const connect4Height = 6
const connect4Board = computed(() => {
  if (instance.value.gameState.tag === 'Connect4') {
    const nextPlayer = instance.value.gameState.value.tilesOccupied.toString(2).split('1').length % 2 === 0 ? Player.A.tag : Player.B.tag
    const board = instance.value.gameState.value
    const [tilesA, tilesB] = match(nextPlayer)
      .with('A', () => [board.tilesNext, board.tilesNext ^ board.tilesOccupied])
      .with('B', () => [board.tilesNext ^ board.tilesOccupied, board.tilesNext])
      .otherwise(() => [0n, 0n])
    return Array.from({ length: connect4Width }, (_, col) => {
      return Array.from({ length: connect4Height }, (_, row) => {
        const r = BigInt(connect4Height - row - 1)
        return match([get(tilesA, BigInt(col), BigInt(r)), get(tilesB, BigInt(col), BigInt(r))])
          .with([true, false], () => ({
            tag: 'B',
          }))
          .with([false, true], () => ({
            tag: 'A',
          }))
          .with([false, false], () => null)
          .with([true, true], () => {
            console.error('Both players have a tile in the same position')
            return null
          })
          .exhaustive()
      })
    }) as LocalConnect4Board
  }
  return null
})

function mask(col: bigint, row: bigint): bigint {
  return 1n << (row + (col * 8n))
}

function get(tiles: bigint, col: bigint, row: bigint): boolean {
  return (tiles & mask(col, row)) !== 0n
}

function printConnect4Board(board: Connect4) {
  const [tilesA, tilesB] = match(currentUserPlayerTag.value)
    .with('A', () => [board.tilesNext, board.tilesNext ^ board.tilesOccupied])
    .with('B', () => [board.tilesNext ^ board.tilesOccupied, board.tilesNext])
    .otherwise(() => [0n, 0n])
  let output = ''
  for (let row = BigInt(connect4Height); row >= 0; row--) {
    for (let col = 0n; col < connect4Width; col++) {
      output += match([get(tilesA, col, row), get(tilesB, col, row)])
        .with([true, false], () => 'a')
        .with([false, true], () => 'b')
        .with([false, false], () => '.')
        .with([true, true], () => {
          console.error('Both players have a tile in the same position')
          return 'x'
        })
        .exhaustive()
    }
    output += '\n'
  }
  console.log(output)
}
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
    <div v-if="instance.gameState.tag === 'Connect4'" class="connect-4">
      <div class="connect-4-grid">
        <div
          v-for="(row, i) in connect4Board" :key="i" class="connect-4-grid-row"
        >
          <div class="connect-4-top-insert">
            <div
              class="connect-4-top-insert-cell"
              @click="() => connect4Move(i)"
            >
              <Icon name="line-md:arrow-down" />
            </div>
          </div>
          <div
            v-for="(player, j) in row"
            :key="`${i}-${j}`"
            class="connect-4-grid-cell"
            :class="{ 'text-primary': player?.tag && currentUserPlayerTag === player.tag, 'text-secondary': player?.tag && currentUserPlayerTag !== player.tag }"
          >
            <SvgCrossPreventAnimationCaching v-if="player?.tag === 'A'" />
            <SvgCirclePreventAnimationCaching v-else-if="player?.tag === 'B'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.connect-4 {
  width: 200px;
  height: 200px;
  position: relative;
}

.connect-4-grid {
  width: 200px;
  height: 200px;
  display: grid;
  grid-template-columns: auto auto auto auto auto auto auto;
}

.connect-4-grid-row:first-child .connect-4-grid-cell {
  border-left: 2px solid var(--color-base-300);
}

.connect-4-grid-row:last-child .connect-4-grid-cell {
  border-right: 2px solid var(--color-base-300);
}

.connect-4-top-insert-cell {
  width: 28px;
  height: 28px;
  display: flex;
  box-sizing: content-box;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.connect-4-top-insert-cell:hover {
  color: var(--color-primary);
}

.connect-4-grid-cell {
  width: 28px;
  height: 28px;
  display: flex;
  border-right: 2px dashed var(--color-base-200);
  border-bottom: 2px dashed var(--color-base-200);
  box-sizing: content-box;
  justify-content: center;
  align-items: center;
}

.connect-4-grid-cell:last-child {
  border-bottom: 2px solid var(--color-base-300);
}

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
