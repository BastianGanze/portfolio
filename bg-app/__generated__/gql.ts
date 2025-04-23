/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query getPosts($orderBy: [PostOrderByInput!]!, $take: Int, $skip: Int!) {\n        posts(orderBy: $orderBy, take: $take, skip: $skip) {\n            id\n            title\n            titleGerman\n            content {\n                document\n            }\n            contentGerman {\n                document\n            }\n            createdAt\n            tags {\n                id\n                name\n            }\n        }\n    }": typeof types.GetPostsDocument,
    "\n    query Query($where: ProjectWhereInput!) {\n        projects(where: $where) {\n            content {\n                document\n            }\n            contentGerman {\n                document\n            }\n            finishedAt\n            id\n            link\n            mainImage {\n                url\n            }\n            shortDescription {\n                document\n            }\n            shortDescriptionGerman {\n                document\n            }\n            roomId\n            game\n            startedAt\n            title\n            titleGerman\n        }\n    }\n": typeof types.QueryDocument,
};
const documents: Documents = {
    "\n    query getPosts($orderBy: [PostOrderByInput!]!, $take: Int, $skip: Int!) {\n        posts(orderBy: $orderBy, take: $take, skip: $skip) {\n            id\n            title\n            titleGerman\n            content {\n                document\n            }\n            contentGerman {\n                document\n            }\n            createdAt\n            tags {\n                id\n                name\n            }\n        }\n    }": types.GetPostsDocument,
    "\n    query Query($where: ProjectWhereInput!) {\n        projects(where: $where) {\n            content {\n                document\n            }\n            contentGerman {\n                document\n            }\n            finishedAt\n            id\n            link\n            mainImage {\n                url\n            }\n            shortDescription {\n                document\n            }\n            shortDescriptionGerman {\n                document\n            }\n            roomId\n            game\n            startedAt\n            title\n            titleGerman\n        }\n    }\n": types.QueryDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query getPosts($orderBy: [PostOrderByInput!]!, $take: Int, $skip: Int!) {\n        posts(orderBy: $orderBy, take: $take, skip: $skip) {\n            id\n            title\n            titleGerman\n            content {\n                document\n            }\n            contentGerman {\n                document\n            }\n            createdAt\n            tags {\n                id\n                name\n            }\n        }\n    }"): (typeof documents)["\n    query getPosts($orderBy: [PostOrderByInput!]!, $take: Int, $skip: Int!) {\n        posts(orderBy: $orderBy, take: $take, skip: $skip) {\n            id\n            title\n            titleGerman\n            content {\n                document\n            }\n            contentGerman {\n                document\n            }\n            createdAt\n            tags {\n                id\n                name\n            }\n        }\n    }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Query($where: ProjectWhereInput!) {\n        projects(where: $where) {\n            content {\n                document\n            }\n            contentGerman {\n                document\n            }\n            finishedAt\n            id\n            link\n            mainImage {\n                url\n            }\n            shortDescription {\n                document\n            }\n            shortDescriptionGerman {\n                document\n            }\n            roomId\n            game\n            startedAt\n            title\n            titleGerman\n        }\n    }\n"): (typeof documents)["\n    query Query($where: ProjectWhereInput!) {\n        projects(where: $where) {\n            content {\n                document\n            }\n            contentGerman {\n                document\n            }\n            finishedAt\n            id\n            link\n            mainImage {\n                url\n            }\n            shortDescription {\n                document\n            }\n            shortDescriptionGerman {\n                document\n            }\n            roomId\n            game\n            startedAt\n            title\n            titleGerman\n        }\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;