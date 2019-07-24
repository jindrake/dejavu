import React from 'react'
import { compose, Query } from 'react-apollo'
import styled from 'styled-components'
import { Button } from 'reactstrap'
import { withRouter } from 'react-router-dom'

import { FETCH_MY_TOPIC, FETCH_TAKEN_TOPIC } from './queries'

const Author = styled.div`
  color: #e8eaf6;
  font-size: 12px;
  line-height: 12px;
  margin-bottom: 6px;
`

const AvatarContainer = styled.div`
  border-radius: 50%;
  width: 40%;
  background-color: white;
  height: 120px;
`

const ProfileInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 20%;
  text-align: center;
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
`

const Profile = ({ user, history }) => {
  console.log(user.id)

  return (
    <Container>
      <ProfileInfo>
        <AvatarContainer />
      </ProfileInfo>
      <CenteredText>
        {user.first_name} {user.last_name}
      </CenteredText>
      <hr />
      <CenteredText>Your created topics</CenteredText>
      <Query query={FETCH_MY_TOPIC} variables={{ userId: user.id }}>
        {({ data, error, loading }) => {
          if (error) return <div>Error fetching topic: {error.message}</div>
          if (loading) return <div>loading topic...</div>
          const topics = data.topic
          console.log('MY TOPICS: ', topics)
          return (
            <div style={{ display: 'flex', height: '100px', border: '2px solid black', overflowX: 'auto', overflowY: 'auto' }}>
              {
                topics.map(topic => {
                /* eslint-disable camelcase */
                  const date = new Date(topic.created_at)
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100px' }} key={topic.id} >
                      <p>Topic: {topic.name}</p>
                      <p>Desc: {topic.description}</p>
                      <p>Date: {date.toDateString()}</p>
                      <Author>upvote: {topic.ratings.length > 0 ? topic.ratings.filter(r => r.type === 'upvote').length : 0}</Author>
                      <Author>downvote: {topic.ratings.length > 0 ? topic.ratings.filter(r => r.type === 'downvote').length : 0}</Author>
                    </div>
                  )
                })
              }
            </div>
          )
        }}
      </Query>
      <br />
      <CenteredText>
        <Button
          color='link'
          onClick={() => {
            history.push('/topic/create')
          }}
        >
          + create new topic
        </Button>
      </CenteredText>
      <hr />
      <CenteredText>Recent topics</CenteredText>
      <Query query={FETCH_TAKEN_TOPIC} variables={{ userId: user.id }}>
        {({ data, error, loading }) => {
          if (error) return <div>Error fetching topic: {error.message}</div>
          if (loading) return <div>loading topic...</div>
          const topics = data.user_activity
          console.log('TAKEN TOPICS:', topics)
          return (
            <div style={{ display: 'flex', height: '100px', border: '2px solid black', overflowX: 'auto', overflowY: 'auto' }} />
          )
        }}
      </Query>
    </Container>
  )
}

export default compose(
  withRouter
)(Profile)
