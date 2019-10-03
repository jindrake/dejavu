import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'

import { Button, HeaderText, ContentBetween } from '../../components'
import { Paper } from '../../components/Topic'
import { Card, CardTitle } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus } from '@fortawesome/free-solid-svg-icons'

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

// const PARTIAL_RESULTS = gql`
//   query fetchUserAnswers($sessionId: uuid!) {
//     session(where: { id: { _eq: $sessionId } }) {
//       session_questions {
//         question {
//           answers {
//             id
//             is_correct
//           }
//         }
//       }
//     }
//   }
// `

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
        <ResultDiv>
          <Title>Partial Results</Title>
          <UsersDiv>
            <UserAnswers>
              User 1
              <div>
                Q1 &nbsp;
                <FontAwesomeIcon icon={faMinus} />
              </div>
            </UserAnswers>
            <UserAnswers>
              User 2
              <div>
                Q1 &nbsp;
                <FontAwesomeIcon icon={faMinus} />
              </div>
            </UserAnswers>
          </UsersDiv>
        </ResultDiv>
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

const ResultDiv = styled(Card)`
  background: none;
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 10px;
`

const Title = styled(CardTitle)`
  color: #1a237e;
  font-weight: 700;
`

const UsersDiv = styled.div`
  display: flex;
  width: 100%;
`

const UserAnswers = styled.div`
  width: 50%;
  color: #1a237e;
`

export default compose(
  withRouter,
  graphql(ANSWER_QUESTION, { name: 'answerQuestion' })
)(SessionWaitingScreen)
