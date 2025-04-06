import { gql } from '~/__generated__'

export const GET_POSTS = gql(/* GraphQL */`
    query getPosts($orderBy: [PostOrderByInput!]!, $take: Int, $skip: Int!) {
  posts(orderBy: $orderBy, take: $take, skip: $skip) {
    id
    title
    content {
      document
    }
    createdAt
    tags {
      id
      name
    }
  }
}`)
