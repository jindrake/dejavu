import React from 'react'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import {
  FETCH_MY_TOPIC,
  // FETCH_TAKEN_TOPIC,
  INSERT_USER_ACTIVITY,
  FETCH_ACTIVITY_LOGS
} from './queries'
import { FullPageLoader, Placeholder, Icon, ContentCenter, Button } from '../../components'
import { useStateValue, getObjectValue } from '../../libs'

const AvatarContainer = styled.div`
  border-radius: 6vh;
  width: 12vh;
  height: 12vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #c5cae9;
  font-size: 7vh;
  color: #1a237e;
`

const ProfileInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 4em;
  cursor: pointer;
`

const CenteredText = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5px;
  font-weight: 500;
`

const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: auto;
  padding-top: 5vh;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 30%;
`

const SectionTitle = styled.div`
  color: #c5cae9;
  @media (min-width: 800px) {
    font-size: 20px;
  }
  @media (max-width: 1024px) {
    font-size: 4vw;
  }
  margin-bottom: 4px;
`

const Author = styled.div`
  color: #1a237e;
  font-size: 2vh;
`

const TopicsContainer = styled.div``

const DejavuCard = styled.div`
  background: linear-gradient(#e8eaf6, #c5cae9);
  /* justify-content: center;
  padding: 20px;
  width: 92%;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 60px;
  } */
  border-radius: 6px;
  /* box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  animation-delay: ${({ n }) => n * 100 + 'ms'}; */
  display: flex;
  justify-content: flex-start;
  padding: 1vh;
  color: #1a237e;
`

const ActivityIcon = styled.div`
  font-size: 1.25em;
  color: #1a237e;
  margin: 1vh;
`

const FETCH_USER = gql`
  query fetchUser($userId: uuid!) {
    user(where: { id: { _eq: $userId } }) {
      email
      first_name
      last_name
      id
      fields {
        field
        id
        has_finished
      }
    }
  }
`

const Profile = ({ user }) => {
  const [, globalDispatch] = useStateValue()

  const { data: userData, loading: userDataLoading, error: userDataError } = useQuery(FETCH_USER, {
    variables: {
      userId: user.id
    }
  })
  const currentUser = getObjectValue(userData, 'user[0]')
  console.log(currentUser)

  const { data: userTopicsData, error: userTopicsError, loading: userTopicsLoading } = useQuery(
    FETCH_MY_TOPIC,
    {
      variables: {
        userId: user.id
      }
    }
  )
  const {
    data: activityLogsData,
    error: activityLogsError,
    loading: activityLogsLoading
  } = useQuery(FETCH_ACTIVITY_LOGS, {
    variables: {
      userId: user.id
    }
  })
  if (userTopicsLoading || activityLogsLoading || userDataLoading) {
    return <FullPageLoader />
  }

  const initials = user.first_name.charAt(0) + user.last_name.charAt(0)

  if (userTopicsError) {
    console.error('error@profile:1')
    globalDispatch({
      networkError: userTopicsError.message
    })
  }

  if (userDataError) {
    console.error('error@profile:2')
    globalDispatch({
      networkError: userTopicsError.message
    })
  }
  if (activityLogsError) {
    console.error('error@profile:3')
    globalDispatch({
      networkError: activityLogsError.message
    })
  }
  const userTopics = getObjectValue(userTopicsData, 'topic') || []
  const activityLogs = getObjectValue(activityLogsData, 'user_activity') || []
  const uniqueLogs = Array.from(new Set(activityLogs.map((a) => a.topic_id))).map((id) => {
    return activityLogs.find((a) => a.topic_id === id)
  })

  console.log('mytopics', userTopics)

  return (
    <Container>
      <div>
        <ProfileInfo>
          {currentUser.avatar === undefined ? (
            <AvatarContainer>{initials.toUpperCase()}</AvatarContainer>
          ) : (
            <AvatarContainer style={{ backgroundImage: `${currentUser.avatar}` }} />
          )}
        </ProfileInfo>
        <CenteredText className='h2'>
          {currentUser.first_name} {currentUser.last_name}
        </CenteredText>
        <ContentCenter className='h6'>{currentUser.email}</ContentCenter>
      </div>
      <div className='mt-5'>
        <Wrapper>
          <SectionTitle>Your created topics</SectionTitle>
          <TopicsContainer>
            {userTopics.length === 0 ? (
              <Placeholder />
            ) : (
              <div>
                {userTopics.map((topic, index) => {
                  return (
                    <DejavuCard className='justify-content-between flex-column' key={index}>
                      <div>
                        <div>{topic.name}</div>
                        <div>
                          <small>{topic.description}</small>
                        </div>
                        <div className='small w-100 d-flex justify-content-between'>
                          <div>
                            {getObjectValue(topic, 'user_activities_aggregate.aggregate.count') || '0'} takers
                          </div>
                          <span className='d-flex text-center justify-content-evenly'>
                            <Author>
                              <Icon name='thumb_down_alt' />{' '}
                              {topic.ratings.length > 0
                                ? topic.ratings.filter((r) => r.type === 'downvote').length
                                : 0}
                            </Author>
                            <div
                              style={{
                                color: '#1a237e',
                                fontSize: '2vh',
                                marginLeft: '10px'
                              }}
                            >
                              <Icon name='thumb_up_alt' />{' '}
                              {topic.ratings.length > 0
                                ? topic.ratings.filter((r) => r.type === 'upvote').length
                                : 0}
                            </div>
                          </span>
                        </div>
                      </div>
                      <div className='w-100 d-flex justify-content-end'>
                        {/* <div className='d-flex'>
                          Takers 1,023 */}
                        {/* <span className='d-flex text-center justify-content-evenly'>
                            <Author>
                              <Icon name='thumb_down_alt' />{' '}
                              {topic.ratings.length > 0
                                ? topic.ratings.filter((r) => r.type === 'downvote').length
                                : 0}
                            </Author>
                            <div
                              style={{
                                color: '#1a237e',
                                fontSize: '2vh',
                                marginLeft: '10px'
                              }}
                            >
                              <Icon name='thumb_up_alt' />{' '}
                              {topic.ratings.length > 0
                                ? topic.ratings.filter((r) => r.type === 'upvote').length
                                : 0}
                            </div>
                          </span> */}
                        {/* </div> */}
                        <div className='text-right w-100 d-flex justify-content-end'>
                          <Button text='Manage' />
                        </div>
                      </div>
                    </DejavuCard>
                  )
                })}
              </div>
            )}
          </TopicsContainer>
        </Wrapper>
        <br />
        <SectionTitle>Activity Logs</SectionTitle>
        <div style={{ height: '40vh', overflowY: 'scroll' }}>
          {uniqueLogs.length === 0 ? (
            <div className='mt-5'>
              <ContentCenter>No Activity Yet</ContentCenter>
            </div>
          ) : (
            <div>
              {uniqueLogs.map((log, index) => {
                const date = new Date(log.created_at)
                let icon = ''
                let activity = ''
                switch (log.activity_type) {
                  case 'take':
                    icon = 'edit'
                    activity = 'taken'
                    break

                  case 'answer':
                    icon = 'assignment_turned_in'
                    activity = 'answered'
                    break

                  case 'view':
                    icon = 'visibility'
                    activity = 'viewed'
                    break

                  case 'rate':
                    icon = 'import_export'
                    activity = 'rated'
                    break

                  default:
                    break
                }
                return (
                  <DejavuCard key={index}>
                    <ActivityIcon>
                      <Icon name={icon} />
                    </ActivityIcon>
                    <div className='mx-5'>
                      <Author>
                        You {activity} the topic{' '}
                        <strong>
                          {log.topic === null ? log.question.topics[0].topic.name : log.topic.name}
                        </strong>
                      </Author>
                      <Author> on {date.toISOString().split('T')[0]}</Author>
                    </div>
                  </DejavuCard>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(Profile)
