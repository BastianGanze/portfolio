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
// A namespace for generated variants and helper functions.
export namespace DbBoardGameParam {
  // These are the generated variant types for each variant of the tagged union.
  // One type is generated per variant and will be used in the `value` field of
  // the tagged union.
  export type TicTacToe = { tag: "TicTacToe" };
  export type Connect4 = { tag: "Connect4" };
  export type Go = { tag: "Go" };

  // Helper functions for constructing each variant of the tagged union.
  // ```
  // const foo = Foo.A(42);
  // assert!(foo.tag === "A");
  // assert!(foo.value === 42);
  // ```
  export const TicTacToe = { tag: "TicTacToe" };
  export const Connect4 = { tag: "Connect4" };
  export const Go = { tag: "Go" };

  export function getTypeScriptAlgebraicType(): AlgebraicType {
    return AlgebraicType.createSumType([
      new SumTypeVariant("TicTacToe", AlgebraicType.createProductType([])),
      new SumTypeVariant("Connect4", AlgebraicType.createProductType([])),
      new SumTypeVariant("Go", AlgebraicType.createProductType([])),
    ]);
  }

  export function serialize(writer: BinaryWriter, value: DbBoardGameParam): void {
      DbBoardGameParam.getTypeScriptAlgebraicType().serialize(writer, value);
  }

  export function deserialize(reader: BinaryReader): DbBoardGameParam {
      return DbBoardGameParam.getTypeScriptAlgebraicType().deserialize(reader);
  }

}

// The tagged union or sum type for the algebraic type `DbBoardGameParam`.
export type DbBoardGameParam = DbBoardGameParam.TicTacToe | DbBoardGameParam.Connect4 | DbBoardGameParam.Go;

export default DbBoardGameParam;

