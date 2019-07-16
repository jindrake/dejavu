import gql from 'graphql-tag'

export const FETCH_ALL_TOPIC = gql`
  subscription {
    topic {
      id
      name
      description
      creator {
        id
        first_name
        last_name
      }
    }
  }
`

export const INSERT_USER_ACTIVITY = gql`
  mutation insertUserActivity ($userAcivity: [user_activity_insert_input!]!) {
    insert_user_activity(objects: $userAcivity) {
      affected_rows
    }
  }
`
