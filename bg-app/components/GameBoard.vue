<script setup lang="ts">
import type { VersusGameInstance } from '~/bindings'
import { match } from 'ts-pattern'
import { Player } from '~/bindings'
import { useGameStore } from '~/stores/gameStore'

const props = defineProps<{ instance: VersusGameInstance, currentUserId: string }>()
const { instance, currentUserId } = toRefs(props)
const { makeBoardGameMove } = useGameStore()
const { t } = useLocalizationStore()

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

function goMovePlace(col: number, row: number) {
  if (!instance.value.matchStarted) {
    return
  }
  makeBoardGameMove(instance.value.id, { tag: 'Go', value: { tag: 'Place', value: { x: col, y: row } } })
}

function goMovePass() {
  if (!instance.value.matchStarted) {
    return
  }
  makeBoardGameMove(instance.value.id, { tag: 'Go', value: { tag: 'Pass' } })
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

type RenderBoard = (Player | null)[][]
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
    }) as RenderBoard
  }
  return null
})

function mask(col: bigint, row: bigint): bigint {
  return 1n << (row + (col * 8n))
}

function get(tiles: bigint, col: bigint, row: bigint): boolean {
  return (tiles & mask(col, row)) !== 0n
}

const goBoardsize = 9
const goBoard = computed(() => {
  if (instance.value.gameState.tag === 'Go') {
    const chains = instance.value.gameState.value.chains
    return Array.from(Array.from({ length: goBoardsize }), (_, i) => Array.from({ length: goBoardsize }).map((_, j) => {
      const tileIdx = i * goBoardsize + j
      const tile = chains.tiles[tileIdx]
      const groupIdx = tile.groupId.value
      const group = chains.groups[groupIdx]
      return group ? (group.color.tag === 'A' ? Player.A : Player.B) : null
    })) as RenderBoard
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
          <SvgCircleFullPreventAnimationCaching v-if="player?.tag === 'A'" />
          <SvgCircleFullPreventAnimationCaching v-else-if="player?.tag === 'B'" />
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
            <SvgCirclePreventAnimationCaching v-if="player?.tag === 'A'" />
            <SvgCirclePreventAnimationCaching v-else-if="player?.tag === 'B'" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="instance.gameState.tag === 'Go' && goBoard" class="flex flex-wrap">
      <div class="go-grid-bg" />
      <div class="go-grid">
        <div
          v-for="(row, i) in goBoard" :key="i" class="go-grid-row"
        >
          <div
            v-for="(player, j) in row"
            :key="`${i}-${j}`"
            class="go-grid-cell"
            :class="{ 'text-primary': player?.tag && currentUserPlayerTag === player.tag, 'text-secondary': player?.tag && currentUserPlayerTag !== player.tag }"
            @click="() => goMovePlace(j, i)"
          >
            <SvgCircleFullPreventAnimationCaching v-if="player?.tag === 'A'" />
            <SvgCircleFullPreventAnimationCaching v-else-if="player?.tag === 'B'" />
          </div>
        </div>
      </div>
      <div class="go-info flex flex-wrap flex-col justify-end p-4">
        <div class="go-pass">
          <span class="btn btn-accent" @click="goMovePass">{{
            t(instance.gameState.value
              .state.tag === 'Passed' ? 'goPassGameEndPassLabel' : 'goPassLabel')
          }} <Icon
            name="line-md:arrow-right"
          /></span>
        </div>
        <div class="go-score mt-2">
          <div class="text-sm">
            <span
              :class="{ 'text-primary': player?.tag && currentUserPlayerTag === player.tag, 'text-secondary': player?.tag && currentUserPlayerTag !== player.tag }"
            >{{
              t(currentUserPlayerTag === 'A' ? 'yourScoreLabel' : 'opponentScoreLabel')
            }}</span> <span>{{ instance.gameState.value.score.a }}</span>
          </div>
          <div class="text-sm">
            <span
              :class="{ 'text-primary': player?.tag && currentUserPlayerTag === player.tag, 'text-secondary': player?.tag && currentUserPlayerTag !== player.tag }"
            >{{
              t(currentUserPlayerTag === 'B' ? 'yourScoreLabel' : 'opponentScoreLabel')
            }}</span> <span>{{ instance.gameState.value.score.b }} + {{
              instance.gameState.value.komi.komi2
            }} (<a
              class="link link-info" href="https://en.wikipedia.org/wiki/Komi_(Go)"
              target="_blank"
              aria-label="Link to Komi explanation"
            >Komi</a>)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.go {
  position: relative;
}

.go-grid-bg {
  position: absolute;
  left: 12px;
  top: 12px;
  width: 193px;
  height: 193px;
  background-size: 24px 24px;
  background-image: linear-gradient(to right, var(--color-base-200) 1px, transparent 1px),
  linear-gradient(to bottom, var(--color-base-200) 1px, transparent 1px);
}

.go-grid {
  position: relative;
  width: 216px;
  height: 216px;
}

.go-grid-row {
  display: flex;
}

.go-grid-cell {
  width: 24px;
  height: 24px;
  display: flex;
  box-sizing: content-box;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

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
