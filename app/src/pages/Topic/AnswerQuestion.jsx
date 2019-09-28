import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'

import { useStateValue } from '../../libs'
import { Button, HeaderText, ContentBetween, OverlayLoader } from '../../components'
import { Paper } from '../../components/Topic'
import SessionWaitingScreen from '../../components/Topic/SessionWaitingScreen'

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

const FETCH_NEXT_SESSION_QUESTION = gql`
  query fetchNextSessionQuestion($userId: ID!, $sessionId: ID!) {
    next_session_question(userId: $userId, sessionId: $sessionId)
  }
`

const AnswerQuestion = ({
  // },
  match: {
    params: { sessionId }
  },
  user,
  history,
  answerQuestion
}) => {
  const [answers, setAnswers] = useState([])
  const [timer, setTimer] = useState(10)
  const [globalState, globalDispatch] = useStateValue()
  const { data, loading, error } = useQuery(FETCH_NEXT_SESSION_QUESTION, {
    variables: {
      userId: user.id,
      sessionId
    },
    pollInterval: 1000
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

  useEffect(() => {
    console.warn('resetting:', data)
    setTimer(10)
  }, [data])

  if (error) {
    globalDispatch({
      networkError: error.message
    })
    history.push('/')
    return null
  }

  if (data.next_session_question === 'waiting') {
    return <SessionWaitingScreen />
  }

  const question = data.next_session_question ? JSON.parse(data.next_session_question) : null
  if (!loading && !error && !question) {
    history.push(`/result/${sessionId}`)
  }

  const handleSubmit = async () => {
    globalDispatch({
      loading: true
    })
    try {
      await answerQuestion({
        variables: {
          userId: user.id,
          questionId: question.id,
          sessionId,
          answers
        }
      })
    } catch (error) {
      setTimer(0)
      console.error('error@answerquestion:1')
      globalDispatch({
        networkError: error.message
      })
    }
    globalDispatch({
      loading: false
    })
  }

  if (error) {
    console.error('error@answerquestion:2')
    globalDispatch({
      networkError: error.message
    })
    return null
  }
  if (loading && !globalState.loading) {
    return <OverlayLoader />
  }
  if (!question) {
    return <div />
  }
  const choices = question.answers
  return (
    <Wrapper>
      <Paper loadingPercentage={timer * 10}>
        <QuestionContainer>
          <HeaderText>
            <Question>{question.question}</Question>
          </HeaderText>
        </QuestionContainer>
        <ChoicesContainer>
          {choices &&
            choices.map((choice, index) => {
              return (
                <Choice
                  key={index}
                  selected={answers.includes(choice.answer)}
                  onClick={() => {
                    if (timer) {
                      if (!answers.includes(choice.answer)) {
                        setAnswers(answers.concat(choice.answer))
                      } else {
                        setAnswers(answers.filter((answer) => answer !== choice.answer))
                      }
                    }
                  }}
                >
                  {choice.answer}
                </Choice>
              )
            })}
        </ChoicesContainer>
      </Paper>
      <ContentBetween>
        <Button
          text={'Exit'}
          onClick={() => {
            history.push('/')
          }}
        />
        <Button
          text={timer < 1 ? 'Skip' : 'Submit'}
          type='primary'
          onClick={() => {
            handleSubmit()
          }}
        />
      </ContentBetween>
    </Wrapper>
  )
}

const Question = styled.div`
  color: #1a237e;
  font-size: 1.25em;
  font-weight: 700;
`

const ChoicesContainer = styled.div`
  width: 100%;
  position: absolute;
  left: 0px;
  bottom: 0px;
  height: 60%;
  border-radius: 1vh;
  text-align: center;
  padding: 1vh;
  justify-content: space-evenly;
`

const Choice = styled.div`
  padding-top: 5%;
  margin-bottom: 15px;
  background: ${(props) =>
    props.selected ? 'linear-gradient(#FFA726, #FF9800)' : 'linear-gradient(#9c27b0, #7B1FA2)'};
  color: white;
  font-weight: ${(props) => props.selected ? '700' : 'normal'};
  width: 100%;
  height: 20%;
  border-radius: 1vh;
  border: ${(props) => (props.selected ? '2px solid #FF9800' : '1px solid #7B1FA2')};
  text-align: center;
  justify-content: center;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
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
  graphql(ANSWER_QUESTION, { name: 'answerQuestion' })
)(AnswerQuestion)
