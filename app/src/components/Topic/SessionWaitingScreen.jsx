import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'

import { Button, HeaderText, ContentBetween, FullPageLoader, ContentCenter } from '../../components'
import { Paper } from '../../components/Topic'
import { useStateValue } from '../../libs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faMinus } from '@fortawesome/free-solid-svg-icons'

const ANSWER_QUESTION = gql`
  mutation answerQuestion($answers: [String!]!, $questionId: ID!, $userId: ID!, $sessionId: ID!) {
    answer_question(
      answers: $answers
      questionId: $questionId
      userId: $userId
      sessionId: $sessionId
    )
  }
`

const FETCH_SESSION_ANSWERS = gql`
  query fetchSessionAnswers($sessionId: ID!) {
    get_session_result(sessionId: $sessionId)
  }
`

const SessionWaitingScreen = ({
  // },
  match: {
    params: { sessionId }
  },
  history
}) => {
  const [{ user }, globalDispatch] = useStateValue()
  const { data, loading, error } = useQuery(FETCH_SESSION_ANSWERS, {
    skip: !sessionId,
    variables: {
      sessionId
    }
  })
  if (loading) {
    return <FullPageLoader />
  }
  if (error) {
    console.error('error@sessionwaitingscreen1')
    globalDispatch({
      networkError: error.message
    })
    return null
  }

  const partialResult = JSON.parse(data.get_session_result)
  const otherUser = partialResult.session_users.filter(
    (sessionUser) => sessionUser.id !== user.id
  )[0]

  console.log('Data:', partialResult)
  return (
    <Wrapper>
      <Paper>
        <ContentCenter className='mb-3 mt-3'>
          <HeaderText>
            {/* <InputGroup> */}
            Waiting for <span className='text-capitalize'>{otherUser.first_name}</span>
          </HeaderText>
        </ContentCenter>
        <div>
          <div className='d-flex justify-content-between px-4'>
            {/* {partialResult.session_users.map((user, index) => {
              return (
                <div key={index} className='text-capitalize h5'>
                  {user.first_name}
                </div>
              )
            })} */}
            <div className='text-capitalize'>{user.first_name}</div>
            <div className='text-capitalize'>{otherUser.first_name}</div>
          </div>
          <hr />
          <ContentCenter>Turn Results</ContentCenter>
          {partialResult.results.map((questionData, index) => {
            // const userActivities = getObjectValue(questionData, '')
            const questionCorrectAnswers = questionData.question.answers
              .filter((answer) => answer.is_correct)
              .map((answerObj) => answerObj.answer)
            const userAnswerObject = questionData.userAnswers
              .filter((answer) => answer.user_id === user.id)
              .pop()
            const otherUserAnswerObject = questionData.userAnswers
              .filter((answer) => answer.user_id !== user.id)
              .pop()
            console.log('ans object:', userAnswerObject)
            const userAnswers =
              userAnswerObject && userAnswerObject.answer ? JSON.parse(userAnswerObject.answer) : []
            const otherUserAnswers =
              otherUserAnswerObject && otherUserAnswerObject.answer
                ? JSON.parse(otherUserAnswerObject.answer)
                : []
            console.log('User answers:', userAnswers)
            console.log('OtherUser answers:', otherUserAnswers)
            console.log('questionCorrectAnswers:', questionCorrectAnswers)
            // const isUserAnswerCorrect =
            //   userAnswers.length ?
            //   userAnswers.every((answer) => questionCorrectAnswers.includes(answer)) : null
            // const isOtherUserAnswerCorrect =
            //   otherUserAnswers.length ?
            //   otherUserAnswers.every((answer) => questionCorrectAnswers.includes(answer)) : null
            return (
              <div className='text-center' key={index}>
                <div className='d-flex justify-content-between px-4'>
                  <div>
                    {userAnswers ? (
                      userAnswers.every((answer) => questionCorrectAnswers.includes(answer)) ? (
                        <FontAwesomeIcon icon={faCheck} className='text-success' />
                      ) : (
                        <FontAwesomeIcon icon={faTimes} className='text-danger' />
                      )
                    ) : (
                      <FontAwesomeIcon icon={faMinus} />
                    )}
                  </div>
                  <div />
                  <div>
                    {otherUserAnswers.length ? (
                      otherUserAnswers.every((answer) => questionCorrectAnswers.includes(answer)) ? (
                        <FontAwesomeIcon icon={faCheck} className='text-success' />
                      ) : (
                        <FontAwesomeIcon icon={faTimes} className='text-danger' />
                      )
                    ) : (
                      <FontAwesomeIcon icon={faMinus} />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Paper>
      <ContentBetween>
        <Button
          text={'Exit'}
          onClick={() => {
            history.push('/')
          }}
        />
        <Button
          text={'Proceed'}
          type='primary'
          onClick={() => {
            // handleSubmit()
            history.push('/session/' + sessionId)
          }}
        />
      </ContentBetween>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

export default compose(
  withRouter,
  graphql(ANSWER_QUESTION, { name: 'answerQuestion' })
)(SessionWaitingScreen)
