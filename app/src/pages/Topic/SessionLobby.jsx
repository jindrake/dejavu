import React, { useState } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'

import { useStateValue, getObjectValue } from '../../libs'
import {
  Button,
  HeaderText,
  ContentBetween,
  ContentAround,
  FullPageLoader
} from '../../components'
import { Paper } from '../../components/Topic'
import { Input } from 'reactstrap'

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

const FETCH_SESSION = gql`
  query fetchSession($sessionId: uuid!) {
    session(where: { id: { _eq: $sessionId } }) {
      id
      creator_id
      topic {
        id
        name
      }
    }
  }
`

const SessionLobby = ({
  // },
  match: {
    params: { sessionId }
  },
  user,
  history
}) => {
  const [, globalDispatch] = useStateValue()
  const [copySuccess, setCopySuccess] = useState(false)
  // fetch session and creator_id
  const { data, loading, error } = useQuery(FETCH_SESSION, {
    skip: !sessionId,
    variables: {
      sessionId
    }
  })

  if (loading) {
    return <FullPageLoader />
  }

  if (error) {
    globalDispatch({
      networkError: error.message
    })
    return null
  }

  if (user.id !== getObjectValue(data, 'session[0].creator_id')) {
    globalDispatch({
      networkError: 'Unauthorized'
    })
    history.push('/')
  }

  console.log(data)

  return (
    <Wrapper>
      <Paper>
        <QuestionContainer>
          <HeaderText>
            {/* <InputGroup> */}
            Share URL to a friend you want to challenge
            <hr />
            <Input
              disabled
              value={`${
                process.env.REACT_APP_URL
              }/session/${sessionId}/challenge/${encodeURIComponent(
                user.first_name + ' ' + user.last_name
              )}/topic/${encodeURIComponent(getObjectValue(data, 'session[0].topic.name'))}`}
              className='mb-5'
            />
            <ContentAround>
              <Button
                text={copySuccess ? 'Copied!' : 'Copy'}
                type={copySuccess ? 'success' : ''}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${
                      process.env.REACT_APP_URL
                    }/session/${sessionId}/challenge/${encodeURIComponent(
                      user.first_name + ' ' + user.last_name
                    )}/topic/${encodeURIComponent(getObjectValue(data, 'session[0].topic.name'))}`
                  )
                  setCopySuccess(true)
                }}
              />
              {typeof navigator.share !== 'undefined' && (
                <Button
                  text='Share'
                  onClick={(event) => {
                    event.preventDefault()
                    navigator.share({
                      title: 'I challenge you',
                      url: process.env.REACT_APP_URL + '/session/' + sessionId
                    })
                  }}
                />
              )}
            </ContentAround>
          </HeaderText>
        </QuestionContainer>
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
)(SessionLobby)
