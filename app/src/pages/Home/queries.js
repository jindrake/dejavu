import gql from 'graphql-tag'

// export const FETCH_HOT_TOPICS = gql`
//   query fetchHotTopics {
//     topic(
//       order_by: { ratings_aggregate: { count: desc } }
//       limit: 10
//       where: { _and: [{ is_private: { _eq: false } }, { is_published: { _eq: true } }] }
//     ) {
//       id
//       name
//       description
//       created_at
//       target_fields {
//         id
//         field
//       }
//       ratings {
//         id
//         type
//       }
//     }
//   }
// `

export const FETCH_USER_SESSIONS = gql`
  query getUserSessions($userId: ID!) {
    get_user_sessions(userId: $userId)
  }
`

export const FETCH_RECENT_TOPICS = gql`
  query fetchRecentTopics {
    topics (orderBy: CREATED_AT_ASC, first: 10, condition: { isPrivate: false, isPublished: true }) {
    nodes {
      id
      name
      description
      createdAt
      topicFields {
        nodes {
          id
          field
        }
      }
      topicRatings {
        nodes {
          id
          type
        }
      }
    }
  }
  }
`

export const INSERT_USER_ACTIVITY = gql`
  mutation insertUserActivity($userActivity: [user_activity_insert_input!]!) {
    insert_user_activity(objects: $userActivity) {
      affected_rows
    }
  }
`
