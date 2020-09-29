import gql from 'graphql-tag'

export const REMOVE_QUESTION = gql`
  mutation removeQuestion($input: DeleteQuestionTopicInput!) {
    deleteQuestionTopic(input: $input) {
      clientMutationId
    }
  }
`

export const UPDATE_QUESTION = gql`
  mutation updateQuestion($input: UpdateQuestionInput!) {
    updateQuestion(input: $input) {
      clientMutationId
    }
  }
`

export const DELETE_TOPIC_USER = gql`
  mutation deleteTopicUser($topicId: uuid, $email: String) {
    delete_topic_user(
      where: { _and: [{ topic_id: { _eq: $topicId } }, { email: { _eq: $email } }] }
    ) {
      affected_rows
    }
  }
`

export const DELETE_ALL_TOPIC_USERS = gql`
  mutation deleteTopicUsers($topicId: uuid) {
    delete_topic_user(where: { topic_id: { _eq: $topicId } }) {
      affected_rows
    }
  }
`

export const INSERT_QUESTION = gql`
  mutation insertQuestion(
    $input: CreateQuestionInput!
  ) {
    createQuestion(input: $input) {
      question {
        answers {
          nodes {
            answer
            id
          }
        }
        creator {
          firstName
          lastName
          id
        }
      }
    }
  }
`

export const INSERT_QUESTION_ANSWERS = gql`
  mutation insertQuestionAnswers($input: CreateQuestionAnswersInput!) {
    createQuestionAnswers (input: $input) {
      boolean
    }
  }
`

// export const INSERT_QUESTION_TOPIC = gql`
//   # mutation insertQuestionTopic($input: )
// `

export const INSERT_TOPIC_ADMIN = gql`
  mutation insertTopicAdmin($email: String, $topicId: ID!) {
    add_admin_by_email(email: $email, topicId: $topicId)
  }
`

export const DELETE_TOPIC_ADMIN = gql`
  mutation deleteTopicAdmin($userId: uuid, $topicId: uuid) {
    delete_admin_topic(
      where: { _and: [{ topic_id: { _eq: $topicId } }, { user_id: { _eq: $userId } }] }
    ) {
      affected_rows
    }
  }
`

export const INSERT_QUESTION_TOPIC_RELATIONSHIP = gql`
  mutation insertQuestionTopicRelationship($input: CreateQuestionTopicInput!) {
    createQuestionTopic(input: $input) {
      questionTopic {
        id
      }
    }
  }
`

export const FETCH_TOPIC = gql`
  query fetchTopic($id: UUID) {
    topics(condition: { id: $id }) {
      nodes {
        id
        isPublished
        isPrivate
        name
        topicRatings {
          nodes {
            id
            type
          }
        }
        questionTopics {
          nodes {
            id
          }
        }
        topicFields {
          nodes {
            id
            field
          }
        }
      }
    }
  }
`

export const FETCH_TOPIC_WITH_USERS = gql`
  query fetchTopicWithUsers($id: uuid) {
    topic(where: { id: { _eq: $id } }) {
      id
      is_published
      is_private
      name
      target_fields {
        id
        field
      }
      users {
        email
        is_allowed
      }
    }
  }
`

export const FETCH_TOPIC_WITH_ADMINS = gql`
  query fetchTopicWithUsers($id: uuid) {
    topic(where: { id: { _eq: $id } }) {
      id
      is_published
      is_private
      name
      target_fields {
        id
        field
      }
      admins {
        id
        user_id
        user {
          email
        }
      }
    }
  }
`

export const FETCH_TOPIC_QUESTIONS = gql`
  query fetchTopicQuestions($topicId: UUID) {
    # question_topic(where: { topic: { id: { _eq: $topicId } } }) {
    #   id
    #   question {
    #     answers {
    #       answer
    #       is_correct
    #       id
    #     }
    #     question
    #     img_url
    #     id
    #   }
    # }
    questionTopics(condition: {topicId: $topicId}) {
      nodes {
        id
        question {
          question
          imgUrl
          id
          answers {
            nodes {
              isCorrect
              id
              answer
            }
          }
        }
      }
    }
  }
`

export const FETCH_USER_PREVIOUS_QUESTIONS = gql`
  query getUserOldQuestions($creatorId: ID, $topicId: ID) {
    get_topic_suggested_questions(userId: $creatorId, topicId: $topicId)
  }
`

export const FETCH_FIELDS = gql`
  query fetchFields {
    enum_field(order_by: { field: asc }) {
      field
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
      is_published
      created_at
      ratings {
        id
        type
      }
      comments {
        id
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
  mutation publishTopic($input: UpdateTopicInput!) {
    updateTopic(input: $input) {
      clientMutationId
    }
  }
`

export const CREATE_SESSION = gql`
  mutation createSession($userId: ID!, $topicId: ID!, $type: String) {
    create_session(userId: $userId, topicId: $topicId, type: $type)
  }
`

export const UPDATE_TOPIC = gql`
  mutation updateTopic($topic: topic_set_input, $id: uuid!) {
    update_topic(_set: $topic, where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`

export const DELETE_ALL_TOPIC_FIELD_RELATIONSHIP = gql`
  mutation deleteTopicFieldRelationship($topicId: uuid!) {
    delete_topic_field(where: { _and: [{topic_id: {_eq: $topicId}}] }) {
      affected_rows
    }
  }
`

export const CREATE_TOPIC_FIELD_RELATIONSHIP = gql`
  mutation createTopicFieldRelationship($topicField: [topic_field_insert_input!]!) {
    insert_topic_field(objects: $topicField) {
      affected_rows
    }
  }
`

export const INSERT_TOPIC_USER = gql`
  mutation insertTopicUser($topicUser: [topic_user_insert_input!]!) {
    insert_topic_user(objects: $topicUser) {
      affected_rows
    }
  }
`
