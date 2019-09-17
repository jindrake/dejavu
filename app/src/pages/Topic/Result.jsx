import React, { Fragment, useState } from 'react'
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
  user,
  history,
  createRating
}) => {
  const [active, setActive] = useState(false)
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
      {active && (
        <IconsDiv>
          <Close onClick={() => history.push('/')}>
            <Icon name='close' />
          </Close>
          <RatingCard>
            <Title>How was the topic?</Title>
            <hr />
            <Button
              text='Upvote'
              type='primary'
              onClick={() => {
                // createRating({
                //   variables: {
                //     topicRating: {
                //       userId: user.id,

                //     }
                //   }
                // })
                console.log('upvote')
              }}
            />
            <hr />
            <Button text='Downvote' type='primary' />
          </RatingCard>
        </IconsDiv>
      )}
      <ContentRight>
        <Button text='Rate' type='primary' onClick={() => setActive(true)} />
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
