import React, { useState } from 'react'
import { FullPageLoader, Button, HeaderText, ContentAround } from '../../components'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { withRouter } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useStateValue, getObjectValue } from '../../libs'
import { FETCH_TOPIC_WITH_USERS, UPDATE_TOPIC } from './queries'
import { Input } from 'reactstrap'

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
    update_topic_user(where: { email: { _eq: $email } }, _set: { is_allowed: $isAllowed }) {
      affected_rows
    }
  }
`

const DELETE_TOPIC_USER = gql`
  mutation deleteTopicUser($topicId: uuid!) {
    delete_topic_user(where: { topic_id: { _eq: $topicId } }) {
      affected_rows
    }
  }
`
// admin
const INSERT_TOPIC_ADMIN = gql`
  mutation insertTopicAdmin($email: String, $topicId: ID!) {
    add_admin_by_email(email: $email, topicId: $topicId)
  }
`

const DELETE_TOPIC_ADMIN = gql`
  mutation deleteTopicAdmin($topicAdminId: uuid!) {
    delete_admin_topic(where: { id: { _eq: $topicAdminId } }) {
      affected_rows
    }
  }
`

// const FETCH_TOPIC_ADMIN = gql`
//   query fetchTopicAdmin {
//     admin_topic {
//       id
//       user {
//         email
//         first_name
//         last_name
//       }
//     }
//   }
// `

