import * as fs from 'node:fs'
import * as process from 'node:process'
import * as dotenv from 'dotenv'

dotenv.config()

const environmentContent = `export const environment = {
  dbHost: '${process.env.DB_HOST || ''}',
  dbUsername: '${process.env.DB_USERNAME || ''}',
  dbPassword: '${process.env.DB_PASSWORD || ''}',
  dbDatabase: '${process.env.DB_DATABASE || ''}',
  dbPort: ${process.env.DB_PORT || 5432},
  sessionSecret: "${process.env.SESSION_SECRET || ''}",
  cors: '${process.env.CORS || ''}',
  get postgresUrl() {
    return \`postgres://\${this.dbUsername}:\${this.dbPassword}@\${this.dbHost}:\${this.dbPort}/\${this.dbDatabase}\`;
  },
};
`

fs.writeFileSync('environment.ts', environmentContent)
console.log('environment.ts file has been generated successfully.')
