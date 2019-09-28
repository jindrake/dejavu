const graphql = require('./graphql')
const gql = require('graphql-tag')
const { ApolloError } = require('apollo-server-express')
const { shuffleArray, getObjectValue } = require('../libs')
const uuid = require('uuid/v4')
const sentry = require('../sentry')

module.exports = {
  Query: {
    ping: (parent, args, context) => {
      try {
        console.log(context)
        console.log('Args:', args)
        return 'pong'
      } catch (error) {
        return 'error but pong'
      }
    },
    next_session_question: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
        const { sessionId, userId } = args
        // get session
        const {
          data: {
            session: [session]
          }
        } = await graphql.query(
          gql`
            query getSession($sessionId: uuid!) {
              session(where: { id: { _eq: $sessionId } }) {
                id
                type
                creator_id
                session_questions {
                  question_id
                  question {
                    id
                    question
                    answers {
                      id
                      answer
                    }
                  }
                }
              }
            }
          `,
          {
            sessionId
          }
        )
        // fetch user_activities of session
        const {
          data: {
            user_activity: sessionActivities
          }
        } = await graphql.query(
          gql`
            query fetchUserActivities($sessionId: uuid) {
              user_activity(where: {_and: [{topic_session_id: {_eq: $sessionId}}, {activity_type: {_eq: "answer"}}]}) {
                id
                answer
                question_id
                user_id
              }
            }
          `,
          {
            sessionId
          }
        )
        // check if user belongs in the session
        const {
          data: {
            session_user: [sessionUser]
          }
        } = await graphql.query(
          gql`
            query getSessionUser($userId: uuid!, $sessionId: uuid!) {
              session_user(
                where: {
                  _and: [{ user_id: { _eq: $userId } }, { session_id: { _eq: $sessionId } }]
                }
              ) {
                user_id
              }
            }
          `,
          {
            userId,
            sessionId
          }
        )
        if (!sessionUser) throw new ApolloError('Authorization error')
        const sessionQuestions = getObjectValue(session, 'session_questions') || []
        const userActivities = sessionActivities.filter(activity => activity.user_id === context.user.id)
        const userQuestionIds = userActivities.map((activity) => activity.question_id)
        // see next question that's unanswered
        let nextQuestion = null
        // console.log('Session Questions:', sessionQuestions.map(x => x.question_id), userQuestionIds)
        for (let sessionQuestion of sessionQuestions) {
          if (!userQuestionIds.includes(sessionQuestion.question_id)) {
            nextQuestion = sessionQuestion.question
            break
          }
        }
        if (!nextQuestion) {
          return null
        }
        // check if duo
        if (session.type === 'duo') {
          // get opponents activities
          const opponentsQuestionIds = sessionActivities
            .filter((activity) => activity.user_id !== context.user.id)
            .map((activity) => activity.question_id)

          // check if opponent is finished with the session
          const isOpponentFinished = sessionQuestions.every(question => opponentsQuestionIds.includes(question.question_id))

          if (session.creator_id === context.user.id) {
            if (isOpponentFinished) {
              throw new Error('Integrity Error: opponent finished before the creator')
            }
            if (
              userQuestionIds.length - opponentsQuestionIds.length === 2 ||
              (userQuestionIds.length - opponentsQuestionIds.length === 1 &&
                userQuestionIds.length % 2 === 0)
            ) {
              console.log('Session creator and is waiting!')
              return 'waiting'
            }
          } else {
            if (!isOpponentFinished) {
              if (
                (!opponentsQuestionIds.length && !userQuestionIds.length) ||
                (opponentsQuestionIds.length - userQuestionIds.length === 1 &&
                  userQuestionIds.length % 2 === 0) ||
                (userQuestionIds.length === opponentsQuestionIds.length &&
                  opponentsQuestionIds.length % 2 === 0) ||
                  userQuestionIds.length > opponentsQuestionIds.length
              ) {
                console.log('Session challenger and is waiting!')
                return 'waiting'
              }
            }
          }
        }

        return JSON.stringify(nextQuestion)
      } catch (error) {
        console.log(error.message)
        sentry.captureException(error)
        sentry.captureMessage('next_session_question:', error.message)
        throw new ApolloError(error)
      }
    },
    get_session_result: async (parent, args, context) => {
      return 'test'
    },
    get_topic_suggested_questions: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
        const { topicId, userId } = args
        // fetch topic
        const {
          data: {
            topic: [topic]
          }
        } = await graphql.query(
          gql`
            query fetchTopic($topicId: uuid!) {
              topic(where: { id: { _eq: $topicId } }) {
                id
                questions {
                  question_id
                }
              }
            }
          `,
          {
            topicId
          }
        )
        if (!topic) {
          throw new Error('Topic not found')
        }
        // fetch questions
        const topicQuestionIds = topic
          ? topic.questions.map((question) => question.question_id)
          : []
        console.log('TopicQuestionIds: ', topicQuestionIds)
        const {
          data: { question: questions }
        } = await graphql.query(
          gql`
            query getUserOldQuestions($userId: uuid, $topicIds: [uuid!]!) {
              question(
                where: { _and: [{ creator_id: { _eq: $userId } }, { id: { _nin: $topicIds } }] }
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
          `,
          {
            userId,
            topicIds: topicQuestionIds
          }
        )
        console.log(questions)
        return questions && questions.length ? JSON.stringify(questions) : null
      } catch (error) {
        console.log(error.message)
        sentry.captureException(error)
        sentry.captureMessage('get_topic_suggested_questions:', error.message)
        throw new ApolloError(error)
      }
    }
  },
  Mutation: {
    create_topic_feedback: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
        const { sessionId, rating, comment } = args
        console.log(args, context.user)
        if (!rating && !comment) {
          throw new ApolloError('At least a rating or a comment is required')
        }
        // get session with topic
        const {
          data: {
            session: [session]
          }
        } = await graphql.query(
          gql`
            query getSession($sessionId: uuid!, $userId: uuid!) {
              session(
                where: {
                  _and: [
                    { id: { _eq: $sessionId } }
                    { session_users: { user_id: { _eq: $userId } } }
                  ]
                }
              ) {
                id
                topic_id
              }
            }
          `,
          {
            sessionId,
            userId: context.user.id
          }
        )
        if (rating) {
          await graphql.mutate(
            gql`
              mutation deleteTopicRating($topicId: uuid, $userId: uuid) {
                delete_topic_rating(
                  where: { _and: [{ topic_id: { _eq: $topicId } }, { user_id: { _eq: $userId } }] }
                ) {
                  affected_rows
                }
              }
            `,
            {
              topicId: session.topic_id,
              userId: context.user.id
            }
          )
          await graphql.mutate(
            gql`
              mutation insertRating($rating: [topic_rating_insert_input!]!) {
                insert_topic_rating(objects: $rating) {
                  affected_rows
                }
              }
            `,
            {
              rating: {
                id: uuid(),
                user_id: context.user.id,
                topic_id: session.topic_id,
                type: rating
              }
            }
          )
        }

        const commentId = uuid()
        // insert comment
        if (comment) {
          await graphql.mutate(
            gql`
              mutation insertComment($comment: [topic_comment_insert_input!]!) {
                insert_topic_comment(objects: $comment) {
                  affected_rows
                }
              }
            `,
            {
              comment: {
                id: commentId,
                topic_id: session.topic_id,
                content: comment,
                session_id: sessionId,
                user_id: context.user.id
              }
            }
          )
        }
        // insert user_activity
        await graphql.mutate(
          gql`
            mutation insertActivity($activity: [user_activity_insert_input!]!) {
              insert_user_activity(objects: $activity) {
                affected_rows
              }
            }
          `,
          {
            activity: {
              id: uuid(),
              activity_type: rating ? 'rate' : comment ? 'comment' : 'rate',
              user_id: context.user.id,
              topic_id: session.topic_id,
              topic_comment_id: comment ? commentId : null,
              topic_session_id: sessionId
            }
          }
        )
      } catch (error) {
        console.log(error.message)
        sentry.captureException(error)
        sentry.captureMessage('crate_topic_feedback:', error.message)
        throw new ApolloError(error)
      }
    },
    create_session: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
        // fetch topic
        const { userId, topicId, type = 'solo' } = args
        console.log('TopicId:', topicId)
        const {
          data: {
            topic: [topic]
          }
        } = await graphql.query(
          gql`
            query fetchTopic($topicId: uuid!) {
              topic(where: { id: { _eq: $topicId } }) {
                id
                questions {
                  question_id
                }
              }
            }
          `,
          {
            topicId
          }
        )
        if (!topic) {
          throw new Error('Topic not found')
        }
        const {
          data: {
            user: [user]
          }
        } = await graphql.query(
          gql`
            query fetchUser($userId: uuid!) {
              user(where: { id: { _eq: $userId } }) {
                id
              }
            }
          `,
          {
            userId
          }
        )
        if (!user) {
          throw new Error('User not found')
        }

        console.log('Topic:', topic, topicId)
        // get subset of question ids
        const unshuffledQuestionIds = topic.questions.map((q) => q.question_id)
        let questionSubset = null
        if (type === 'duo') {
          questionSubset = shuffleArray(unshuffledQuestionIds).splice(0, 5)
        } else if (unshuffledQuestionIds.length > 10) {
          questionSubset = shuffleArray(unshuffledQuestionIds).splice(
            0,
            Math.ceil(unshuffledQuestionIds.length / 3)
          )
        } else {
          questionSubset = shuffleArray(unshuffledQuestionIds).splice(
            0,
            Math.ceil(unshuffledQuestionIds.length / 2)
          )
        }
        // create session object
        const sessionId = uuid()

        await graphql.mutate(
          gql`
            mutation createSession($session: [session_insert_input!]!) {
              insert_session(objects: $session) {
                affected_rows
                returning {
                  id
                }
              }
            }
          `,
          {
            session: [
              {
                id: sessionId,
                topic_id: topicId,
                type,
                creator_id: userId
              }
            ]
          }
        )
        // use session object to connect questions and session
        for (let questionId of questionSubset) {
          await graphql.mutate(
            gql`
              mutation createSessionQuestion($sessionQuestion: [session_question_insert_input!]!) {
                insert_session_question(objects: $sessionQuestion) {
                  affected_rows
                }
              }
            `,
            {
              sessionQuestion: [
                {
                  question_id: questionId,
                  session_id: sessionId
                }
              ]
            }
          )
        }
        // set user to session in session_user
        await graphql.mutate(
          gql`
            mutation createSessionUser($sessionUser: [session_user_insert_input!]!) {
              insert_session_user(objects: $sessionUser) {
                affected_rows
              }
            }
          `,
          {
            sessionUser: [
              {
                user_id: userId,
                session_id: sessionId
              }
            ]
          }
        )
        // insert user activity
        await graphql.mutate(
          gql(`
            mutation insertUserActivity {
              insert_user_activity(objects: {
                id: "${uuid()}",
                activity_type: "take",
                user_id: "${userId}",
                topic_id: "${topicId}",
                topic_session_id: "${sessionId}"
              }) {
                affected_rows
              }
            }
          `)
        )
        return sessionId
      } catch (error) {
        console.log(error.message)
        sentry.captureException(error)
        sentry.captureMessage('create_session:', error.message)
        throw new ApolloError(error)
      }
    },
    answer_question: async (parent, args, context) => {
      try {
        const { answers, questionId, sessionId, userId } = args
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
        // check if duplicate activity_type & topic_session_id & user_id
        // const {
        //   data: { user_activity }
        // } = await graphql.query(
        //   gql`
        //     query fetchUserActivity($sessionId: uuid, $userId: uuid) {
        //       user_activity(
        //         where: {
        //           _and: [
        //             { activity_type: { _eq: "answer" } }
        //             { topic_session_id: { _eq: $sessionId } }
        //             { user_id: { _eq: $userId } }
        //           ]
        //         }
        //       ) {
        //         id
        //       }
        //     }
        //   `,
        //   {
        //     sessionId,
        //     userId: context.user.id
        //   }
        // )
        // if (user_activity.length) {
        //   throw new Error('Duplicate activity')
        // }
        await graphql.mutate(
          gql`
            mutation insertUserActivity($userActivity: [user_activity_insert_input!]!) {
              insert_user_activity(objects: $userActivity) {
                affected_rows
              }
            }
          `,
          {
            userActivity: {
              id: uuid(),
              topic_session_id: sessionId,
              answer: JSON.stringify(answers),
              user_id: userId,
              question_id: questionId,
              activity_type: 'answer'
            }
          }
        )
        return 'success'
      } catch (error) {
        console.error(error)
        sentry.captureException(error)
        sentry.captureMessage('answer_question:', error.message)
        throw new ApolloError(error)
      }
    },
    add_admin_by_email: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
        const { email, topicId } = args
        // fetch topic
        const {
          data: {
            topic: [topic]
          }
        } = await graphql.query(
          gql`
            query fetchTopic($topicId: uuid!) {
              topic(where: { id: { _eq: $topicId } }) {
                id
                admins {
                  user_id
                }
                creator_id
              }
            }
          `,
          {
            topicId
          }
        )
        if (!topic) {
          throw new Error('Topic not found')
        }
        // check if user doing the operation is an admin / creator
        if (
          !context.user.id === topic.creator_id &&
          !topic.admins.map((admin) => admin.user_id).includes(context.user.id)
        ) {
          throw new Error('User anauthorized')
        }
        // find userId of email
        const { data } = await graphql.query(
          gql`
            query fetchUser($email: String) {
              user(where: { email: { _eq: $email } }) {
                id
              }
            }
          `,
          {
            email
          }
        )
        if (!data.user || !data.user.length) {
          throw new Error('User not found by email')
        }
        // insert to admin_topic table
        await graphql.mutate(
          gql`
            mutation insertAdmin($userAdmin: [admin_topic_insert_input!]!) {
              insert_admin_topic(objects: $userAdmin) {
                affected_rows
              }
            }
          `,
          {
            userAdmin: {
              id: uuid(),
              user_id: data.user[0].id,
              topic_id: topicId
            }
          }
        )
        // return 'success'?
        return 'success'
      } catch (error) {
        console.error(error)
        sentry.captureException(error)
        sentry.captureMessage('add_admin_by_email:', error.message)
        throw new ApolloError(error)
      }
    },
    join_session: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
        const { sessionId } = args
        // fetch session
        const {
          data: {
            session: [session]
          }
        } = await graphql.query(
          gql`
            query getSession($sessionId: uuid!) {
              session(where: { id: { _eq: $sessionId } }) {
                id
                type
                session_users {
                  user_id
                }
              }
            }
          `,
          {
            sessionId
          }
        )
        // if session type is solo and user exists throw error
        if (session.type === 'solo' && session.session_users.length) {
          throw new Error('Session already full')
        }
        // if session type is duo and has 2 users already throw error
        if (session.type === 'duo' && session.session_users.length >= 2) {
          throw new Error('Session already full')
        }

        // insert user to session
        await graphql.mutate(
          gql`
            mutation createSessionUser($sessionUser: [session_user_insert_input!]!) {
              insert_session_user(objects: $sessionUser) {
                affected_rows
              }
            }
          `,
          {
            sessionUser: [
              {
                user_id: context.user.id,
                session_id: sessionId
              }
            ]
          }
        )
        // return 'success'?
        return 'success'
      } catch (error) {
        console.error(error)
        sentry.captureException(error)
        sentry.captureMessage('join_session:', error.message)
        throw new ApolloError(error)
      }
    }
  }
}
