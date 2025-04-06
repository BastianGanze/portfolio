import * as assert from 'node:assert'
import * as fs from 'node:fs'
import * as process from 'node:process'
import * as dotenv from 'dotenv'

dotenv.config()

function envIsValid(env: string | number | undefined) {
  if (typeof env === 'string') {
    return env === '__NOT_PROVIDED__' ? false : env.trim().length > 0
  }
  return typeof env === 'number'
}

assert.ok(envIsValid(process.env.DB_HOST), 'DB_HOST is not set in the environment variables.')
assert.ok(envIsValid(process.env.DB_USERNAME), 'DB_USERNAME is not set in the environment variables.')
assert.ok(envIsValid(process.env.DB_PASSWORD), 'DB_PASSWORD is not set in the environment variables.')
assert.ok(envIsValid(process.env.DB_DATABASE), 'DB_DATABASE is not set in the environment variables.')
assert.ok(envIsValid(process.env.DB_PORT), 'DB_PORT is not set in the environment variables.')
assert.ok(envIsValid(process.env.SESSION_SECRET), 'SESSION_SECRET is not set in the environment variables.')
assert.ok(envIsValid(process.env.CORS), 'CORS is not set in the environment variables.')

const environmentContent = `export const environment = {
  dbHost: '${process.env.DB_HOST}',
  dbUsername: '${process.env.DB_USERNAME}',
  dbPassword: '${process.env.DB_PASSWORD}',
  dbDatabase: '${process.env.DB_DATABASE}',
  dbPort: ${process.env.DB_PORT},
  sessionSecret: "${process.env.SESSION_SECRET}",
  cors: '${process.env.CORS}',
  get postgresUrl() {
    return \`postgres://\${this.dbUsername}:\${this.dbPassword}@\${this.dbHost}:\${this.dbPort}/\${this.dbDatabase}\`;
  },
};
`

fs.writeFileSync('environment.ts', environmentContent)
console.log('environment.ts file has been generated successfully.')
