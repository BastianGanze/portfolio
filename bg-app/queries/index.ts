import { gql } from '~/__generated__'

export const GET_POSTS = gql(/* GraphQL */`
    query getPosts($orderBy: [PostOrderByInput!]!, $take: Int, $skip: Int!) {
        posts(orderBy: $orderBy, take: $take, skip: $skip) {
            id
            title
            titleGerman
            content {
                document
            }
            contentGerman {
                document
            }
            createdAt
            tags {
                id
                name
            }
        }
    }`)

export const GET_PROJECTS = gql(/* GraphQL */`
    query Query($where: ProjectWhereInput!) {
        projects(where: $where) {
            content {
                document
            }
            contentGerman {
                document
            }
            finishedAt
            id
            link
            mainImage {
                url
            }
            shortDescription {
                document
            }
            shortDescriptionGerman {
                document
            }
            roomId
            game
            startedAt
            title
            titleGerman
        }
    }
`)
