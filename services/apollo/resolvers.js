const graphql = require('./graphql')
const gql = require('graphql-tag')
const { ApolloError } = require('apollo-server-express')
const { shuffleArray, getObjectValue } = require('../libs')
const uuid = require('uuid/v4')

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
        const { sessionId, userId } = args
        // get session with user_activities
        const {
          data: {
            session: [session]
          }
        } = await graphql.query(
          gql`
            query getSession($sessionId: uuid!, $userId: uuid!) {
              session(where: { id: { _eq: $sessionId } }) {
                id
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
                session_users(where: { user_id: { _eq: $userId } }) {
                  user {
                    activities(
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
                    }
                  }
                }
              }
            }
          `,
          {
            sessionId,
            userId
          }
        )
        // see next question that's unanswered

        let nextQuestion = null
        const userActivities = getObjectValue(session, 'session_users[0].user.activities') || []
        const answeredQuestionIds = userActivities.map((activity) => activity.question_id)
        const sessionQuestions = getObjectValue(session, 'session_questions') || []
        for (let sessionQuestion of sessionQuestions) {
          if (!answeredQuestionIds.includes(sessionQuestion.question_id)) {
            nextQuestion = sessionQuestion.question
            break
          }
        }
        // console.log(nextQuestion, userActivities, answeredQuestionIds, sessionQuestions)
        // console.log('next question is:', nextQuestion)
        // console.log('answered question ids:', answeredQuestionIds)
        // console.log('user activities:', userActivities)
        // console.log('WHOLE session:', session)
        return JSON.stringify(nextQuestion)
      } catch (error) {
        console.log(error.message)
        throw new ApolloError(error)
      }
    },
    get_session_result: async (parent, args, context) => {
      // const { sessionId, userId } = args
      // // get session user activities
      // const {
      //   data: {
      //     session: [session]
      //   }
      // } = await graphql.query(
      //   gql`
      //     query getSession($sessionId: uuid!, $userId: uuid!) {
      //       session(where: { id: { _eq: $sessionId } }) {
      //         id
      //         session_questions {
      //           question_id
      //           question {
      //             id
      //             question
      //             answers {
      //               id
      //               answer
      //               is_correct
      //             }
      //           }
      //         }
      //         session_users(where: { user_id: { _eq: $userId } }) {
      //           user {
      //             activities(
      //               where: {
      //                 _and: [
      //                   { topic_session_id: { _eq: $sessionId } }
      //                   { activity_type: { _eq: "answer" } }
      //                 ]
      //               }
      //             ) {
      //               id
      //               answer
      //               question_id
      //               question {
      //                 id
      //                 answers {
      //                   id
      //                   answer
      //                   is_correct
      //                 }
      //               }
      //             }
      //           }
      //         }
      //       }
      //     }
      //   `,
      //   {
      //     sessionId,
      //     userId
      //   }
      // )
      // // get user answers compare against question correct answers
      // const userActivities = getObjectValue(session, 'session_users.user.activities') || []
      // // const userAnswers = userActivities.map(activity => activity.answer)
      // const sessionQuestions = session.session_questions.question
      // const score = 0
      // const total = ''
      // for (let activity of userActivities) {
      //   const userAnswers = activity.answer
      //   const isCorrect = userAnswers
      //     ? userAnswers.sort().join(',') ===
      //       res.question.answers
      //         .map((answerObject) => answerObject.answer)
      //         .sort()
      //         .join(',')
      //     : false

      // }
      // return score
      // return user answers
      // return question answers
      return 'test'
    },
    get_topic_suggested_questions: async (parent, args, context) => {
      try {
        const { topicId, userId } = args
        // fetch topic
        const {
          data: {
            topic: [topic]
          }, ...rest
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
        console.log('Topic:', topic, rest)
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
        console.log(questions.length)
        return questions.length ? JSON.stringify(questions) : null
      } catch (error) {
        console.log(error.message)
        throw new ApolloError(error)
      }
    }
  },
  Mutation: {
    create_session: async (parent, args, context) => {
      try {
        // fetch topic
        const { userIds, topicId } = args
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
        for (let userId of userIds) {
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
        }

        console.log('Topic:', topic, topicId)
        // get subset of question ids
        const unshuffledQuestionIds = topic.questions.map((q) => q.question_id)
        let questionSubset = null
        if (unshuffledQuestionIds.length > 10) {
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
                topic_id: topicId
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
        for (let userId of userIds) {
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
        }
        // insert user activity
        await graphql.mutate(
          gql(`
            mutation insertUserActivity {
              insert_user_activity(objects: {
                id: "${uuid()}",
                activity_type: "take",
                user_id: "${userIds[0]}",
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
        throw new ApolloError(error)
      }
    },
    answer_question: async (parent, args, context) => {
      try {
        const { answers, questionId, sessionId, userId } = args

        // check if combination exists first
        // const userActivities = await graphql.query(
        //   gql(`
        //     query fetchUserActivity {
        //       user_activity (where: {
        //         _and: [
        //           {
        //             answer: {
        //               _eq: ${JSON.stringify(answers)}
        //             }
        //           },
        //           {
        //             question_id: {
        //               _eq: "${questionId}"
        //             }
        //           },
        //           {
        //             topic_session_id: {
        //               _eq: "${sessionId}"
        //             }
        //           },
        //           {
        //             user_id: {
        //               _eq: "${userId}"
        //             }
        //           }
        //         ]
        //       }) {
        //         id
        //       }
        //     }
        //    `)
        // )
        // console.log('RESULT:', userActivities)

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
        throw new ApolloError(error)
      }
    }
  }
}
