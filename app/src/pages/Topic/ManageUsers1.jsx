import React from 'react'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { useQuery } from '@apollo/react-hooks'
import { useStateValue } from '../../libs'
import { FullPageLoader } from '../../components'

const FETCH_MY_TOPIC = gql`
  query fetchMyTopic($userId: uuid!) {
    topic(order_by: { created_at: desc }, limit: 10, where: { creator_id: { _eq: $userId }, is_private: { _eq: true } }) {
      id
      name
      description
      created_at
      ratings {
        id
        type
      }
    }
  }
`

const ManageUsers = ({ user, history }) => {
  // console.log(user && user.id)
  const [, globalDispatch] = useStateValue()
  const { data: userTopicsData, error: userTopicsError, loading: userTopicsLoading } = useQuery(
    FETCH_MY_TOPIC,
    {
      variables: {
        userId: user && user.id
      }
    }
  )

  if (userTopicsLoading) {
    return <FullPageLoader />
  }

  if (userTopicsError) {
    console.error('error@profile:1')
    globalDispatch({
      networkError: userTopicsError.message
    })
  }

  // console.log(userTopicsData.topic)

  return (
    <div>
      <div
        style={{
          fontSize: '2.5vh',
          fontWeight: '600',
          paddingTop: '3px',
          paddingBottom: '3px',
          paddingLeft: '5px',
          paddingRight: '5px',
          backgroundColor: 'white',
          color: 'black',
          marginBottom: '10px',
          borderRadius: '5px',
          width: '10vh',
          textAlign: 'center'
        }}
        onClick={() => history.goBack()}
      >
        Back
      </div>
      <div style={{ fontSize: '3vh', color: 'white', fontWeight: '500' }}>Private Topics:</div>
      {
        userTopicsData.topic.map((topic) => {
          const date = new Date(topic.created_at)
          return (
            <div
              key={topic.id}
              style={{
                margin: '10px',
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                alignItems: 'space-evenly'
              }}
            >
              <div style={{ fontSize: '3vh', color: '#1a237e' }}>Title: {topic.name}</div>
              <div style={{ fontSize: '2vh', color: '#1a237e' }}>Description: {topic.description}</div>
              <div style={{ fontSize: '2vh', color: '#1a237e' }}>Date: {date.toDateString()}</div>
              <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'flex-end' }}>
                <div
                  style={{ fontWeight: '700', borderRadius: '10px', backgroundColor: 'orange', fontSize: '1.5vh', color: '#FFFFFF', padding: '5px' }}
                  onClick={() => {
                    history.push({
                      pathname: `/manage-users/${topic.id}`,
                      state: { topicId: topic.id, type: 'user', topicName: topic.name }
                    })
                  }}
                >
                  Manage Users
                </div>
                <div
                  style={{ fontWeight: '700', marginLeft: '10px', borderRadius: '10px', backgroundColor: 'red', fontSize: '1.5vh', color: '#FFFFFF', padding: '5px' }}
                  onClick={() => {
                    history.push({
                      pathname: `/manage-users/${topic.id}`,
                      state: { topicId: topic.id, type: 'admin', topicName: topic.name }
                    })
                  }}
                >
                  Manage Admins
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default compose(
  withRouter
)(ManageUsers)
