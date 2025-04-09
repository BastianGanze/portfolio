import { createAuth } from '@keystone-6/auth'
import { statelessSessions } from '@keystone-6/core/session'
import { environment } from './environment'

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  sessionData: 'name createdAt isAdmin',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
})

const sessionMaxAge = 60 * 60 * 24 * 30

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: environment.sessionSecret,
})

interface Session {
  data: {
    id: string
    isAdmin: boolean
  }
}

const isAdmin = ({ session }: { session?: Session }) => Boolean(session?.data.isAdmin)

export { isAdmin, session, withAuth }
