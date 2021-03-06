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
        // if (!context.user) {
        //   throw new ApolloError('Authentication error')
        // }
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
                    img_url
                    answers {
                      id
                      answer
                    }
                  }
                }
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

        // check if session type is duo and if other user has joined
        if (session.type === 'duo' && session.session_users.length < 2) {
          return 'waiting'
        }

        // fetch user_activities of session
        const {
          data: { user_activity: sessionActivities }
        } = await graphql.query(
          gql`
            query fetchUserActivities($sessionId: uuid) {
              user_activity(
                where: {
                  _and: [
                    { topic_session_id: { _eq: $sessionId } }
                    { activity_type: { _eq: "answer" } }
                  ]
                }
              ) {
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
        const userActivities = sessionActivities.filter((activity) => activity.user_id === userId)
        const userQuestionIds = userActivities.map((activity) => activity.question_id)
        // see next question that's unanswered
        let nextQuestion = null
        console.log(
          'Session Questions:',
          sessionQuestions.map((x) => x.question_id),
          userQuestionIds
        )
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
            .filter((activity) => activity.user_id !== userId)
            .map((activity) => activity.question_id)

          // check if opponent is finished with the session
          const isOpponentFinished = sessionQuestions.every((question) =>
            opponentsQuestionIds.includes(question.question_id)
          )

          if (session.creator_id === userId) {
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
      try {
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
                creator_id
                session_users {
                  user_id
                  user {
                    id
                    first_name
                    last_name
                  }
                }
                session_questions {
                  question_id
                  question {
                    id
                    question
                    answers {
                      id
                      answer
                      is_correct
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
        // fetch session activities
        const {
          data: { user_activity: sessionActivities }
        } = await graphql.query(
          gql`
            query fetchUserActivities($sessionId: uuid) {
              user_activity(
                where: {
                  _and: [
                    { topic_session_id: { _eq: $sessionId } }
                    { activity_type: { _eq: "answer" } }
                  ]
                }
              ) {
                id
                answer
                question_id
                user_id
                user {
                  id
                  first_name
                  last_name
                }
              }
            }
          `,
          {
            sessionId
          }
        )
        const sessionQuestions = getObjectValue(session, 'session_questions') || []
        const results = sessionQuestions.map((questionData) => {
          return {
            ...questionData,
            userAnswers: sessionActivities.filter(
              (activity) => activity.question_id === questionData.question_id
            )
          }
        })
        // restructure data so that the FE can loop through an array of questions
        // with the correct and wrong answers along with the answer of user1 or user1 and user2
        // stringify and return
        console.log('Results:', results)
        return JSON.stringify({
          session_users: session.session_users.map((data) => data.user),
          results
        })
      } catch (error) {
        console.log(error.message)
        sentry.captureException(error)
        sentry.captureMessage('get_session_result:', error.message)
        throw new ApolloError(error)
      }
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
    },
    get_user_sessions: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
        const { userId } = args
        // get sessions
        const {
          data: { session: sessions }
        } = await graphql.query(
          gql`
            query getSession($userId: uuid!) {
              session(
                where: { session_users: { user_id: { _eq: $userId } } }
                order_by: { created_at: desc }
              ) {
                id
                type
                creator_id
                updated_at
                current_user_id
                current_user {
                  id
                  first_name
                }
                topic {
                  id
                  name
                  description
                }
              }
            }
          `,
          {
            userId
          }
        )
        console.log('Sessions:', sessions)
        return JSON.stringify(sessions)
      } catch (error) {
        console.log(error.message)
        sentry.captureException(error)
        sentry.captureMessage('get_user_sessions:', error.message)
        throw new ApolloError(error)
      }
    },
    get_topic_average_score: async (parent, args, context) => {
      try {
        const { topicId } = args
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
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
                user_activities(where: { activity_type: { _eq: "answer" } }) {
                  activity_type
                  answer
                  id
                  question {
                    id
                    answers {
                      answer
                      is_correct
                    }
                  }
                }
              }
            }
          `,
          {
            topicId
          }
        )
        // get % of correct / wrong
        let numberOfCorrect = 0
        let totalAttempts = 0
        topic.user_activities.map((activity) => {
          const answers = activity.answer ? JSON.parse(activity.answer) : []
          const questionCorrectAnswers = activity.question.answers
            .filter((answerData) => answerData.is_correct)
            .map((answerData) => answerData.answer)
          const isCorrect =
            answers.length && answers.every((answer) => questionCorrectAnswers.includes(answer))
          if (isCorrect) {
            numberOfCorrect++
          }
          totalAttempts++
        })
        return numberOfCorrect ? Number((numberOfCorrect / totalAttempts) * 100).toFixed(2) : 0
      } catch (error) {
        console.log(error.message)
        sentry.captureException(error)
        sentry.captureMessage('get_average_score:', error.message)
        throw new ApolloError(error)
      }
    },
    get_topic_rankings: async (parent, args, context) => {
      try {
        const { topicId, sortBy = 'average', search = '' } = args
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
        // fetch topic
        const {
          data: {
            topic: [topic]
          }
        } = await graphql.query(
          gql`
            query fetchTopic($topicId: uuid!, $search: String) {
              topic(where: { id: { _eq: $topicId } }) {
                id
                sessions {
                  id
                  type
                  user_activities(
                    where: {
                      _and: [
                        { activity_type: { _eq: "answer" } }
                        {
                          _or: [
                            { user: { first_name: { _ilike: $search } } }
                            { user: { last_name: { _ilike: $search } } }
                          ]
                        }
                      ]
                    }
                  ) {
                    created_at
                    activity_type
                    answer
                    id
                    user_id
                    user {
                      id
                      first_name
                      last_name
                    }
                    question_id
                    question {
                      id
                      answers {
                        answer
                        is_correct
                      }
                    }
                  }
                }
              }
            }
          `,
          {
            topicId,
            search: search + '%'
          }
        )

        // create Map
        const users = new Map()

        // map out session activities to each user
        // keep their average score, coverage, date last took, types
        topic.sessions.map((session) => {
          session.user_activities.map((activity) => {
            if (!users.get(activity.user_id)) {
              users.set(activity.user_id, {
                userId: activity.user_id,
                userInfo: activity.user,
                numberOfCorrect: 0,
                totalTimesAnswered: 0,
                questionIdsSeen: [],
                dateLastTook: null,
                timesTackledAlone: Number(session.type === 'solo'),
                timesTackledWithAFriend: Number(session.type === 'duo'),
                lastSessionId: session.id
              })
            }

            let userData = users.get(activity.user_id)
            // userData.questionIdsSeen.push(activity.question_id)
            userData.questionIdsSeen = [
              ...new Set(userData.questionIdsSeen).add(activity.question_id)
            ]
            userData.dateLastTook =
              new Date(activity.created_at) > new Date(userData.dateLastTook)
                ? activity.created_at
                : userData.dateLastTook
            if (session.id !== userData.lastSessionId) {
              userData.lastSessionId = session.id
              if (session.type === 'solo') {
                userData.timesTackledAlone++
              } else {
                userData.timesTackledWithAFriend++
              }
            }

            const answers = activity.answer ? JSON.parse(activity.answer) : []
            const questionCorrectAnswers = activity.question.answers
              .filter((answerData) => answerData.is_correct)
              .map((answerData) => answerData.answer)
            const isCorrect =
              answers.length && answers.every((answer) => questionCorrectAnswers.includes(answer))

            if (isCorrect) {
              userData.numberOfCorrect++
            }
            userData.totalTimesAnswered++

            users.set(activity.user_id, userData)
          })
        })

        const resultArray = [...users.values()]
        if (sortBy === 'average') {
          resultArray.sort(
            (a, b) =>
              b.numberOfCorrect / b.totalTimesAnswered - a.numberOfCorrect / a.totalTimesAnswered
          )
        } else if (sortBy === 'name') {
          resultArray.sort(
            (a, b) =>
              `${b.userInfo.first_name} ${b.userInfo.last_name}` >
              `${a.userInfo.first_name} ${a.userInfo.last_name}`
          )
        } else {
          resultArray.sort((a, b) => b.questionIdsSeen.length - a.questionIdsSeen.length)
        }
        console.log(resultArray)
        return JSON.stringify(resultArray)
      } catch (error) {
        console.log(error.message)
        sentry.captureException(error)
        sentry.captureMessage('get_average_score:', error.message)
        throw new ApolloError(error)
      }
    },
    get_topic_takers_count: async (parent, args, context) => {
      try {
        const { topicId } = args
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
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
                user_activities_aggregate(where: { activity_type: { _eq: "take" } }) {
                  aggregate {
                    count
                  }
                }
              }
            }
          `,
          {
            topicId
          }
        )

        return ~~getObjectValue(topic, 'user_activities_aggregate.aggregate.count')
      } catch (error) {
        console.log(error.message)
        sentry.captureException(error)
        sentry.captureMessage('get_topic_takers_count:', error.message)
        throw new ApolloError(error)
      }
    },
    get_topic_tackle_type_count: async (parent, args, context) => {
      try {
        const { topicId, type } = args
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
        // fetch topic
        const {
          data: {
            topic: [topic]
          }
        } = await graphql.query(
          gql`
            query fetchTopic($topicId: uuid!, $type: String) {
              topic(where: { id: { _eq: $topicId } }) {
                id
                sessions_aggregate(where: { type: { _eq: $type } }) {
                  aggregate {
                    count
                  }
                }
              }
            }
          `,
          {
            topicId,
            type
          }
        )

        return ~~getObjectValue(topic, 'sessions_aggregate.aggregate.count')
      } catch (error) {
        console.log(error.message)
        sentry.captureException(error)
        sentry.captureMessage('get_topic_tackle_type_count:', error.message)
        throw new ApolloError(error)
      }
    },
    get_topic_comments_count: async (parent, args, context) => {
      try {
        const { topicId } = args
        if (!context.user) {
          throw new ApolloError('Authentication error')
        }
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
                comments_aggregate {
                  aggregate {
                    count
                  }
                }
              }
            }
          `,
          {
            topicId
          }
        )

        return ~~getObjectValue(topic, 'comments_aggregate.aggregate.count')
      } catch (error) {
        console.log(error.message)
        sentry.captureException(error)
        sentry.captureMessage('get_topic_comments_count:', error.message)
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
        const { rating, comment, topicId } = args
        console.log(args, context.user)
        if (!rating && !comment) {
          throw new ApolloError('At least a rating or a comment is required')
        }
        // get session with topic
        // const {
        //   data: {
        //     session: [session]
        //   }
        // } = await graphql.query(
        //   gql`
        //     query getSession($sessionId: uuid!, $userId: uuid!) {
        //       session(
        //         where: {
        //           _and: [
        //             { id: { _eq: $sessionId } }
        //             { session_users: { user_id: { _eq: $userId } } }
        //           ]
        //         }
        //       ) {
        //         id
        //         topic_id
        //       }
        //     }
        //   `,
        //   {
        //     sessionId,
        //     userId: context.user.id
        //   }
        // )
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
              topicId,
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
                topic_id: topicId,
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
                topic_id: topicId,
                content: comment,
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
              topic_id: topicId,
              topic_comment_id: comment ? commentId : null
            }
          }
        )
      } catch (error) {
        console.log(error.message)
        sentry.captureException(error)
        sentry.captureMessage('create_topic_feedback:', error.message)
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
                creator_id: userId,
                current_user_id: userId
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
        // fetch next question
        const { data: nextQuestionData } = await graphql.query(
          gql`
            query fetchNextSessionQuestion($userId: ID!, $sessionId: ID!) {
              next_session_question(userId: $userId, sessionId: $sessionId)
            }
          `,
          {
            userId,
            sessionId
          }
        )
        console.log('Next question data:', nextQuestionData)
        if (nextQuestionData.next_session_question === 'waiting') {
          throw new Error('you are still waiting')
        }
        if (!nextQuestionData.next_session_question) {
          throw new Error('session has finished')
        }

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
                creator_id
                current_user_id
                session_users {
                  user_id
                }
                topic_id
              }
            }
          `,
          {
            sessionId
          }
        )

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
              activity_type: 'answer',
              topic_id: session.topic_id
            }
          }
        )

        // fetch next question again
        const { data: nextQuestionData2 } = await graphql.query(
          gql`
            query fetchNextSessionQuestion($userId: ID!, $sessionId: ID!) {
              next_session_question(userId: $userId, sessionId: $sessionId)
            }
          `,
          {
            userId,
            sessionId
          }
        )

        if (nextQuestionData2.next_session_question === 'waiting') {
          // set session current user id to opponent
          await graphql.query(
            gql`
              mutation updateSession($userId: uuid, $sessionId: uuid) {
                update_session(
                  _set: { current_user_id: $userId }
                  where: { id: { _eq: $sessionId } }
                ) {
                  affected_rows
                }
              }
            `,
            {
              sessionId,
              userId: session.session_users.filter((user) => user.user_id !== context.user.id)[0]
                .user_id
            }
          )
        } else if (!nextQuestionData2.next_session_question) {
          if (session.type === 'duo') {
            if (session.creator_id !== context.user.id) {
              await graphql.query(
                gql`
                  mutation updateSession($userId: uuid, $sessionId: uuid) {
                    update_session(
                      _set: { current_user_id: $userId }
                      where: { id: { _eq: $sessionId } }
                    ) {
                      affected_rows
                    }
                  }
                `,
                {
                  sessionId,
                  userId: null
                }
              )
            } else {
              await graphql.query(
                gql`
                  mutation updateSession($userId: uuid, $sessionId: uuid) {
                    update_session(
                      _set: { current_user_id: $userId }
                      where: { id: { _eq: $sessionId } }
                    ) {
                      affected_rows
                    }
                  }
                `,
                {
                  sessionId,
                  userId: session.session_users.filter(
                    (user) => user.user_id !== context.user.id
                  )[0].user_id
                }
              )
            }
          } else {
            await graphql.query(
              gql`
                mutation updateSession($userId: uuid, $sessionId: uuid) {
                  update_session(
                    _set: { current_user_id: $userId }
                    where: { id: { _eq: $sessionId } }
                  ) {
                    affected_rows
                  }
                }
              `,
              {
                sessionId,
                userId: null
              }
            )
          }
        }

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
          throw new Error(`Sorry didn't find user with email ${email}`)
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
