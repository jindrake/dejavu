import React, { useState } from 'react'
import { FullPageLoader, HeaderText, StyledInput, ContentCenter } from '../../components'
import compose from 'recompose/compose'
import { withRouter } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useStateValue, getObjectValue, emailRegex } from '../../libs'
import { FETCH_TOPIC_WITH_ADMINS, INSERT_TOPIC_ADMIN, DELETE_TOPIC_ADMIN } from './queries'
import { InputGroup, InputGroupAddon, Button, Label } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const ManageAdmins = ({
  history,
  match: {
    params: { id }
  }
}) => {
  const [, globalDispatch] = useStateValue()
  const { loading, error, data, refetch } = useQuery(FETCH_TOPIC_WITH_ADMINS, {
    skip: !id,
    variables: {
      id
    }
  })
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState(false)
  const [addAdmin, { loading: addAdminLoading, error: addAdminError }] = useMutation(
    INSERT_TOPIC_ADMIN
  )
  const [
    deleteTopicAdmin,
    { loading: deleteTopicAdminLoading, error: deleteTopicAdminError }
  ] = useMutation(DELETE_TOPIC_ADMIN)

  if (loading || addAdminLoading || deleteTopicAdminLoading) {
    return <FullPageLoader />
  }
  const componentError = error || addAdminError || deleteTopicAdminError
  if (componentError) {
    console.error('error@manageadmins:1')
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
        <HeaderText className='mt-3'>Manage admins for {topic.name}</HeaderText>
      </ContentCenter>
      <hr />
      <div>
        <Label>Add admins by email address</Label>
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
              color='link'
              onClick={async () => {
                if (emailRegex.test(inputValue)) {
                  await addAdmin({
                    variables: {
                      topicId: id,
                      email: inputValue
                    }
                  })
                  await refetch()
                  setInputValue('')
                  setInputError(false)
                  globalDispatch({
                    operationSuccess: 'Admin added to ' + topic.name
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
          {topic.admins.map((adminObject, index) => (
            <div className='d-flex justify-content-between' key={index}>
              {adminObject.user.email}
              <FontAwesomeIcon
                icon={faTimes}
                className='mt-2 text-warning'
                onClick={async () => {
                  await deleteTopicAdmin({
                    variables: {
                      topicId: id,
                      userId: adminObject.user_id
                    }
                  })
                  await refetch()
                  globalDispatch({
                    operationSuccess: 'Admin removed from ' + topic.name
                  })
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default compose(withRouter)(ManageAdmins)
