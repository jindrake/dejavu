import React, { useState } from 'react'
import { FullPageLoader, Button, HeaderText } from '../../components'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { withRouter } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useStateValue, getObjectValue, emailRegex } from '../../libs'
import {
  FETCH_TOPIC_WITH_USERS,
  UPDATE_TOPIC,
  INSERT_TOPIC_USER,
  DELETE_TOPIC_USER,
  DELETE_ALL_TOPIC_USERS
} from './queries'
import { Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

// user
const UPDATE_TOPIC_USER = gql`
  mutation updateTopicUser($email: String, $isAllowed: Boolean!) {
    update_topic_user(where: { email: { _eq: $email } }, _set: { is_allowed: $isAllowed }) {
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

const ManageUsers = ({
  history,
  match: {
    params: { id }
  }
}) => {
  const [, globalDispatch] = useStateValue()
  const { loading, error, data, refetch } = useQuery(FETCH_TOPIC_WITH_USERS, {
    skip: !id,
    variables: {
      id
    }
  })
  const [updateTopic, { loading: updateTopicLoading, error: updateTopicError }] = useMutation(
    UPDATE_TOPIC
  )
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState(false)
  const [whitelistUser, { loading: whitelistLoading, error: whitelistError }] = useMutation(
    INSERT_TOPIC_USER
  )
  const [
    deleteTopicUser,
    { loading: deleteTopicUserLoading, error: deleteTopicUserError }
  ] = useMutation(DELETE_TOPIC_USER)
  const [
    deleteAllTopicUsers,
    { loading: deleteAllTopicUsersLoading, error: deleteAllTopicUsersError }
  ] = useMutation(DELETE_ALL_TOPIC_USERS)

  if (
    loading ||
    updateTopicLoading ||
    whitelistLoading ||
    deleteTopicUserLoading ||
    deleteAllTopicUsersLoading
  ) {
    return <FullPageLoader />
  }
  const componentError =
    error || updateTopicError || whitelistError || deleteTopicUserError || deleteAllTopicUsersError
  if (componentError) {
    console.error('error@search:1')
    globalDispatch({
      networkError: componentError.message
    })
    return null
  }
  console.log(data)
  const topic = getObjectValue(data, 'topic[0]')

  return (
    <div className='h-100'>
      <div className='d-flex'>
        <Button text='Go back' onClick={() => history.goBack()} />
      </div>
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
            Adding emails to the topic's <strong>allowed list</strong> will make the topic exclusive
            to the emails included in the list.
          </div>
          <InputGroup>
            <Input
              invalid={!!inputError}
              value={inputValue}
              type='email'
              placeholder='User Email'
              onChange={(e) => {
                setInputValue(e.target.value)
              }}
            />
            <InputGroupAddon addonType='append'>
              <Button
                text='Add'
                className='h3'
                onClick={async () => {
                  if (emailRegex.test(inputValue)) {
                    await whitelistUser({
                      variables: {
                        topicUser: {
                          topic_id: id,
                          email: inputValue
                        }
                      }
                    })
                    await refetch()
                    setInputValue('')
                    setInputError(false)
                  } else {
                    setInputError(true)
                  }
                }}
              />
            </InputGroupAddon>
          </InputGroup>
          <hr />
          <div className='px-3'>
            {topic.users.map((user, index) => (
              <div className='d-flex justify-content-between' key={index}>
                {user.email}
                <FontAwesomeIcon
                  icon={faTimes}
                  className='mt-2 text-warning'
                  onClick={async () => {
                    await deleteTopicUser({
                      variables: {
                        topicId: id,
                        email: user.email
                      }
                    })
                    await refetch()
                    globalDispatch({
                      operationSuccess: 'User removed from whitelist'
                    })
                  }}
                />
              </div>
            ))}
          </div>
          {topic.users && topic.users.length ? (
            <>
              <Button
                text='Clear whitelist'
                className='mt-3'
                onClick={async () => {
                  await deleteAllTopicUsers({
                    variables: {
                      topicId: id
                    }
                  })
                  await refetch()
                }}
              />
              <div className='p-2'>
                Clearing the whitelist will allow anyone access to the private topic via url
              </div>
            </>
          ) : null}
        </div>
      )}
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
)(ManageUsers)
