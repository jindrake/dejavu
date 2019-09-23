import React, { Fragment, useState } from 'react'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { useStateValue, getObjectValue } from '../../libs'
import { Button, ContentRight, FullPageLoader } from '../../components'
import { Card, CardHeader, CardBody, Input } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import Icon from '../../components/Icon'

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
      topic_id
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

const CREATE_TOPIC_FEEDBACK = gql`
  mutation createTopicFeedback($sessionId: ID!, $rating: String, $comment: String) {
    create_topic_feedback(sessionId: $sessionId, rating: $rating, comment: $comment)
  }
`

const FETCH_USER_RATING = gql`
  query fetchUserActivityRating ($sessionId: uuid!, $userId: uuid!) {
    user_activity (where: {_and: [
      {
        activity_type: {
          _eq: "rate"
        }
      },
      {
        topic_session_id: {
          _eq: $sessionId
        }
      }
    ]}) {
      topic_id
      topic {
        ratings (where: {user_id: {_eq: $userId}}) {
          type
        }
      }
    }
  }
`

const Result = ({
  match: {
    params: { sessionId }
  },
  user,
  history,
  createTopicFeedback
}) => {
  const [isFeedbackScreenShown, showFeedbackScreen] = useState(false)
  const [rating, setRating] = useState(null)
  const [comment, setComment] = useState('')
  const [, globalDispatch] = useStateValue()
  const { data, error, loading } = useQuery(FETCH_USER_ACTIVITY, {
    skip: !sessionId,
    variables: {
      sessionId
    }
  })
  const { data: ratingData, error: ratingError, loading: ratingLoading } = useQuery(FETCH_USER_RATING, {
    skip: !sessionId || !user.id,
    variables: {
      userId: user.id,
      sessionId
    }
  })

  if (error) {
    console.error('error@result:1')
    globalDispatch({
      networkError: error.message
    })
    return null
  }
  if (ratingError) {
    console.error('error@result:2')
    globalDispatch({
      networkError: ratingError.message
    })
    return null
  }
  if (loading || ratingLoading) {
    return <FullPageLoader />
  }
  const answerActivities = data.user_activity
  console.log('answerActivities:', answerActivities, rating)
  const previousRating = getObjectValue(ratingData, 'user_activity[0].topic.ratings[0].type')
  return (
    <Wrapper>
      {/* <Paper className='bg-transparent'> */}
      <PageTitle>RESULTS</PageTitle>
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
                  <CardHeader className='text-center' style={{ background: 'none' }}>
                    <Question>Q{index + 1}: {res.question.question}</Question>
                  </CardHeader>
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
      {isFeedbackScreenShown && (
        <IconsDiv>
          <Close onClick={() => history.push('/')}>
            <Icon name='close' />
          </Close>
          <RatingCard>
            <Title>How was the topic?</Title>
            <hr />
            <RatingButtonsContainer>
              <Button
                text='Upvote'
                type={!rating && previousRating !== 'upvote' ? 'warning' : rating === 'upvote' ? 'warning' : 'primary'}
                onClick={() => {
                  setRating('upvote')
                }}
              />
              <Button
                text='Downvote'
                type={!rating && previousRating !== 'downvote' ? 'warning' : rating === 'downvote' ? 'warning' : 'primary'}
                onClick={() => {
                  setRating('downvote')
                }}
              />
            </RatingButtonsContainer>
            <hr />
            <Title>Comment</Title>
            <Input type='textarea' value={comment} onChange={(event) => {
              setComment(event.target.value)
            }} />
            <hr />
            <Button text='Submit' type='primary' onClick={async () => {
              globalDispatch({
                loading: true
              })
              try {
                await createTopicFeedback({
                  variables: {
                    sessionId,
                    rating,
                    comment
                  }
                })
                globalDispatch({
                  operationSuccess: 'Feedback sent'
                })
                showFeedbackScreen(false)
              } catch (error) {
                console.error('error@result:3')
                globalDispatch({
                  networkError: error.message
                })
              }
              globalDispatch({
                loading: false
              })
            }} />
          </RatingCard>
        </IconsDiv>
      )}
      <ContentRight>
        <Button text='Rate' type='primary' onClick={() => showFeedbackScreen(true)} />
        <Button
          text='Exit'
          onClick={() => {
            history.push('/')
          }}
        />
      </ContentRight>
    </Wrapper>
  )
}

const PageTitle = styled.div`
  color: white;
  text-align: center;
  font-weight: 700;
  margin-bottom: 15px;
  font-size: 1.25em;
`

const Question = styled.div`
  color: #1a237e;
  font-size: 25px;
  font-weight: 700;
`

const RatingButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
`

const Title = styled.div`
  color: #1a237e;
  @media (min-width: 900) {
    font-size: 20px;
  }

  @media (max-width: 900) {
    font-size: 4vw;
  }
  font-weight: 700;
`

const RatingCard = styled.div`
  background: linear-gradient(#e8eaf6, #c5cae9);
  justify-content: center;
  padding: 20px;
  width: 92%;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 60px;
  }
  border-radius: 6px;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  animation-delay: ${({ n }) => n * 100 + 'ms'};
`

const Close = styled.div`
  position: absolute;
  font-size: 2em;
  color: #e8eaf6;
  opacity: 0.5;
  right: 0;
  top: 0;
`

const IconsDiv = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999999;
  transition: transform 0.2s ease-out;
`

const StyledCard = styled(Card)`
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  padding: 1vh;
  border-radius: 1vh;
  background: linear-gradient(#e8eaf6, #c5cae9);
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
  graphql(CREATE_TOPIC_FEEDBACK, { name: 'createTopicFeedback' })
)(Result)
