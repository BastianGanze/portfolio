// THIS FILE IS AUTOMATICALLY GENERATED BY SPACETIMEDB. EDITS TO THIS FILE
// WILL NOT BE SAVED. MODIFY TABLES IN YOUR MODULE SOURCE CODE INSTEAD.

/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import {
  AlgebraicType,
  BinaryReader,
  BinaryWriter,
  Identity,
  ProductTypeElement,
  Timestamp,
} from "@clockworklabs/spacetimedb-sdk";
export type User = {
  identity: Identity,
  name: string | undefined,
  firstSeen: Timestamp,
  online: boolean,
};

/**
 * A namespace for generated helper functions.
 */
export namespace User {
  /**
  * A function which returns this type represented as an AlgebraicType.
  * This function is derived from the AlgebraicType used to generate this type.
  */
  export function getTypeScriptAlgebraicType(): AlgebraicType {
    return AlgebraicType.createProductType([
      new ProductTypeElement("identity", AlgebraicType.createIdentityType()),
      new ProductTypeElement("name", AlgebraicType.createOptionType(AlgebraicType.createStringType())),
      new ProductTypeElement("firstSeen", AlgebraicType.createTimestampType()),
      new ProductTypeElement("online", AlgebraicType.createBoolType()),
    ]);
  }

  export function serialize(writer: BinaryWriter, value: User): void {
    User.getTypeScriptAlgebraicType().serialize(writer, value);
  }

  export function deserialize(reader: BinaryReader): User {
    return User.getTypeScriptAlgebraicType().deserialize(reader);
  }

}


