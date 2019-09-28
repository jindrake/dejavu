import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'

import { Button, HeaderText, ContentBetween } from '../../components'
import { Paper } from '../../components/Topic'

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

const SessionWaitingScreen = ({
  // },
  match: {
    params: { sessionId }
  },
  history
}) => {
  return (
    <Wrapper>
      <Paper>
        <QuestionContainer>
          <HeaderText>
            {/* <InputGroup> */}
            Session In-progress
            <hr />
          </HeaderText>
        </QuestionContainer>
        {/* <ChoicesContainer>
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
        </ChoicesContainer> */}
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
)(SessionWaitingScreen)
