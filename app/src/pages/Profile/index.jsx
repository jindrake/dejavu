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
import { FullPageLoader, Placeholder, ContentCenter } from '../../components'
import { useStateValue, getObjectValue } from '../../libs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faEye, faTasks, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import TopicManagementCard from './TopicManagementCard'

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

const Profile = ({ user, history }) => {
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
        <CenteredText className='h2 text-capitalize'>
          {currentUser.first_name} {currentUser.last_name}
        </CenteredText>
        <hr />
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
                  return <TopicManagementCard topic={topic} key={index} history={history} />
                })}
              </div>
            )}
          </TopicsContainer>
        </Wrapper>
        <br />
        <SectionTitle>Activity Logs</SectionTitle>
        <div style={{ height: '40vh', overflowY: 'scroll' }}>
          {activityLogs.length === 0 ? (
            <div className='mt-5'>
              <ContentCenter>No Activity Yet</ContentCenter>
            </div>
          ) : (
            <div>
              {activityLogs.map((log, index) => {
                const date = new Date(log.created_at)
                let icon = ''
                let activity = ''
                switch (log.activity_type) {
                  case 'take':
                    icon = faPencilAlt
                    activity = 'taken'
                    break

                  case 'answer':
                    icon = faTasks
                    activity = 'answered'
                    break

                  case 'view':
                    icon = faEye
                    activity = 'viewed'
                    break

                  case 'rate':
                    icon = faThumbsUp
                    activity = 'rated'
                    break

                  default:
                    break
                }
                return (
                  <DejavuCard key={index}>
                    <ActivityIcon icon={icon} />
                    <Author>
                      You {activity} the topic{' '}
                      <strong>
                        {log.topic === null ? log.question.topics[0].topic.name : log.topic.name}
                      </strong>
                      <br />
                      on {date.toISOString().split('T')[0]}
                    </Author>
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

const AvatarContainer = styled.div`
  border-radius: 6vh;
  width: 12vh;
  height: 12vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d0f0c0;
  font-size: 7vh;
  color: #015249;
  font-family: 'Open Sans';
  font-weight: 700;
`

const ProfileInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 3vh;
  cursor: pointer;
  color: #015249;
`

const CenteredText = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5px;
  font-weight: 500;
  color: #015249;
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
  color: #dae4ee;
  @media (min-width: 800px) {
    font-size: 20px;
  }
  @media (max-width: 1024px) {
    font-size: 2.25vh;
  }
  margin-bottom: 4px;
  font-family: 'Open Sans';
  font-weight: 700;
`

const Author = styled.div`
  color: #015249;
  font-size: 2vh;
`

const TopicsContainer = styled.div``

const DejavuCard = styled.div`
  background: linear-gradient(0deg, #95d6dc, #addee9, #c5e6f3, #dbeffa, #f0f8ff);
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 60px;
  }
  border-radius: 6px;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  animation-delay: ${({ n }) => n * 100 + 'ms'};
  display: flex;
  justify-content: flex-start;
  padding: 1vh;
  color: #015249;
`

const ActivityIcon = styled(FontAwesomeIcon)`
  font-size: 3.5vh;
  color: #015249;
  margin: 1.5vh;
  margin-right: 2.5vh;
`

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(Profile)
