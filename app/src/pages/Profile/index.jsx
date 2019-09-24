import React from 'react'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import uuid from 'uuid'
import gql from 'graphql-tag'
import {
  FETCH_MY_TOPIC,
  // FETCH_TAKEN_TOPIC,
  INSERT_USER_ACTIVITY,
  FETCH_ACTIVITY_LOGS
} from './queries'
import { Button, FullPageLoader } from '../../components'
import Icon from '../../components/Icon'
import { useStateValue, getObjectValue } from '../../libs'
import PlaceholderImage from '../../assets/placeholder.png'

const AvatarContainer = styled.div`
  border-radius: 6vh;
  width: 12vh;
  height:  12vh;
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
  color: white;
  font-weight: 500;
`

const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: auto;
`

const TopicWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 80px;
  width: 100%;
  height: 100%;
  top: 20%;
  padding: 30px;
  padding-bottom: 0;
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

const Title = styled.div`
  color: #1a237e;
  font-size: 2vh;
  ${'' /* @media (min-width: 900px) {
    font-size: 12px;
  }

  @media (max-width: 900px) {
    font-size: 3vw;
  } */}
  font-weight: 700;
`

const Author = styled.div`
  color: #1a237e;
  font-size: 2vh;
  ${'' /* @media (min-width: 900px) {
    font-size: 16px;
  }

  @media (max-width: 900px) {
    font-size: 4vw;
  } */}
`

const Belt = styled.div`
  position: absolute;
  top: 6px;
  bottom: 6px;
  display: flex;
`

const TopicsContainer = styled.div`
  position: relative;
  overflow-x: scroll;
  height: 100%;
  margin-left: -40px;
  margin-right: -40px;
