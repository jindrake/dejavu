import gql from 'graphql-tag'

export const REMOVE_QUESTION = gql`
  mutation removeQuestion($id: uuid!) {
    delete_question_topic(where: { id: { _eq: $id } }) {
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

export const INSERT_QUESTION_TOPIC_RELATIONSHIP = gql`
  mutation insertQuestionTopicRelationship($questionTopic: [question_topic_insert_input!]!) {
    insert_question_topic(objects: $questionTopic) {
      affected_rows
    }
  }
`

export const FETCH_TOPIC = gql`
  subscription fetchTopic($uri: String!) {
    topic(where: { uri: { _eq: $uri } }) {
      id
      is_published
      name
      target_fields {
        id
        field
      }
    }
  }
`

export const FETCH_TOPIC_QUESTIONS = gql`
  subscription fetchTopicQuestions($topicUri: String!) {
    question_topic(where: { topic: { uri: { _eq: $topicUri } } }) {
      id
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

export const FETCH_USER_PREVIOUS_QUESTIONS = gql`
  query getUserOldQuestions($creatorId: uuid!, $field: String!, $topicId: uuid!) {
    question(
      where: {
        _and: [
          { topics: { id: { _neq: $topicId } } }
          {
            creator_id: { _eq: $creatorId }
            topics: { topic: { target_fields: { field: { _eq: $field } } } }
          }
        ]
      }
    ) {
      answers {
        answer
        is_correct
        id
      }
      question
      id
    }
  }
`

export const FETCH_TOPIC_PREVIEW = gql`
  query fetchFullTopic($topicId: uuid!) {
    topic(where: { id: { _eq: $topicId } }) {
      id
      name
      description
      is_private
      created_at
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
        question_id
      }
      target_fields {
        id
        field
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

export const PUBLISH_TOPIC = gql`
  mutation publishTopic($topicId: uuid!, $isPublished: Boolean!) {
    update_topic(_set: { is_published: $isPublished }, where: { id: { _eq: $topicId } }) {
      affected_rows
    }
  }
`
