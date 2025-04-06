import { config } from '@keystone-6/core'
import { session, withAuth } from './auth'
import { environment } from './environment'
import { lists } from './schema'

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: environment.postgresUrl,
    },
    server: {
      cors: { origin: environment.cors?.split('|'), credentials: true },
    },
    lists,
    session,
  }),
)
