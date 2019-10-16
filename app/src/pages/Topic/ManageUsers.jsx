import React, { useState } from 'react'
import { FullPageLoader, HeaderText, ContentCenter, StyledInput } from '../../components'
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
import { InputGroup, Button, InputGroupAddon, Label } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

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
    deleteTopicUserLoading ||
    deleteAllTopicUsersLoading ||
    whitelistLoading
  ) {
    return <FullPageLoader />
  }
  const componentError =
    error || updateTopicError || whitelistError || deleteTopicUserError || deleteAllTopicUsersError
  if (componentError) {
    console.error('error@manageusers:1')
    globalDispatch({
      networkError: componentError.message
    })
    return null
  }
  console.log(data)
  const topic = getObjectValue(data, 'topic[0]')

  return (
    <div className='h-100'>
      <div>
        <FontAwesomeIcon icon={faArrowLeft} onClick={() => history.goBack()} />
      </div>
      <ContentCenter>
        <HeaderText>Manage allowed users for {topic.name}</HeaderText>
      </ContentCenter>
      <hr />
      {!topic.is_private ? (
        <div className='d-flex justify-content-between flex-column'>
          <Label>
            This topic is currently <strong>Public</strong>. Every user can tackle it. Do you want
            to limit it to a specific set of users?
          </Label>
          <Button
            color='warning'
            size='lg'
            onClick={async () => {
              await updateTopic({
                variables: {
                  id: id,
                  topic: {
                    is_private: !topic.is_private
                  }
                }
              })
              await refetch()
            }}
          >
            Make Private
          </Button>
        </div>
      ) : (
        <div className='h-100 d-flex flex-column'>
          <div>
            <Label>
              Adding emails to the topic's <strong>allowed list</strong> will make the topic
              exclusive to the emails included in the list.
            </Label>
            <InputGroup>
              <StyledInput
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
                  className=''
                  color='link'
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
                      globalDispatch({
                        operationSuccess: 'Whitelisted email'
                      })
                    } else {
                      setInputError(true)
                    }
                  }}
                >
                  ADD
                </Button>
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
          </div>
          {topic.users && topic.users.length ? (
            <div>
              <Button
                className='mt-3 w-100'
                color='warning'
                size='lg'
                onClick={async (e) => {
                  e.preventDefault()
                  await deleteAllTopicUsers({
                    variables: {
                      topicId: id
                    }
                  })
                  await refetch()
                  globalDispatch({
                    operationSuccess: 'Cleared whitelist'
                  })
                }}
              >
                Clear whitelist
              </Button>
              <Label>
                Clearing the whitelist will allow anyone access to the private topic via url
              </Label>
            </div>
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
