import gql from 'graphql-tag'

export const FETCH_MY_TOPIC = gql`
  query fetchMyTopic($userId: uuid!) {
    topic(order_by: { created_at: desc }, limit: 10, where: { creator_id: { _eq: $userId } }) {
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
export const FETCH_TAKEN_TOPIC = gql`
  query fetchTakenTopic($userId: uuid!) {
    user_activity(
      order_by: { created_at: desc }
      where: { user_id: { _eq: $userId }, activity_type: { _eq: "answer" } }
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
