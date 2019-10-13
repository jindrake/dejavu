const { ApolloServer } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')

const typeDefs = `
  type Query {
    ping: String,
    next_session_question(
      sessionId: ID!,
      userId: ID!
    ): String,
    get_session_result(
      sessionId: ID!      
    ): String,
    get_topic_suggested_questions(
      topicId: ID,
      userId: ID
    ): String,
    get_user_sessions(
      userId: ID!
    ): String,
    get_average_score(
      topicId: ID
    ): String
  }
  type Mutation {
    create_session(
      topicId: ID!,
      userId: ID!,
      type: String
    ): String,
    answer_question(
      answers: [String!]!,
      questionId: ID!,
      sessionId: ID!,
      userId: ID!
    ): String,
    create_topic_feedback(
      topicId: ID!,
      rating: String,
      comment: String
    ): String,
    add_admin_by_email(
      topicId: ID!,
      email: String
    ): String,
    join_session(
      sessionId: ID!
    ): String
  }
`

const resolvers = require('./resolvers')

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

module.exports = new ApolloServer({
  schema,
  introspection: true,
  // playground: false,
  context: ({ req }) => {
    if (req.headers['x-hasura-user-id']) {
      return {
        user: {
          id: req.headers['x-hasura-user-id']
        }
      }
    }
  }
})
