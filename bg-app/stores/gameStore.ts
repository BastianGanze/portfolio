import type { Identity } from '@clockworklabs/spacetimedb-sdk'
import type { DbVector2, ErrorContext, Room, User, UserCursor } from '~/bindings'
import { DbConnection } from '~/bindings'

export const useGameStore = defineStore('gameStore', () => {
  const connected = ref(false)
  let currentUserId: string | null = null
  const users = ref<Record<string, User & { colorClass: string }>>({})
  const userCursors = ref<{ [key: string]: UserCursor }>({})
  let dbConn: DbConnection | null = null
  const authToken = useCookie<string>('gameAuthToken', { default: () => '' })
  const rooms = ref<Record<number, Room>>({})
  let currentRoomId = 0
  let cursorSubscription: null | { unsubscribe: () => void } = null

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
      currentUserId = id.toHexString()
      connected.value = true
      authToken.value = token
      conn
        ?.subscriptionBuilder()
        .subscribe('SELECT * FROM user')
      conn
        ?.subscriptionBuilder()
        .subscribe('SELECT * FROM room')
      subToRoom(currentRoomId)
    }

    const onDisconnect = () => {
      connected.value = false
    }

    const onConnectError = (_ctx: ErrorContext, err: Error) => {
      console.error('Error connecting to SpacetimeDB:', err)
    }

    dbConn = DbConnection.builder()
      .withUri('ws://127.0.0.1:3000')
      .withModuleName('tic-tac-toe')
      .withToken(authToken.value)
      .onConnect(onConnect)
      .onDisconnect(onDisconnect)
      .onConnectError(onConnectError)
      .build()

    dbConn.db.user.onInsert((_ctx, newRow) => {
      const id = newRow.identity.toHexString()
      if (newRow.online) {
        users.value[id] = { ...newRow, colorClass: `col-${hashIdToRange(id, 8)}` }
      }
    })

    dbConn.db.user.onUpdate((_ctx, oldRow, newRow) => {
      const id = newRow.identity.toHexString()
      if (!oldRow.online && newRow.online) {
        users.value[id] = { ...newRow, colorClass: `col-${hashIdToRange(id, 8)}` }
      }
      if (oldRow.online && !newRow.online) {
        delete users.value[id]
        delete userCursors.value[id]
      }
    })

    dbConn.db.userCursor.onInsert((_ctx, newRow) => {
      const id = newRow.identity.toHexString()
      if (id !== currentUserId && users.value[id] && users.value[id].online) {
        userCursors.value[id] = newRow
      }
    })

    dbConn.db.userCursor.onUpdate((_ctx, oldRow, newRow) => {
      const id = newRow.identity.toHexString()
      if (id !== currentUserId && users.value[id] && users.value[id].online) {
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

    moveUser = (pos: DbVector2) => {
      dbConn!.reducers.movePosition(pos)
    }

    setCurrentRoomId = (id: number) => {
      currentRoomId = id
      dbConn!.reducers.moveToRoom(id)
      subToRoom(currentRoomId)
      userCursors.value = {}
    }
  }
  return {
    connected,
    moveUser,
    userCursors,
    users,
    rooms,
    setCurrentRoomId,
  }
})
