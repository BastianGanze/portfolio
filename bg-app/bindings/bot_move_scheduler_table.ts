// THIS FILE IS AUTOMATICALLY GENERATED BY SPACETIMEDB. EDITS TO THIS FILE
// WILL NOT BE SAVED. MODIFY TABLES IN YOUR MODULE SOURCE CODE INSTEAD.

/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
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
import { BotMoveScheduler } from "./bot_move_scheduler_type";
import type { EventContext, Reducer, RemoteReducers, RemoteTables } from ".";

/**
 * Table handle for the table `bot_move_scheduler`.
 *
 * Obtain a handle from the [`botMoveScheduler`] property on [`RemoteTables`],
 * like `ctx.db.botMoveScheduler`.
 *
 * Users are encouraged not to explicitly reference this type,
 * but to directly chain method calls,
 * like `ctx.db.botMoveScheduler.on_insert(...)`.
 */
export class BotMoveSchedulerTableHandle {
  tableCache: TableCache<BotMoveScheduler>;

  constructor(tableCache: TableCache<BotMoveScheduler>) {
    this.tableCache = tableCache;
  }

  count(): number {
    return this.tableCache.count();
  }

  iter(): Iterable<BotMoveScheduler> {
    return this.tableCache.iter();
  }
  /**
   * Access to the `scheduled_id` unique index on the table `bot_move_scheduler`,
   * which allows point queries on the field of the same name
   * via the [`BotMoveSchedulerScheduledIdUnique.find`] method.
   *
   * Users are encouraged not to explicitly reference this type,
   * but to directly chain method calls,
   * like `ctx.db.botMoveScheduler.scheduled_id().find(...)`.
   *
   * Get a handle on the `scheduled_id` unique index on the table `bot_move_scheduler`.
   */
  scheduled_id = {
    // Find the subscribed row whose `scheduled_id` column value is equal to `col_val`,
    // if such a row is present in the client cache.
    find: (col_val: bigint): BotMoveScheduler | undefined => {
      for (let row of this.tableCache.iter()) {
        if (deepEqual(row.scheduled_id, col_val)) {
          return row;
        }
      }
    },
  };

  onInsert = (cb: (ctx: EventContext, row: BotMoveScheduler) => void) => {
    return this.tableCache.onInsert(cb);
  }

  removeOnInsert = (cb: (ctx: EventContext, row: BotMoveScheduler) => void) => {
    return this.tableCache.removeOnInsert(cb);
  }

  onDelete = (cb: (ctx: EventContext, row: BotMoveScheduler) => void) => {
    return this.tableCache.onDelete(cb);
  }

  removeOnDelete = (cb: (ctx: EventContext, row: BotMoveScheduler) => void) => {
    return this.tableCache.removeOnDelete(cb);
  }

  // Updates are only defined for tables with primary keys.
  onUpdate = (cb: (ctx: EventContext, oldRow: BotMoveScheduler, newRow: BotMoveScheduler) => void) => {
    return this.tableCache.onUpdate(cb);
  }

  removeOnUpdate = (cb: (ctx: EventContext, onRow: BotMoveScheduler, newRow: BotMoveScheduler) => void) => {
    return this.tableCache.removeOnUpdate(cb);
  }}
