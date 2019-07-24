import gql from 'graphql-tag'

export const FETCH_HOT_TOPIC = gql`
  query {
    topic(order_by: {ratings_aggregate: {count: desc}}, limit: 10, where: {is_private: {_eq: false}}) {
      id
      name
      description
      created_at
      ratings {
        id
        type
      }
    }
  }
`

export const FETCH_RECENT_TOPIC = gql`
  query {
    topic(order_by: {created_at: desc}, limit: 10, where: {is_private: {_eq: false}}) {
      id
      name
      description
      created_at
      ratings {
        id
        type
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
