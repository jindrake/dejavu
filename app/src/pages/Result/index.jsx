import React from 'react'
import gql from 'graphql-tag'
import { Query, compose, graphql } from 'react-apollo'
import styled from 'styled-components'
import uuid from 'uuid/v4'
import { withRouter } from 'react-router-dom'

import Button from '../../components/Button'

const FETCH_USER_ACTIVITY = gql`
  query fetchUserActivity($topicSessionId: uuid!) {
    user_activity(where: {topic_session_id: {_eq: $topicSessionId}}) {
      id
      answer
      question {
        question
        answers(where: {is_correct: {_eq: true}}) {
          answer
          is_correct
        }
      }
    }
  }
`

const INSERT_TOPIC_RATING = gql`
  mutation insertTopicRating ($topicRating: [topic_rating_insert_input!]!)  {
    insert_topic_rating(objects: $topicRating) {
      affected_rows
    }
  }
`

const Result = ({
  match: { params },
  history,
  user,
  insertTopicRating
}) => {
  console.log('USER RESULT PAGE:', user)
  console.log('Params result page', params)
  const topicSessionId = params.topicSessionId
  const topicId = params.id
  let score = 0
  return (
    <Query query={FETCH_USER_ACTIVITY} variables={{ topicSessionId: topicSessionId }}>
      {({ data, error, loading }) => {
        if (error) return <div>Error fetching user activity</div>
        if (loading) return <div>loading user activity...</div>
        const results = data.user_activity
        return (
          <Wrapper>
            <TopSection><h1>Results</h1></TopSection>
            <MainSection>
              <Belt>
                <Paper>
                  {
                    results && results.map((res, index) => {
                      const correctAnswer = res.question.answers[0].answer
                      const userAnswer = res.answer
                      if (correctAnswer === userAnswer) {
                        console.log('correct')
                        score++
                      }
                      return (
                        <div key={res.id}>
                          <p>Question: {res.question.question}</p>
                          <p>Your Answer: {userAnswer}</p>
                          <p>Correct Answer: {correctAnswer}</p>
                        </div>
                      )
                    })
                  }
                  <b>Total score: {`${score.toString()}/${results.length}`}</b>
                </Paper>
              </Belt>
            </MainSection>
            <BottomSection>
              <Button
                type='primary'
                text='upvote'
                onClick={() => {
                  insertTopicRating({
                    variables: {
                      topicRating: {
                        id: uuid(),
                        user_id: user.id,
                        topic_id: topicId,
                        type: 'upvote'
                      }
                    }
                  })
                    .then((res) => {
                      console.log(res)
                    })
                    .catch((err) => {
                      console.log(err.message)
                    })
                  history.push(`/`)
                }}
              />
              <Button
                type='primary'
                text='downvote'
                onClick={() => {
                  insertTopicRating({
                    variables: {
                      topicRating: {
                        id: uuid(),
                        user_id: user.id,
                        topic_id: topicId,
                        type: 'downvote'
                      }
                    }
                  })
                    .then((res) => {
                      console.log(res)
                    })
                    .catch((err) => {
                      console.log(err.message)
                    })
                  history.push(`/`)
                }}
              />
            </BottomSection>
          </Wrapper>
        )
      }}
    </Query>
  )
}

const Paper = styled.div`
  background: linear-gradient(#e8eaf6, #c5cae9);
  padding: 40px;
  width: 280px;
  &:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    margin-left: 40px;
  }
  &:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    margin-right: 40px;  
  }
  position: relative;
  margin-top: 6px;
  margin-bottom: 6px;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  overflow-y: scroll
`

const MainSection = styled.div`
  height: 100%;
  margin-right: -40px;
  margin-left: -40px;
  display: flex;
  overflow-x: scroll;
  position: relative;
`

const Belt = styled.div`
  position: absolute;
  height: 100%;
  display: flex;
`

const TopSection = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
`

const BottomSection = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
  justify-content: flex-end;
`

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 40px;
  right: 40px;
`

export default compose(
  withRouter,
  graphql(INSERT_TOPIC_RATING, { name: 'insertTopicRating' })
)(Result)
