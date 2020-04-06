import React, { useState } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'

import { useStateValue, getObjectValue } from '../../libs'
import {
  // Button,
  HeaderText,
  ContentBetween,
  FullPageLoader
} from '../../components'
import { Paper } from '../../components/Topic'
import { Input, Button } from 'reactstrap'

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

  return (
    <Wrapper>
      <Paper className='h-100 d-flex flex-column justify-content-between bg-danger'>
        {/* <QuestionContainer className='bg-warning'> */}
        {/* <HeaderText className='h-100 mt-4 d-flex flex-column justify-content-between bg-danger'> */}
        {/* <InputGroup> */}
        <HeaderText>
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
        </HeaderText>
        <Button
          className='w-100'
          size='lg'
          color={copySuccess ? 'success' : 'primary'}
          onClick={() => {
            navigator.clipboard.writeText(
              `${process.env.REACT_APP_URL}/session/${sessionId}/challenge/${encodeURIComponent(
                user.first_name + ' ' + user.last_name
              )}/topic/${encodeURIComponent(getObjectValue(data, 'session[0].topic.name'))}`
            )
            setCopySuccess(true)
          }}
        >
          {copySuccess ? 'Copied!' : 'Copy'}
        </Button>
        {/* {typeof navigator.share !== 'undefined' && (
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
              )} */}
        {/* </HeaderText> */}
        {/* </QuestionContainer> */}
      </Paper>
      <ContentBetween>
        <Button
          onClick={() => {
            history.push('/')
          }}
        >
          Exit
        </Button>
        <Button
          color='primary'
          onClick={() => {
            // handleSubmit()
            history.push('/session/' + sessionId)
          }}
        >
          Proceed
        </Button>
      </ContentBetween>
    </Wrapper>
  )
}

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
