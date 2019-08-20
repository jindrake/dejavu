import React from 'react'
import { compose, Query, graphql } from 'react-apollo'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import uuid from 'uuid'

import { FETCH_MY_TOPIC, FETCH_TAKEN_TOPIC, INSERT_USER_ACTIVITY } from './queries'
import { Button } from '../../components'
import Icon from '../../components/Icon'

const AvatarContainer = styled.div`
  border-radius: 50%;
  vertical-align: middle;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-color: white;
`

const ProfileInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 4em;
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
  top: 22%;
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

const Profile = ({ user, history, insertUserActivity }) => {
  console.log(user.id)

  return (
    <Container>
      <ProfileInfo>
        <AvatarContainer />
        {/* <Icon name='perm_identity' /> */}
      </ProfileInfo>
      <CenteredText>
        {user.first_name} {user.last_name}
      </CenteredText>
      <hr />
      <TopicWrapper>
        <Query query={FETCH_MY_TOPIC} variables={{ userId: user.id }}>
          {({ data, error, loading }) => {
            if (error) return <div>Error fetching topic: {error.message}</div>
            if (loading) return <div>loading topic...</div>
            const topics = data.topic
            console.log('MY TOPICS: ', topics)
            return (
              <Wrapper>
                <SectionTitle>Your created topics</SectionTitle>
                <TopicsContainer>
                  <Belt>
                    {topics.length === 0 ? (
                      <CenteredText>No Created Topics</CenteredText>
                    ) : (
                      topics.map((topic, index) => {
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
                            <Author>Date: {date.toDateString()}</Author>
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
                      })
                    )}
                  </Belt>
                </TopicsContainer>
              </Wrapper>
            )
          }}
        </Query>
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
        <Query query={FETCH_TAKEN_TOPIC} variables={{ userId: user.id }}>
          {({ data, error, loading }) => {
            if (error) return <div>Error fetching topic: {error.message}</div>
            if (loading) return <div>loading topic...</div>
            const topics = data.user_activity
            console.log('TAKEN TOPICS:', topics)
            return (
              <Wrapper>
                <SectionTitle>Recent Topics</SectionTitle>
                <TopicsContainer>
                  <Belt>
                    {topics.length === 0 ? (
                      <CenteredText>No Recent Topics</CenteredText>
                    ) : (
                      topics.map((topic, index) => {
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
                        )
                      })
                    )}
                  </Belt>
                </TopicsContainer>
              </Wrapper>
            )
          }}
        </Query>
      </TopicWrapper>
    </Container>
  )
}

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(Profile)
