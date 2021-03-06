import gql from 'graphql-tag'

export const FETCH_MY_TOPIC = gql`
  query fetchMyTopic($userId: uuid!) {
    topic(order_by: { created_at: desc }, limit: 10, where: { creator_id: { _eq: $userId } }) {
      id
      name
      description
      created_at
      user_activities(where: {activity_type: {_eq: "take"}}) {
        id
      }
      ratings {
        id
        type
      }
      target_fields {
        id
        field
      }
      user_activities_aggregate (where: {activity_type: {_eq: "take"}}, distinct_on: user_id) {
        aggregate {
          count
        }
      }
    }
  }
`
export const FETCH_TAKEN_TOPIC = gql`
  query fetchTakenTopic($userId: uuid!) {
    user_activity(
      order_by: { created_at: desc }
      where: { user_id: { _eq: $userId }, activity_type: { _eq: "take" } }
      limit: 10
    ) {
      id
      topic {
        id
        name
        description
        is_private
        creator {
          id
          first_name
          last_name
        }
        questions {
          id
        }
        ratings {
          id
          type
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

export const FETCH_ACTIVITY_LOGS = gql`
  query fetchUserActivity($userId: uuid!) {
    user_activity(
      order_by: { created_at: desc }
      where: { user_id: { _eq: $userId }, activity_type: { _neq: "answer"} }
      limit: 10
    ) {
      id
      activity_type
      created_at
      topic_id
      question {
        topics {
          topic {
            name
          }
        }
      }
      topic {
        id
        name
        description
      }
    }
  }
`
