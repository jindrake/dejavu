import gql from 'graphql-tag'

export const REMOVE_QUESTION = gql`
  mutation removeQuestion($questionId: uuid!, $topicUri: String!) {
    delete_question_topic(
      where: { _and: { question_id: { _eq: $questionId }, topic: { uri: { _eq: $topicUri } } } }
    ) {
      affected_rows
      returning {
        id
      }
    }
    delete_question(where: { id: { _eq: $questionId } }) {
      affected_rows
      returning {
        id
      }
    }
  }
`

export const INSERT_QUESTION = gql`
  mutation insertQuestion(
    $questionObject: [question_insert_input!]!
    $questionTopic: [question_topic_insert_input!]!
  ) {
    insert_question(objects: $questionObject) {
      affected_rows
      returning {
        answers {
          answer
          id
        }
        creator {
          first_name
          last_name
          id
        }
      }
    }
    insert_question_topic(objects: $questionTopic) {
      affected_rows
    }
  }
`

export const FETCH_TOPIC = gql`
  subscription fetchTopic($uri: String!) {
    topic(where: { uri: { _eq: $uri } }) {
      id,
      is_published,
      name
    }
  }
`

export const FETCH_TOPIC_QUESTIONS = gql`
  subscription fetchTopicQuestions($topicUri: String!) {
    question_topic(where: { topic: { uri: { _eq: $topicUri } } }) {
      question {
        answers {
          answer
          is_correct
          id
        }
        question
        id
      }
    }
  }
`
export const FETCH_FULL_TOPIC = gql`
  query fetchFullTopic($topicId: uuid!) {
    topic(where: { id: { _eq: $topicId } }) {
      id
      name
      description
      is_private
      ratings {
        id
        type
      }
      creator {
        id
        first_name
        last_name
        email
      }
      questions {
        id
        question {
          id
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
