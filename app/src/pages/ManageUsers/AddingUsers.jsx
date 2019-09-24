import React, { useState } from 'react'
import { StyledInput, FullPageLoader } from '../../components/'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { withRouter } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { useStateValue } from '../../libs'

// user
const INSERT_TOPIC_USER = gql`
  mutation insertTopicUser($topicUser: [topic_user_insert_input!]!) {
    insert_topic_user(objects: $topicUser) {
      affected_rows
    }
  }
`
const UPDATE_TOPIC_USER = gql`
  mutation updateTopicUser($email: String, $isAllowed: Boolean!) {
    update_topic_user(where: {email: {_eq: $email}}, _set: {is_allowed: $isAllowed}) {
      affected_rows
    }
  }
`
const DELETE_TOPIC_USER = gql`
  mutation deleteTopicUser($topicId: uuid!) {
    delete_topic_user(where: {topic_id: {_eq: $topicId}}) {
      affected_rows
    }
  }
`

const FETCH_TOPIC_USER = gql`
  query fetchTopicUser {
    topic_user {
      email
      topic_id
      is_allowed
    }
  }
`

// admin
const INSERT_TOPIC_ADMIN = gql`
  mutation insertTopicAdmin($email: String, $topicId: ID!) {
    add_admin_by_email (email: $email, topicId: $topicId)
  }
`

const AddingUsers = ({ deleteTopicUser, updateTopicUser, history, location, insertTopicUser, insertTopicAdmin }) => {
  const [searchValue, setSearchValue] = useState('')
  const { state: { topicId, type, topicName } } = location
  // console.log(location.state)
  const [, globalDispatch] = useStateValue()
  // console.log(topicId)
  // console.log(type)

  const { loading, error, data, refetch } = useQuery(FETCH_TOPIC_USER)
  if (loading) return <FullPageLoader />
  if (error) {
    console.error('error@search:1')
    globalDispatch({
      networkError: error.message
    })
    return null
  }

  // console.log('DATA', data)
  const notAllowedUsers = data.topic_user && data.topic_user.filter(user => user.is_allowed === false)
  const allowedUsers = data.topic_user && data.topic_user.filter(user => user.is_allowed === true)

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
      <div style={{ color: 'white', fontWeight: '600', fontSize: '3vh' }}>
        {type === 'user' ? `Manage Users for: ${topicName}` : `Manage Admins for: ${topicName}`}
      </div>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-evenly'
        }}
      >
        <StyledInput
          type='text'
          name='invite-email'
          id='invite-email'
          placeholder='Insert Email'
          onChange={(event) => {
            setSearchValue(event.target.value)
          }}
        />
        <div
          style={{
            height: '5vh',
            backgroundColor: 'green',
            padding: '5px',
            fontSize: '2vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '35vw',
            borderRadius: '10px',
            marginLeft: '10px',
            color: 'white',
            fontWeight: '500'
          }}
          onClick={() => {
            if (searchValue.length > 0) {
              if (type === 'user') {
                // console.log(searchValue)
                insertTopicUser({
                  variables: {
                    topicUser: {
                      email: searchValue,
                      is_allowed: true,
                      topic_id: topicId
                    }
                  }
                })
                  .then((res) => {
                    // console.log(res)
                    refetch()
                  })
                  .catch((err) => {
                    console.log(err.message)
                  })
              } else {
                // console.log('add admin!')
                insertTopicAdmin({
                  variables: {
                    email: searchValue,
                    topicId: topicId
                  }
                })
                  .then((res) => {
                    console.log(res)
                    // refetch()
                  })
                  .catch((err) => {
                    console.log(err.message)
                  })
              }
            }
          }}
        >
          {`Add ${type}`}
        </div>
      </div>
      {
        type === 'user' && (
          <div
            style={{
              fontSize: '2vh',
              color: 'white',
              backgroundColor: 'red',
              padding: '8px',
              margin: '10px',
              marginTop: '15px',
              display: 'flex',
              justifyContent: 'center',
              fontWeight: '500',
              borderRadius: '10px'
            }}
            onClick={() => {
              // console.log(uuid.fromString('the native web'))
              // const uuidTopicId = uuid.fromString(topicId)
              // console.log(uuidTopicId)
              console.log('CLICK ALL ALLOWED!!')
              deleteTopicUser({
                variables: {
                  topicId: topicId
                }
              })
                .then((res) => {
                  console.log(res)
                  refetch()
                })
                .catch((err) => {
                  console.log(err.message)
                })
            }}
          >
            Allow anyone with a link to tackle topic
          </div>
        )
      }
      <div style={{ color: 'white', minHeight: '20vh', maxHeight: '60vh', fontWeight: '500', fontSize: '3vh' }}>
        {`Allowed ${type}s:`}
        {
          type === 'user' && allowedUsers.map((user, i) => (
            <div
              key={i.toString()}
              style={{
                fontWeight: '500',
                fontSize: '2.5vh',
                borderRadius: '10px',
                margin: '10px',
                backgroundColor: 'white',
                padding: '5px',
                color: 'black',
                border: '2px solid green',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <div>{user.email}</div>
              {/* <div>{typeof user.topic_id}</div> */}
              <div
                style={{ fontSize: '2vh', color: 'white', paddingLeft: '10px', paddingRight: '10px', borderRadius: '10px', backgroundColor: 'red' }}
                onClick={() => {
                  updateTopicUser({
                    variables: {
                      email: user.email,
                      isAllowed: false
                    }
                  })
                    .then((res) => {
                    // console.log(res)
                      refetch()
                    })
                    .catch((err) => {
                      console.log(err.message)
                    })
                }}
              >
                ban
              </div>
            </div>
          ))
        }
      </div>
      <div style={{ color: 'white', minHeight: '40vh', maxHeight: '60vh', fontWeight: '500', fontSize: '3vh' }}>
        {`Banned ${type}s:`}
        {
          type === 'user' && notAllowedUsers.map((user, i) => {
            return (
              <div
                key={i.toString()}
                style={{
                  fontWeight: '500',
                  fontSize: '2.5vh',
                  borderRadius: '10px',
                  margin: '10px',
                  backgroundColor: 'white',
                  padding: '5px',
                  color: 'black',
                  border: '2px solid red',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                <div>{user.email}</div>
                <div
                  style={{ fontSize: '2vh', color: 'white', paddingLeft: '10px', paddingRight: '10px', borderRadius: '10px', backgroundColor: 'green' }}
                  onClick={() => {
                    updateTopicUser({
                      variables: {
                        email: user.email,
                        isAllowed: true
                      }
                    })
                      .then((res) => {
                      // console.log(res)
                        refetch()
                      })
                      .catch((err) => {
                        console.log(err.message)
                      })
                  }}
                >
                  allow
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default compose(
  withRouter,
  graphql(INSERT_TOPIC_USER, { name: 'insertTopicUser' }),
  graphql(INSERT_TOPIC_ADMIN, { name: 'insertTopicAdmin' }),
  graphql(UPDATE_TOPIC_USER, { name: 'updateTopicUser' }),
  graphql(DELETE_TOPIC_USER, { name: 'deleteTopicUser' })
)(AddingUsers)
