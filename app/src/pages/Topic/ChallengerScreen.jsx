import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'

import { Button, HeaderText } from '../../components'
import { Paper } from '../../components/Topic'

const JOIN_SESSION = gql`
  mutation joinSession($sessionId: ID!) {
    join_session(sessionId: $sessionId)
  }
`

const ChallengerScreen = ({
  // },
  match: {
    params: { sessionId, userName, topicName }
  },
  user,
  history,
  location,
  joinSession
}) => {
  // fetch session and creator_id
  // const { data, loading, error } = useQuery(FETCH_SESSION, {
  //   skip: !sessionId,
  //   variables: {
  //     sessionId
  //   }
  // })

  // if (loading) {
  //   return <FullPageLoader />
  // }

  // if (error) {
  //   globalDispatch({
  //     networkError: error.message
  //   })
  //   return null
  // }

  // if (user.id !== getObjectValue(data, 'session[0].creator_id')) {
  //   globalDispatch({
  //     networkError: 'Unauthorized'
  //   })
  //   history.push('/')
  // }

  // console.log(data)
  console.log(location.pathname)
  return (
    <Wrapper>
      <Paper>
        <Container>
          <div className='mt-5'>
            You've been challenged by <strong>{userName}</strong> to tackle the topic:
          </div>
          <HeaderText className='mt-5'>
            {topicName}
          </HeaderText>
          <div>
            <Button
              color='primary'
              onClick={async () => {
                if (user) {
                  // add user to session
                  await joinSession({
                    variables: {
                      sessionId
                    }
                  })
                  history.push('/session/' + sessionId)
                } else {
                  history.push('/sign-in?redirectUrl=' + encodeURIComponent(location.pathname))
                }
              }}
              size='sm'
              className='pl-4 pr-4 mr-3'
            >
              {user ? 'Proceed' : 'Sign-in'}
            </Button>
            <Button
              color='secondary'
              onClick={() => {
                history.push('/')
              }}
              size='sm'
              className='pl-4 pr-4 mr-3'
            >
              Exit
            </Button>
          </div>
        </Container>
      </Paper>
      {/* <ContentBetween>
        <Button
          text={'Exit'}
          onClick={() => {
            history.push('/')
          }}
        />
        <Button
          text={'Proceed'}
          type='primary'
          center={true}
          onClick={() => {
            // handleSubmit()
            history.push('/session/' + sessionId)
          }}
        />
      </ContentBetween> */}
    </Wrapper>
  )
}

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  padding-top: 1vh;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

export default compose(
  withRouter,
  graphql(JOIN_SESSION, { name: 'joinSession' })
)(ChallengerScreen)
