import gql from 'graphql-tag'

export const FETCH_TOPIC = gql`
  query fetchTopic($topicId: uuid) {
    topic(where: { id: { _eq: $topicId } }) {
      description
      name
      created_at
      comments {
        id
      }
      creator {
        first_name
        last_name
      }
      target_fields {
        id
        field
      }
      ratings {
        id
        type
      }
    }
  }
`
export const INSERT_TOPIC_COMMENT = gql`
  mutation insertTopicComment($commentObject: [topic_comment_insert_input!]!) {
    insert_topic_comment(objects: $commentObject) {
      affected_rows
    }
  }
`
export const INSERT_COMMENT_REPLY = gql`
  mutation insertCommentReply($parentId: uuid, $content: String, $userId: uuid, $id: uuid) {
    insert_topic_comment(objects: {parent_comment_id: $parentId parent_comment: {data: {content: $content, user_id: $userId, id: $id }}}) {
      affected_rows
    }
  }
`

export const INSERT_TOPIC_COMMENT_RATING = gql`
  mutation insertTopicCommentRating($commentRatingObject: [topic_comment_rating_insert_input!]!) {
    insert_topic_comment_rating(objects: $commentRatingObject) {
      affected_rows
    }
  }
`

export const FETCH_COMMENT_REPLY = gql`
  subscription fetchCommentReply($parentId: uuid) {
      topic_comment(where: {parent_comment_id: {_eq: $parentId }}) {
        created_at
        id
        parent_comment_id
        content
        topic_comment_ratings {
          rating
          user_id
        }
        user {
          first_name
          last_name
          id
        }
    }
  }
`

export const DELETE_COMMENT_RATING = gql`
  mutation ($userId: uuid, $topicCommentId: uuid, $rating: String) {
    delete_topic_comment_rating(where: {user_id: {_eq: $userId }, topic_comment_id: {_eq: $topicCommentId }, rating: {_eq: $rating }}) {
      affected_rows
    }
  }
`

export const FETCH_TOPIC_COMMENTS = gql`
  subscription fetchTopicComment($topicId: uuid) {
    topic_comment(where: {topic_id: {_eq: $topicId }, parent_comment_id: {_is_null: true} }) {
      id
      content
      created_at
      user {
        first_name
        last_name
        id
      }
      parent_comment {
        content
        created_at
      }
      topic_comment_ratings {
        rating
        user_id
      }
      topic_id
    }
  }
`
