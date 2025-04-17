import type { Identity } from '@clockworklabs/spacetimedb-sdk'
import type { ErrorContext } from '~/bindings'
import { DbConnection } from '~/bindings'

export const useGameStore = defineStore('gameStore', () => {
  const connected = ref(false)
  const identity = ref<Identity | null>(null)
  const conn = ref<DbConnection | null>(null)
  const authToken = useCookie<string>('gameAuthToken', { default: () => '' })

  if (import.meta.client) {
    const subscribeToQueries = (conn: DbConnection, queries: string[]) => {
      let count = 0
      for (const query of queries) {
        conn
          ?.subscriptionBuilder()
          .onApplied(() => {
            count++
            if (count === queries.length) {
              console.warn('SDK client cache initialized.')
            }
          })
          .subscribe(query)
      }
    }

    const onConnect = (
      conn: DbConnection,
      id: Identity,
      token: string,
    ) => {
      identity.value = id
      connected.value = true
      authToken.value = token
      console.warn(
        'Connected to SpacetimeDB with identity:',
        id.toHexString(),
      )
      conn.reducers.onSayHello(() => {
        console.warn('User said hello.')
      })

      subscribeToQueries(conn, ['SELECT * FROM message', 'SELECT * FROM user'])
    }

    const onDisconnect = () => {
      console.warn('Disconnected from SpacetimeDB')
      connected.value = false
    }

    const onConnectError = (_ctx: ErrorContext, err: Error) => {
      console.warn('Error connecting to SpacetimeDB:', err)
    }

    conn.value
        = DbConnection.builder()
        .withUri('ws://127.0.0.1:3000')
        .withModuleName('tic-tac-toe')
        .withToken(authToken.value)
        .onConnect(onConnect)
        .onDisconnect(onDisconnect)
        .onConnectError(onConnectError)
        .build()
  }

  return {
    connected,
    identity,
  }
})
