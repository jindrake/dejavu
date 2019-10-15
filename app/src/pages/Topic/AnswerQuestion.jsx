import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'

import { useStateValue } from '../../libs'
import { HeaderText, ContentBetween, OverlayLoader, ContentCenter } from '../../components'
import { Paper } from '../../components/Topic'
import SessionWaitingScreen from '../../components/Topic/SessionWaitingScreen'
import Img from 'react-image'
import { Button } from 'reactstrap'

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
  console.log('Data question: ', data.next_session_question)
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
    setAnswers([])
    setTimer(10)
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
        {question.img_url ? (
          <div>
            <Img
              src={[question.img_url, 'http://via.placeholder.com/300x300']}
              alt='question img'
              style={{ borderRadius: '5px', width: '100%', marginTop: '20px' }}
            />
            <ContentCenter className='mt-3 mb-3'>
              <HeaderText>{question.question}</HeaderText>
            </ContentCenter>
            <div>
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
            </div>
          </div>
        ) : (
          <>
            <QuestionContainer>
              {/* {question.img_url && (
            <img
              src={question.img_url}
              alt='question img'
              style={{ borderRadius: '5px', width: '100%', marginTop: '20px' }}
            />
          )} */}
              <HeaderText className='dejavu-large-text'>
                <div>{question.question}</div>
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
          </>
        )}
      </Paper>
      <ContentBetween>
        <Button
          color='primary'
          onClick={() => {
            history.push('/')
          }}
        >Exit</Button>
        <Button
          color='primary'
          onClick={() => {
            handleSubmit()
          }}
        >{timer < 1 ? 'Skip' : 'Submit'}</Button>
      </ContentBetween>
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
  text-align: center;
  padding: 1vh;
  justify-content: space-evenly;
`

const Choice = styled.div`
  /* padding-top: 5%; */
  margin-bottom: 15px;
  background: ${(props) =>
    props.selected ? 'linear-gradient(#FFA726, #FF9800)' : '#5574F7'};
  
  font-weight: ${(props) => (props.selected ? 'bold' : 'normal')};
  width: 100%;
  height: 20%;
  border-radius: 1vh;
  /*border: ${(props) => (props.selected ? '2px solid #FF9800' : '1px solid #7B1FA2')}; */
  text-align: center;
  display: flex;
  padding: 3%;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  color: white;
`

const QuestionContainer = styled.div`
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding-top: 10%;
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
