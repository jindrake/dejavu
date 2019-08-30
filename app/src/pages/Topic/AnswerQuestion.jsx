import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'
import uuid from 'uuid/v4'

import { getObjectValue, useStateValue } from '../../libs'
import { ContentRight, Button, HeaderText, FullPageLoader } from '../../components'
import { Paper } from '../../components/Topic'

const FETCH_QUESTION = gql`
  query fetchQuestion($questionId: uuid!) {
    question(where: { id: { _eq: $questionId } }) {
      id
      question
      answers {
        answer
      }
    }
  }
`

const INSERT_USER_ACTIVITY = gql`
  mutation insertUserActivity($userActivity: [user_activity_insert_input!]!) {
    insert_user_activity(objects: $userActivity) {
      affected_rows
    }
  }
`

const AnswerQuestion = ({
  location: {
    state: { questionIds }
  },
  match: {
    params: { questionId, topicSessionId, id: topicId }
  },
  user,
  history,
  insertUserActivity
}) => {
  const remainingIds = questionIds.slice(1)
  const [answers, setAnswers] = useState([])
  const [timer, setTimer] = useState(10)
  const [, globalDispatch] = useStateValue()
  const { data, loading, error } = useQuery(FETCH_QUESTION, {
    variables: {
      questionId
    }
  })

  useEffect(() => {
    const tick = () => {
      setTimer(timer - 1)
    }
    const timerID = setInterval(() => tick(), 1000)
    if (timer < 1) {
      clearInterval(timerID)
    }

    return () => {
      clearInterval(timerID)
    }
  })

  const handleSubmit = async () => {
    globalDispatch({
      loading: true
    })
    try {
      await insertUserActivity({
        variables: {
          userActivity: {
            id: uuid(),
            activity_type: 'answer',
            user_id: user.id,
            topic_id: topicId,
            question_id: questionId,
            topic_session_id: topicSessionId,
            answer: JSON.stringify(answers)
          }
        }
      })
      console.log('RemainingIds:', remainingIds)
      if (remainingIds.length > 0) {
        history.push({
          pathname: `/topic/${topicId}/questions/${remainingIds[0]}/topicSession/${topicSessionId}`,
          state: { questionIds: remainingIds }
        })
      } else {
        history.push({
          pathname: `/result/${topicId}/topicSession/${topicSessionId}`
        })
      }
    } catch (error) {
      setTimer(0)
      console.error(error)
      globalDispatch({
        networkError: error.message
      })
    }
    globalDispatch({
      loading: false
    })
  }

  if (error) {
    globalDispatch({
      networkError: error.message
    })
    return null
  }
  if (loading) {
    return <FullPageLoader />
  }
  const result = getObjectValue(data, 'question[0]')
  const choices = result.answers
  return (
    <Wrapper>
      <Paper loadingPercentage={timer * 10}>
        <QuestionContainer>
          <HeaderText>{result.question}</HeaderText>
        </QuestionContainer>
        <ChoicesContainer>
          {choices &&
            choices.map((choice, index) => {
              return (
                <Choice
                  key={index}
                  selected={answers.includes(choice.answer)}
                  onClick={() => {
                    if (!answers.includes(choice.answer)) {
                      setAnswers(answers.concat(choice.answer))
                    } else {
                      setAnswers(answers.filter((answer) => answer !== choice.answer))
                    }
                  }}
                >
                  {choice.answer}
                </Choice>
              )
            })}
        </ChoicesContainer>
      </Paper>
      <ContentRight>
        <Button
          text={timer < 1 ? 'Skip' : 'Submit'}
          type='primary'
          onClick={() => {
            handleSubmit()
          }}
        />
      </ContentRight>
    </Wrapper>
  )
}

const ChoicesContainer = styled.div`
  width: 100%;
  position: absolute;
  left: 0px;
  bottom: 0px;
  height: 60%;
  border-radius: 1vh;
  display: flex;
  padding: 1vh;
  justify-content: space-evenly;
  flex-wrap: wrap;
`

const Choice = styled.div`
  background-color: white;
  width: 50%;
  height: 50%;
  border-radius: 1vh;
  border: 1px solid black;
  border: ${(props) => (props.selected ? '2px solid yellow' : '1px solid black')};
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
`
const QuestionContainer = styled.div`
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(AnswerQuestion)
