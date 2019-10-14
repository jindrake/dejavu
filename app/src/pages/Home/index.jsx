import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withFirebase from '../../hocs/withFirebase'

import { useStateValue } from '../../libs'
import { Button } from 'reactstrap'
import { FETCH_HOT_TOPICS, FETCH_RECENT_TOPICS, FETCH_USER_SESSIONS } from './queries'
import { FullPageLoader, Icon, Placeholder, CardWrapper, Belt, TopicsContainer, Author } from '../../components'
import TopicPreview from './TopicPreview'
import { useQuery } from '@apollo/react-hooks'

const Home = ({ history }) => {
  const [{ user }, globalDispatch] = useStateValue()

  const {
    data: recentTopicsData,
    loading: recentTopicsLoading,
    error: recentTopicsError
  } = useQuery(FETCH_RECENT_TOPICS, {
    fetchPolicy: 'no-cache'
  })
  const { loading: hotTopicsLoading, error: hotTopicsError } = useQuery(
    FETCH_HOT_TOPICS,
    {
      fetchPolicy: 'no-cache'
    }
  )
  const {
    data: userSessionsData,
    loading: userSessionsLoading,
    error: userSessionsError
  } = useQuery(FETCH_USER_SESSIONS, {
    skip: !user,
    fetchPolicy: 'no-cache',
    variables: {
      userId: user && user.id
    }
  })

  if (window.localStorage.getItem('newUser')) {
    window.localStorage.removeItem('newUser')
    history.push('/welcome')
  }

  const componentError = recentTopicsError || hotTopicsError || userSessionsError

  if (componentError) {
    console.error('error@home')
    globalDispatch({
      networkError: componentError.message
    })
  }

  if (recentTopicsLoading || hotTopicsLoading || userSessionsLoading) {
    return <FullPageLoader />
  }

  // const hotTopics = hotTopicsData.topic
  const recentTopics = recentTopicsData.topic
  const userSessions =
    userSessionsData && userSessionsData.get_user_sessions
      ? JSON.parse(userSessionsData.get_user_sessions)
      : []
  console.log('User sessions:', userSessions)

  return (
    <Wrapper>
      <GreetingWrapper>
        Hello, {user ? <span className='text-capitalize'>{user.first_name}</span> : 'Study Buddy'}!
        <CreateButtonContainer className='mt-3'>
          <CreateTopicButton id='button' onClick={() => history.push('/topic/create')}>
            <AddIcon name='add' />
            Create a Topic
          </CreateTopicButton>
        </CreateButtonContainer>
      </GreetingWrapper>
      <SectionWrapper>
        <Title>Your sessions</Title>
        <TopicsContainer>
          <Belt>
            {userSessions.length > 0 ? (
              userSessions.map((session, index) => (
                <CardWrapper key={index} onClick={() => {
                  history.push('/session/' + session.id)
                }}>
                  <CardTitle>
                    {session.topic.name}
                  </CardTitle>
                  <br />
                  <Author>
                    status:&nbsp;
                    {session.current_user ? (
                      session.current_user_id === user.id ? (
                        <span className='text-danger'>Your turn!</span>
                      ) : (
                        <span className='text-warning'>Waiting for {session.current_user.first_name}</span>
                      )
                    ) : (
                      <div>
                        <span className='text-success'>Finished</span>
                      </div>
                    )}
                  </Author>
                  <Author className='mt-3'>
                    {new Date(session.updated_at).toDateString()}
                  </Author>
                </CardWrapper>
              ))
            ) : (
              <Placeholder text='Start a session by tackling a topic' />
            )}
          </Belt>
        </TopicsContainer>
      </SectionWrapper>
      {/* <SectionWrapper>
        <Title>Hot Topics</Title>
        <TopicsContainer>
          <Belt className='w-100'>
            {hotTopics.length > 0 ? (
              hotTopics.map((topic, index) => (
                <TopicPreview key={index} n={index} topic={topic} user={user} />
              ))
            ) : (
              <Placeholder />
            )}
          </Belt>
        </TopicsContainer>
      </SectionWrapper> */}
      <SectionWrapper>
        <Title>Recent Topics</Title>
        <TopicsContainer>
          <Belt>
            {recentTopics.length > 0 ? (
              recentTopics.map((topic, index) => (
                <TopicPreview key={index} n={index} topic={topic} user={user} />
              ))
            ) : (
              <Placeholder />
            )}
          </Belt>
        </TopicsContainer>
      </SectionWrapper>
    </Wrapper>
  )
}

const CardTitle = styled.div`
  color: #1a237e;
  font-size: 2vh;
  font-weight: 700;
  max-height: 60%;
  overflow-y: scroll;
  justify-content: left;
`

// const Author = styled.div`
//   color: #1a237e;
//   font-size: 2vh;
//   opacity: 0.8;
//   @media screen and (min-width: 900px) {
//     margin-bottom: 20px;
//   }
// `

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 80px;
  width: 100%;
  top: 0;
  padding: 40px;
  padding-bottom: 0;
`

const GreetingWrapper = styled.div`
  font-size: 2vh;
  font-weight: 700;
  color: #e8eaf6;
  text-align: left;
`

const CreateButtonContainer = styled.div`
  justify-content: left;
`

const CreateTopicButton = styled(Button)`
  background: linear-gradient(#ffa726, #ff9800);
  font-size: 2vh;
  border: none;
`

const AddIcon = styled(Icon)`
  width: 30%;
`

// const Belt = styled.div`
//   position: absolute;
//   top: 6px;
//   bottom: 6px;
//   display: flex;
//   border: 2px solid red;
// `

// const TopicsContainer = styled.div`
//   position: relative;
//   overflow-x: scroll;
//   height: 100%;
//   margin-left: -40px;
//   margin-right: -40px;
//   border: 2px solid black;
//   display: flex;
// `

const Title = styled.div`
  color: #c5cae9;
  font-size: 2vh;
`

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 4vh;
  height: 80%;
`

export default compose(
  withFirebase()
  // graphql(FETCH_HOT_TOPICS, { name: 'fetchHotTopics', options: { fetchPolicy: 'no-cache' } }),
  // graphql(FETCH_RECENT_TOPICS, { name: 'fetchRecentTopics', options: { fetchPolicy: 'no-cache' } })
)(Home)
