import React, { Fragment, useState } from 'react'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { useStateValue, getObjectValue } from '../../libs'
import { FullPageLoader, FaIcon, ContentBetween, HeaderText } from '../../components'
import { Card, CardHeader, CardBody, Input, Button } from 'reactstrap'
import { faCheck, faTimes, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import Img from 'react-image'

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
        img_url
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
  mutation createTopicFeedback($topicId: ID!, $rating: String, $comment: String) {
    create_topic_feedback(topicId: $topicId, rating: $rating, comment: $comment)
  }
`

const FETCH_USER_RATING = gql`
  query fetchUserActivityRating($sessionId: uuid!, $userId: uuid!) {
    user_activity(
      where: {
        _and: [{ activity_type: { _eq: "rate" } }, { topic_session_id: { _eq: $sessionId } }]
      }
    ) {
      topic_id
      topic {
        ratings(where: { user_id: { _eq: $userId } }) {
          type
        }
      }
    }
  }
`

const FETCH_SESSION = gql`
  query fetchSession($sessionId: uuid!) {
    session(where: { id: { _eq: $sessionId } }) {
      topic_id
      id
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
  const { data: ratingData, error: ratingError, loading: ratingLoading } = useQuery(
    FETCH_USER_RATING,
    {
      skip: !sessionId || !user.id,
      variables: {
        userId: user.id,
        sessionId
      }
    }
  )
  const { data: sessionData, error: sessionError, loading: sessionLoading } = useQuery(
    FETCH_SESSION,
    {
      skip: !sessionId,
      variables: {
        sessionId
      }
    }
  )

  const componentError = error || ratingError || sessionError
  if (componentError) {
    console.error('error@result:1')
    globalDispatch({
      networkError: componentError.message
    })
    return null
  }
  if (loading || ratingLoading || sessionLoading) {
    return <FullPageLoader />
  }
  const answerActivities = data.user_activity
  console.log('answerActivities:', answerActivities, rating)
  const previousRating = getObjectValue(ratingData, 'user_activity[0].topic.ratings[0].type')
  const session = getObjectValue(sessionData, 'session[0]')
  return (
    <Wrapper>
      {/* <Paper className='bg-transparent'> */}
      <HeaderText className='dejavu-large-text'>Result</HeaderText>
      <div className='mt-3'>
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
                    <div>
                      Q{index + 1}: {res.question.question}
                    </div>
                  </CardHeader>
                  {res.question.img_url && (
                    <Img
                      src={[res.question.img_url, 'http://via.placeholder.com/300x300']}
                      alt='question img'
                      style={{ borderRadius: '5px', width: '100%', marginTop: '20px' }}
                    />
                  )}
                  {isCorrect ? (
                    <CardBody className='text-success d-flex justify-content-between'>
                      <FaIcon icon={faCheck} />
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
                          <FaIcon icon={faTimes} />
                          <div />
                          <div>
                            {userAnswers.map((answer, index) => (
                              <div key={index}>{answer}</div>
                            ))}
                          </div>
                        </CardBody>
                      )}
                      <CardBody className='text-warning d-flex justify-content-between'>
                        <FaIcon icon={faCheck} />
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
          <RatingCard>
            <div className='dejavu-small-text'>How was the topic?</div>
            <hr />
            <RatingButtonsContainer>
              <Button
                text='Upvote'
                color={
                  !rating && previousRating === 'upvote'
                    ? 'warning'
                    : rating === 'upvote'
                      ? 'warning'
                      : 'primary'
                }
                onClick={() => {
                  setRating('upvote')
                }}
              >
                <FaIcon icon={faThumbsUp} />&nbsp;
                Upvote
              </Button>
              <Button
                color={
                  !rating && previousRating === 'downvote'
                    ? 'warning'
                    : rating === 'downvote'
                      ? 'warning'
                      : 'primary'
                }
                onClick={() => {
                  setRating('downvote')
                }}
              >
                <FaIcon icon={faThumbsDown} />&nbsp;
                Downvote
              </Button>
            </RatingButtonsContainer>
            <hr />
            <div className='dejavu-small-text'>Comment</div>
            <Input
              type='textarea'
              value={comment}
              onChange={(event) => {
                setComment(event.target.value)
              }}
            />
            <hr />
            <div className='d-flex justify-content-center'>
              <Button
                color='primary'
                onClick={async () => {
                  globalDispatch({
                    loading: true
                  })
                  try {
                    await createTopicFeedback({
                      variables: {
                        topicId: session.topic_id,
                        rating,
                        comment
                      }
                    })
                    showFeedbackScreen(false)
                    globalDispatch({
                      operationSuccess: 'Feedback sent'
                    })
                  } catch (error) {
                    console.error('error@result:3')
                    globalDispatch({
                      networkError: error.message
                    })
                  }
                  globalDispatch({
                    loading: false
                  })
                }}
              >
                Submit
              </Button>
              <Button className='ml-3' color='secondary' onClick={() => showFeedbackScreen(false)}>Cancel</Button>
            </div>
          </RatingCard>
        </IconsDiv>
      )}
      <ContentBetween>
        <Button color='primary' onClick={() => showFeedbackScreen(true)}>
          Rate
        </Button>
        <Button
          color='secondary'
          onClick={() => {
            history.push('/')
          }}
        >
          Exit
        </Button>
      </ContentBetween>
    </Wrapper>
  )
}

const RatingButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
`

const RatingCard = styled.div`
  background: white;
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
  box-shadow: 0 4px 4px -2px gray;
  /* border-radius: 1vh; */
  /* background: linear-gradient(#e8eaf6, #c5cae9); */
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