`

const PreviewWrapper = styled.div`
  background: linear-gradient(#e8eaf6, #c5cae9);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 10px;

  @media (min-width: 800px) {
    width: 210px;
  }

  @media (max-width: 1024px) {
    width: 50vw;
  }

  margin-left: 20px;
  &:first-child {
    margin-left: 40px;
  }
  &:last-child {
    margin-right: 40px;
  }
  border-radius: 6px;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  animation-delay: ${({ n }) => n * 100 + 'ms'};
`

const NoTopicsHolder = styled.div`
  color: white;
  font-size: 20px;
  text-align: center;
`
const ActivityWrapper = styled.div`
  background: linear-gradient(#e8eaf6, #c5cae9);
  justify-content: center;
  padding: 20px;
  width: 92%;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 60px;
  }
  border-radius: 6px;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  animation-delay: ${({ n }) => n * 100 + 'ms'};
`

const ActivityIcon = styled.div`
  float: left;
  padding-left: 0;
  font-size: 1.25em;
  color: #1a237e;
  margin: 0;
  position: absolute;
  top: 35%;
`

const Image = styled.img`
  width: 30px;
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

const Profile = ({ user, history, insertUserActivity }) => {
  const [, globalDispatch] = useStateValue()

  const { data: userData, loading: userDataLoading, error: userDataError } = useQuery(FETCH_USER, {
    variables: {
      userId: user.id
    }
  })
  // console.log('DATA:', userData.user)
  // console.log(getObjectValue(userData, 'user[0]'))
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
  // const { data: takenTopicsData, error: takenTopicsError, loading: takenTopicsLoading } = useQuery(
  //   FETCH_TAKEN_TOPIC,
  //   {
  //     variables: {
  //       userId: user.id
  //     }
  //   }
  // )
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
  // if (takenTopicsError) {
  //   console.error('error@profile:2')
  //   globalDispatch({
  //     networkError: takenTopicsError.message
  //   })
  // }
  if (activityLogsError) {
    console.error('error@profile:3')
    globalDispatch({
      networkError: activityLogsError.message
    })
  }
  const userTopics = userTopicsData.topic
  // const takenTopics = takenTopicsData.user_activity
  const activityLogs = activityLogsData.user_activity
  // console.log('MY TOPICS: ', userTopics, takenTopics)
  // console.log(activityLogs)
  const uniqueLogs = Array.from(new Set(activityLogs.map(a => a.topic.id))).map(id => { return activityLogs.find(a => a.topic.id === id) })
  console.log('mytopics', userTopics)
  return (
    <Container>
      <ProfileInfo onClick={() => history.push('/edit-profile')}>
        {currentUser.avatar === undefined ? (
          <AvatarContainer>{initials.toUpperCase()}</AvatarContainer>
        ) : (
          <AvatarContainer style={{ backgroundImage: `${currentUser.avatar}` }} />
        )}
      </ProfileInfo>
      <CenteredText>
        {currentUser.first_name} {currentUser.last_name}
      </CenteredText>
      <hr />
      <TopicWrapper>
        <Wrapper>
          <SectionTitle>Your created topics</SectionTitle>
          <TopicsContainer>
            {userTopics.length === 0 ? (
              <NoTopicsHolder>
                <Image src={PlaceholderImage} /> No Created Topics
              </NoTopicsHolder>
            ) : (
              <Belt>
                {userTopics.map((topic, index) => {
                  const date = new Date(topic.created_at)
                  return (
                    <PreviewWrapper
                      key={index}
                      onClick={() => {
                        if (user) {
                          insertUserActivity({
                            variables: {
                              userActivity: {
                                id: uuid(),
                                activity_type: 'view',
                                user_id: user.id,
                                topic_id: topic.id
                              }
                            }
                          })
                            .then((res) => {
                              console.log(res)
                            })
                            .catch((err) => {
                              console.log(err.message)
                            })
                        }
                        history.push(`topic/${topic.id}`)
                      }}
                    >
                      <Title>Title:{topic.name}</Title>
                      <Author>{date.toDateString()}</Author>
                      <Author>{topic.description}</Author>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
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
                        </div>
                      </div>
                    </PreviewWrapper>
                  )
                })}
              </Belt>
            )}
          </TopicsContainer>
        </Wrapper>
        <br />
        <CenteredText>
          <Button
            text='Create New Topic'
            type='primary'
            onClick={() => {
              history.push('/topic/create')
            }}
          />
        </CenteredText>
        {/* <Wrapper>
          <SectionTitle>Recent Topics</SectionTitle>
          <TopicsContainer>
            {takenTopics.length === 0 ? (
              <NoTopicsHolder>
                <Image src={PlaceholderImage} /> No Recent Topics
              </NoTopicsHolder>
            ) : (
              <Belt>
                {takenTopics.map((topic, index) => (
                  <PreviewWrapper
                    key={index}
                    onClick={() => {
                      if (user) {
                        insertUserActivity({
                          variables: {
                            userActivity: {
                              id: uuid(),
                              activity_type: 'view',
                              user_id: user.id,
                              topic_id: topic.topic.id
                            }
                          }
                        })
                          .then((res) => {
                            console.log(res)
                          })
                          .catch((err) => {
                            console.log(err.message)
                          })
                      }
                      history.push(`topic/${topic.topic.id}`)
                    }}
                  >
                    <Title>{topic.topic.name}</Title>
                    <Author>{topic.topic.description}</Author>
                    <Author>
                      <Icon name='thumb_up_alt' />{' '}
                      {topic.topic.ratings.length > 0
                        ? topic.topic.ratings.filter((r) => r.type === 'upvote').length
                        : 0}
                    </Author>
                    <Author>
                      <Icon name='thumb_down_alt' />{' '}
                      {topic.topic.ratings.length > 0
                        ? topic.topic.ratings.filter((r) => r.type === 'downvote').length
                        : 0}
                    </Author>
                  </PreviewWrapper>
                ))}
              </Belt>
            )}
          </TopicsContainer>
        </Wrapper> */}
        <SectionTitle>Activity Logs</SectionTitle>
        <div style={{ height: '40vh', overflowY: 'scroll' }}>
          {uniqueLogs.length === 0 ? (
            <NoTopicsHolder>
              {/* <Image src={PlaceholderImage} />  */}
                No Activity Logs Yet
            </NoTopicsHolder>
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
                  <ActivityWrapper key={index}>
                    <ActivityIcon>
                      <Icon name={icon} />
                    </ActivityIcon>
                    <div style={{ paddingLeft: '6vh' }}>
                      <Author>
                        <strong>
                          {user.first_name} {user.last_name}
                        </strong>
                      </Author>
                      <Author>
                        {activity} the topic <strong>{ log.topic === null ? log.question.topics[0].topic.name : log.topic.name }</strong>
                      </Author>
                      <Author>{date.toISOString().split('T')[0]}</Author>
                    </div>
                  </ActivityWrapper>
                )
              })}
            </div>
          )}
        </div>
      </TopicWrapper>
    </Container>
  )
}

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(Profile)