const AddingUsers = ({
  // deleteTopicUser,
  // updateTopicUser,
  history,
  // deleteTopicAdmin,
  // location,
  // insertTopicUser,
  // insertTopicAdmin,
  match: {
    params: { id }
  }
}) => {
  // const [searchValue, setSearchValue] = useState('')
  const [, globalDispatch] = useStateValue()
  const [copySuccess, setCopySuccess] = useState(false)

  // const { loading, error, data, refetch } = useQuery(FETCH_TOPIC_USER)
  // const {
  //   loading: adminTopicLoading,
  //   error: adminTopicError,
  //   data: adminTopicData,
  //   refetch: adminTopicRefetch
  // } = useQuery(FETCH_TOPIC_ADMIN)
  const { loading, error, data, refetch } = useQuery(FETCH_TOPIC_WITH_USERS, {
    skip: !id,
    variables: {
      id
    }
  })

  const [updateTopic, { loading: updateTopicLoading, error: updateTopicError }] = useMutation(
    UPDATE_TOPIC
  )

  if (loading || updateTopicLoading) return <FullPageLoader />
  if (error) {
    console.error('error@search:1')
    globalDispatch({
      networkError: error.message
    })
    return null
  }
  if (updateTopicError) {
    console.error('error@manageusers2')
    globalDispatch({
      networkError: updateTopicError.message
    })
  }
  console.log(data)
  const topic = getObjectValue(data, 'topic[0]')
  // if (adminTopicLoading) return <FullPageLoader />
  // if (adminTopicError) {
  //   console.error('error@search:1')
  //   globalDispatch({
  //     networkError: error.message
  //   })
  //   return null
  // }

  // console.log('DATA', data)
  // console.log('ADMIN TOPIC', adminTopicData)
  // const notAllowedUsers =
  //   data.topic_user && data.topic_user.filter((user) => user.is_allowed === false)
  // const allowedUsers = data.topic_user && data.topic_user.filter((user) => user.is_allowed === true)

  return (
    <div className='h-100'>
      <div className='d-flex'>
        <Button text='Go back' onClick={() => history.goBack()} />
      </div>
      {/* <div style={{ color: 'white', fontWeight: '600', fontSize: '3vh' }}>
        {type === 'user' ? `Manage Users for: ${topicName}` : `Manage Admins for: ${topicName}`}
      </div> */}
      <HeaderText className='mt-3'>Manage allowed users for {topic.name}</HeaderText>
      <hr />
      {!topic.is_private ? (
        <div className='d-flex justify-content-between flex-column'>
          <div className='p'>
            This topic is currently <strong>Public</strong>. Every user can tackle it. Do you want
            to limit it to a specific set of users?
          </div>
          <Button
            text='Make Private'
            type='warning'
            className='p-3 mt-3'
            onClick={async () => {
              await updateTopic({
                variables: {
                  id: id,
                  topic: {
                    is_published: !topic.is_published
                  }
                }
              })
              await refetch()
            }}
          />
        </div>
      ) : (
        <div>
          <div className='p-2'>
            <strong>Private</strong> topic. Anyone with the link below will be able to access it
          </div>
          <Input disabled value={`${process.env.REACT_APP_URL}/topic/${id}`} className='mb-2' />
          <ContentAround>
            <Button
              text={copySuccess ? 'Copied!' : 'Copy'}
              type={copySuccess ? 'success' : ''}
              onClick={() => {
                navigator.clipboard.writeText(`${process.env.REACT_APP_URL}/topic/${id}`)
                setCopySuccess(true)
              }}
            />
            {typeof navigator.share !== 'undefined' && (
              <Button
                text='Share'
                onClick={(event) => {
                  event.preventDefault()
                  navigator.share({
                    title: 'Share Topic',
                    url: process.env.REACT_APP_URL + '/topic/' + id
                  })
                }}
              />
            )}
          </ContentAround>
        </div>
      )}
      {/* <div
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
                if (!/(.)+@(\w)+.com/.test(searchValue)) {
                  globalDispatch({
                    networkError: 'Invalid input for email.'
                  })
                } else {
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
                }
              } else {
                // console.log('add admin!')
                console.log(/(.)+@(\w)+.com/.test(searchValue))
                if (!/(.)+@(\w)+.com/.test(searchValue)) {
                  globalDispatch({
                    networkError: 'Invalid input for email.'
                  })
                } else {
                  insertTopicAdmin({
                    variables: {
                      email: searchValue,
                      topicId: topicId
                    }
                  })
                    .then((res) => {
                      console.log(res)
                      adminTopicRefetch()
                      // refetch()
                    })
                    .catch((err) => {
                      console.log(err.message)
                      globalDispatch({
                        networkError: err.message.substring(14)
                      })
                    })
                }
              }
            }
          }}
        >
          {`Add ${type}`}
        </div>
      </div>
      {type === 'user' && (
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
            // console.log('CLICK ALL ALLOWED!!')
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
      )}
      {type === 'user' ? (
        <div>
          <div
            style={{
              color: 'white',
              minHeight: '20vh',
              maxHeight: '60vh',
              fontWeight: '500',
              fontSize: '3vh'
            }}
          >
            {`Allowed ${type}s:`}
            {type === 'user' &&
              allowedUsers.map((user, i) => (
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
                  <div
                    style={{
                      fontSize: '2vh',
                      color: 'white',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      borderRadius: '10px',
                      backgroundColor: 'red'
                    }}
                    onClick={() => {
                      updateTopicUser({
                        variables: {
                          email: user.email,
                          isAllowed: false
                        }
                      })
                        .then((res) => {
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
              ))}
          </div>
          <div
            style={{
              color: 'white',
              minHeight: '40vh',
              maxHeight: '60vh',
              fontWeight: '500',
              fontSize: '3vh'
            }}
          >
            {`Banned ${type}s:`}
            {type === 'user' &&
              notAllowedUsers.map((user, i) => {
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
                      style={{
                        fontSize: '2vh',
                        color: 'white',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        borderRadius: '10px',
                        backgroundColor: 'green'
                      }}
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
              })}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '10px', color: 'white', fontWeight: '500', fontSize: '3vh' }}>
          Admin List:
          {adminTopicData.admin_topic &&
            adminTopicData.admin_topic.map((tAdmin) => {
              return (
                <div
                  key={tAdmin.id}
                  style={{
                    fontWeight: '500',
                    fontSize: '2.5vh',
                    borderRadius: '10px',
                    margin: '10px',
                    backgroundColor: 'white',
                    padding: '10px',
                    color: 'black',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>Email: {tAdmin.user.email}</div>
                    <div>
                      Name: {tAdmin.user.first_name} {tAdmin.user.last_name}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '2vh',
                      color: 'white',
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      borderRadius: '10px',
                      backgroundColor: 'red'
                    }}
                    onClick={() => {
                      deleteTopicAdmin({
                        variables: {
                          topicAdminId: tAdmin.id
                        }
                      })
                        .then((res) => {
                          console.log(res)
                          adminTopicRefetch()
                        })
                        .catch((err) => {
                          console.log(err.message)
                        })
                    }}
                  >
                    remove
                  </div>
                </div>
              )
            })}
        </div>
      )}
     */}
    </div>
  )
}

export default compose(
  withRouter,
  graphql(INSERT_TOPIC_USER, { name: 'insertTopicUser' }),
  graphql(INSERT_TOPIC_ADMIN, { name: 'insertTopicAdmin' }),
  graphql(UPDATE_TOPIC_USER, { name: 'updateTopicUser' }),
  graphql(DELETE_TOPIC_USER, { name: 'deleteTopicUser' }),
  graphql(DELETE_TOPIC_ADMIN, { name: 'deleteTopicAdmin' })
)(AddingUsers)
