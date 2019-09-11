import React from 'react'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import uuid from 'uuid'

import {
  FETCH_MY_TOPIC,
  FETCH_TAKEN_TOPIC,
  INSERT_USER_ACTIVITY,
  FETCH_ACTIVITY_LOGS
} from './queries'
import { Button, FullPageLoader } from '../../components'
import Icon from '../../components/Icon'
import { useStateValue } from '../../libs'
import PlaceholderImage from '../../assets/placeholder.png'

const AvatarContainer = styled.div`
  border-radius: 50%;
  vertical-align: middle;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #c5cae9;
  font-size: 0.75em;
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
  font-size: 12px;
  margin-bottom: 4px;
`

const Title = styled.div`
  color: #1a237e;
  font-size: 20px;
  line-height: 20px;
  font-weight: 700;
  max-height: 60%;
  overflow-y: scroll;
`

const Author = styled.div`
  color: #1a237e;
  font-size: 12px;
  opacity: 0.8;
  line-height: 12px;
  margin-bottom: 6px;
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
  justify-content: center;
  padding: 20px;
  width: 210px;
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
`

const Image = styled.img`
  width: 30px;
`

const Profile = ({ user, history, insertUserActivity }) => {
  const [, globalDispatch] = useStateValue()
  const { data: userTopicsData, error: userTopicsError, loading: userTopicsLoading } = useQuery(
    FETCH_MY_TOPIC,
    {
      variables: {
        userId: user.id
      }
    }
  )
  const { data: takenTopicsData, error: takenTopicsError, loading: takenTopicsLoading } = useQuery(
    FETCH_TAKEN_TOPIC,
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
  if (userTopicsLoading || takenTopicsLoading || activityLogsLoading) {
    return <FullPageLoader />
  }

  const initials = user.first_name.charAt(0) + user.last_name.charAt(0)

  if (userTopicsError) {
    globalDispatch({
      networkError: userTopicsError.message
    })
  }
  if (takenTopicsError) {
    globalDispatch({
      networkError: takenTopicsError.message
    })
  }
  if (activityLogsError) {
    globalDispatch({
      networkError: activityLogsError.message
    })
  }
  const userTopics = userTopicsData.topic
  const takenTopics = takenTopicsData.user_activity
  const activityLogs = activityLogsData.user_activity
  console.log('MY TOPICS: ', userTopics, takenTopics)
  return (
    <Container>
      <ProfileInfo onClick={() => history.push('/edit-profile')}>
        {user.avatar === undefined ? (
          <AvatarContainer>{initials.toUpperCase()}</AvatarContainer>
        ) : (
          <AvatarContainer style={{ backgroundImage: `${user.avatar}` }} />
        )}
      </ProfileInfo>
      <CenteredText>
        {user.first_name} {user.last_name}
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
                      <Title>{topic.name}</Title>
                      <Author>{date.toDateString()}</Author>
                      <Author>{topic.description}</Author>
                      <Author>
                        <Icon name='thumb_up_alt' />{' '}
                        {topic.ratings.length > 0
                          ? topic.ratings.filter((r) => r.type === 'upvote').length
                          : 0}
                      </Author>
                      <Author>
                        <Icon name='thumb_down_alt' />{' '}
                        {topic.ratings.length > 0
                          ? topic.ratings.filter((r) => r.type === 'downvote').length
                          : 0}
                      </Author>
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
        <Wrapper>
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
        </Wrapper>
        <Wrapper>
          <SectionTitle>Activity Logs</SectionTitle>
          <div>
            {activityLogs.length === 0 ? (
              <NoTopicsHolder>
                <Image src={PlaceholderImage} /> No Activity Logs Yet
              </NoTopicsHolder>
            ) : (
              <div>
                {activityLogs.map((log, index) => {
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
                      <div style={{ paddingLeft: '40px' }}>
                        <Author>
                          <strong>
                            {user.first_name} {user.last_name}
                          </strong>
                        </Author>
                        <Author>
                          {activity} the topic <strong>{log.topic.name}</strong>
                        </Author>
                        <Author>{date.toISOString().split('T')[0]}</Author>
                      </div>
                    </ActivityWrapper>
                  )
                })}
              </div>
            )}
          </div>
        </Wrapper>
      </TopicWrapper>
    </Container>
  )
}

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(Profile)
