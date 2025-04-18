import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import * as path from 'node:path'

const BINDINGS_DIR = path.resolve('./bindings')

const OLD_IMPORT = `
import {
  AlgebraicType,
  AlgebraicValue,
  BinaryReader,
  BinaryWriter,
  CallReducerFlags,
  ConnectionId,
  DbConnectionBuilder,
  DbConnectionImpl,
  DbContext,
  ErrorContextInterface,
  Event,
  EventContextInterface,
  Identity,
  ProductType,
  ProductTypeElement,
  ReducerEventContextInterface,
  SubscriptionBuilderImpl,
  SubscriptionEventContextInterface,
  SumType,
  SumTypeVariant,
  TableCache,
  TimeDuration,
  Timestamp,
  deepEqual,
} from "@clockworklabs/spacetimedb-sdk";
`.trim()

const NEW_IMPORT = `
import type {
  CallReducerFlags,
  DbContext,
  ErrorContextInterface,
  Event,
  EventContextInterface,
  ReducerEventContextInterface,
  SubscriptionEventContextInterface,
} from "@clockworklabs/spacetimedb-sdk";
import {
  AlgebraicType,
  AlgebraicValue,
  BinaryReader,
  BinaryWriter,
  ConnectionId, 
  DbConnectionBuilder,
  DbConnectionImpl,
  Identity,
  ProductType,
  ProductTypeElement,
  SubscriptionBuilderImpl,
  SumType,
  SumTypeVariant,
  TableCache,
  TimeDuration,
  Timestamp,
  deepEqual,
} from "@clockworklabs/spacetimedb-sdk";
`.trim()

const entries = readdirSync(BINDINGS_DIR, { withFileTypes: true })
for (const entry of entries) {
  if (entry.isFile() && entry.name.endsWith('.ts')) {
    const filePath = path.join(BINDINGS_DIR, entry.name)
    const contents = readFileSync(filePath, 'utf8')
    if (contents.includes(OLD_IMPORT)) {
      const spacetimeImportsReplaced = contents.replace(OLD_IMPORT, NEW_IMPORT)
      const generatedImportsReplaced = spacetimeImportsReplaced.replace(/import \{ EventContext, Reducer, RemoteReducers, RemoteTables \} from ".";/g, 'import type { EventContext, Reducer, RemoteReducers, RemoteTables } from ".";')
      if (generatedImportsReplaced !== contents) {
        writeFileSync(filePath, generatedImportsReplaced, 'utf8')
        console.log(`[Replaced] ${filePath}`)
      }
    }
  }
}
