// noinspection SqlNoDataSourceInspection

import type { Identity } from '@clockworklabs/spacetimedb-sdk'
import type {
  DbBoardGameMove,
  DbBoardGameParam,
  DbVector2,
  ErrorContext,
  Room,
  User,
  UserCursor,
  VersusGameInstance,
} from '~/bindings'
import { DbConnection } from '~/bindings'
import { Deferred } from '~/utils'

export const useGameStore = defineStore('gameStore', () => {
  const currentUserId = ref<string | null>(null)
  const users = ref<Record<string, User & { colorClass: string }>>({})
  const userCursors = ref<{ [key: string]: UserCursor }>({})
  let connected = new Deferred()
  const isConnected = ref(false)
  let dbConn: DbConnection | null = null
  const authToken = useCookie<string>('gameAuthToken', { default: () => '' })
  const rooms = ref<Record<number, Room>>({})
  const gameInstances = ref<Record<number, VersusGameInstance>>({})
  let currentRoomId = 0
  let cursorSubscription: null | { unsubscribe: () => void } = null
  const runtimeConfig = useRuntimeConfig()

  function hashIdToRange(id: string, range: number) {
    const hash = id.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0)
    }, 0)
    return Math.floor((hash % range) + 1)
  }

  let moveUser = (_pos: DbVector2) => {
  }
  let setCurrentRoomId = (_id: number) => {
  }
  let joinRandomGame = (_gameParam: DbBoardGameParam) => {
  }
  const makeRandomBoardGameMove = (_instanceId: number) => {
  }
  let makeBoardGameMove = (_instanceId: number, _boardGameMove: DbBoardGameMove) => {
  }
  let forceStartGame = (_instanceId: number) => {
  }

  let abandonGame = () => {
  }
  if (import.meta.client) {
    const subToRoom = (roomId: number) => {
      if (cursorSubscription) {
        cursorSubscription.unsubscribe()
      }
      cursorSubscription = dbConn!.subscriptionBuilder().subscribe(`SELECT *
                                                                          FROM user_cursor
                                                                          WHERE room = ${roomId}`)
    }
    const onConnect = (
      conn: DbConnection,
      id: Identity,
      token: string,
    ) => {
      currentUserId.value = id.toHexString()
      connected.resolve()
      isConnected.value = true
      authToken.value = token
      conn
        ?.subscriptionBuilder()
        .subscribe('SELECT * FROM user')
      conn
        ?.subscriptionBuilder()
        .subscribe('SELECT * FROM room')
      conn
        ?.subscriptionBuilder()
        .subscribe('SELECT * FROM versus_game_instance')
      subToRoom(currentRoomId)
    }

    const onDisconnect = () => {
      isConnected.value = false
    }

    const connectDb = () => {
      connected = new Deferred()
      dbConn = DbConnection.builder()
        .withUri(runtimeConfig.public.spacetimeEndpoint)
        .withModuleName('tic-tac-toe')
        .withToken(authToken.value)
        .onConnect(onConnect)
        .onDisconnect(onDisconnect)
        .onConnectError((_ctx: ErrorContext, err: Error) => {
          if (err.message?.includes('Failed to verify token')) {
            authToken.value = ''
            connectDb()
          }
          else {
            console.error('Error connecting', err)
          }
          connected.reject()
          isConnected.value = false
        })
        .build()

      dbConn.db.user.onInsert((_ctx, newRow) => {
        const id = newRow.identity.toHexString()
        if (newRow.online) {
          users.value[id] = { ...newRow, colorClass: `col-${hashIdToRange(id, 8)}` }
        }
      })

      dbConn.db.user.onUpdate((_ctx, oldRow, newRow) => {
        const id = newRow.identity.toHexString()
        if (newRow.online) {
          users.value[id] = { ...newRow, colorClass: `col-${hashIdToRange(id, 8)}` }
        }
        if (oldRow.online && !newRow.online) {
          delete users.value[id]
          delete userCursors.value[id]
        }
      })

      dbConn.db.userCursor.onInsert((_ctx, newRow) => {
        const id = newRow.identity.toHexString()
        if (id !== currentUserId.value && users.value[id] && users.value[id].online) {
          userCursors.value[id] = newRow
        }
      })

      dbConn.db.userCursor.onUpdate((_ctx, oldRow, newRow) => {
        const id = newRow.identity.toHexString()
        if (id !== currentUserId.value && users.value[id] && users.value[id].online) {
          if (oldRow.room !== newRow.room) {
            delete userCursors.value[id]
          }
          else {
            userCursors.value[id] = newRow
          }
        }
      })

      dbConn.reducers.onMoveToRoom((ctx, roomId) => {
        if (roomId !== currentRoomId) {
          const userId = ctx.event.callerIdentity.toHexString()
          delete userCursors.value[userId]
        }
      })

      dbConn.db.room.onInsert((_ctx, newRow) => {
        rooms.value[newRow.id] = newRow
      })

      dbConn.db.room.onUpdate((_ctx, _oldRow, newRow) => {
        rooms.value[newRow.id] = newRow
      })

      dbConn.db.versusGameInstance.onInsert((_ctx, newRow) => {
        gameInstances.value[newRow.id] = newRow
      })

      dbConn.db.versusGameInstance.onUpdate((_ctx, _oldRow, newRow) => {
        gameInstances.value[newRow.id] = newRow
      })

      moveUser = (pos: DbVector2) => {
        connected.promise.then(() => {
          dbConn!.reducers.movePosition(pos)
        })
      }

      setCurrentRoomId = (id: number) => {
        connected.promise.then(() => {
          currentRoomId = id
          dbConn!.reducers.moveToRoom(id)
          subToRoom(currentRoomId)
          userCursors.value = {}
        })
      }

      joinRandomGame = (gameParam: DbBoardGameParam) => {
        connected.promise.then(() => {
          dbConn!.reducers.joinRandomGame(gameParam)
        })
      }

      makeBoardGameMove = (instanceId: number, boardGameMove: DbBoardGameMove) => {
        connected.promise.then(() => {
          dbConn!.reducers.makeBoardGameMove(instanceId, boardGameMove)
        })
      }

      abandonGame = () => {
        connected.promise.then(() => {
          dbConn!.reducers.abandonGame()
        })
      }

      forceStartGame = (instanceId: number) => {
        connected.promise.then(() => {
          dbConn!.reducers.forceStartGame(instanceId)
        })
      }
    }
    connectDb()
  }
  return {
    connected,
    moveUser,
    userCursors,
    users,
    rooms,
    setCurrentRoomId,
    joinRandomGame,
    makeRandomBoardGameMove,
    makeBoardGameMove,
    abandonGame,
    forceStartGame,
    gameInstances,
    currentUserId,
  }
})
