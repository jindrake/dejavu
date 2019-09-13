import React, { Fragment } from 'react'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { useStateValue } from '../../libs'
import { Button, ContentRight, FullPageLoader } from '../../components'
import { Card, CardHeader, CardBody } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

const FETCH_USER_ACTIVITY = gql`
  query fetchUserActivity($sessionId: uuid!) {
    user_activity(
      where: {
        _and: [{ topic_session_id: { _eq: $sessionId } }, { activity_type: { _eq: "answer" } }]
      }
    ) {
      id
      answer
      question_id
      question {
        id
        question
        answers(where: { is_correct: { _eq: true } }) {
          id
          answer
          is_correct
        }
      }
    }
  }
`

const INSERT_TOPIC_RATING = gql`
  mutation insertTopicRating($topicRating: [topic_rating_insert_input!]!) {
    insert_topic_rating(objects: $topicRating) {
      affected_rows
    }
  }
`

const Result = ({
  match: {
    params: { sessionId }
  },
  history
}) => {
  const [, globalDispatch] = useStateValue()
  const { data, error, loading } = useQuery(FETCH_USER_ACTIVITY, {
    variables: {
      sessionId
    }
  })
  if (error) {
    console.error('error@result:1')
    globalDispatch({
      networkError: error.message
    })
    return
  }
  if (loading) {
    return <FullPageLoader />
  }
  const answerActivities = data.user_activity
  console.log('answerActivities:', answerActivities)
  return (
    <Wrapper>
      {/* <Paper className='bg-transparent'> */}
      <div className='text-white'>Results</div>
      <div>
        {answerActivities &&
          answerActivities.map((res, index) => {
            const userAnswers = res.answer ? JSON.parse(res.answer) : null
            const isCorrect = userAnswers
              ? userAnswers.sort().join(',') ===
                res.question.answers
                  .map((answerObject) => answerObject.answer)
                  .sort()
                  .join(',')
              : false
            return (
              <Fragment key={index}>
                <StyledCard>
                  <CardHeader className='text-center'>{res.question.question}</CardHeader>
                  {isCorrect ? (
                    <CardBody className='text-success d-flex justify-content-between'>
                      <FontAwesomeIcon icon={faCheck} />
                      <div />
                      <div>
                        {res.question.answers.map((answerObject, index) => (
                          <div key={index}>{answerObject.answer}</div>
                        ))}
                      </div>
                    </CardBody>
                  ) : (
                    <>
                      {userAnswers && (
                        <CardBody className='text-danger d-flex justify-content-between'>
                          <FontAwesomeIcon icon={faTimes} />
                          <div />
                          <div>
                            {userAnswers.map((answer, index) => (
                              <div key={index}>{answer}</div>
                            ))}
                          </div>
                        </CardBody>
                      )}
                      <CardBody className='text-warning d-flex justify-content-between'>
                        <FontAwesomeIcon icon={faCheck} />
                        <div />
                        <div>
                          {res.question.answers.map((answerObject, index) => (
                            <div key={index}>{answerObject.answer}</div>
                          ))}
                        </div>
                      </CardBody>
                    </>
                  )}
                </StyledCard>
                <br />
              </Fragment>
            )
          })}
      </div>
      <ContentRight>
        <Button
          text='exit'
          onClick={() => {
            history.push('/')
          }}
        />
      </ContentRight>
    </Wrapper>
  )
}

const StyledCard = styled(Card)`
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  padding: 1vh;
  border-radius: 1vh;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-y: scroll;
  border-radius: 1vh;
`

export default compose(
  withRouter,
  graphql(INSERT_TOPIC_RATING, { name: 'insertTopicRating' })
)(Result)
