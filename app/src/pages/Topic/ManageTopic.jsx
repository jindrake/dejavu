import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { FETCH_FULL_TOPIC, UPDATE_TOPIC } from './queries'
import { getObjectValue, useStateValue } from '../../libs'
import { FullPageLoader, HeaderText, ContentCenter, Button } from '../../components'
import { Badge } from 'reactstrap'

const ManageTopic = ({
  match: {
    params: { id }
  },
  history
}) => {
  const [, globalDispatch] = useStateValue()
  // fetchTopic
  const { data, loading, error, refetch } = useQuery(FETCH_FULL_TOPIC, {
    variables: {
      topicId: id
    }
  })

  const [updateTopic, { loading: updateTopicLoading, error: updateTopicError }] = useMutation(
    UPDATE_TOPIC
  )

  if (error) {
    console.error('error@managetopic:1')
    globalDispatch({
      networkError: error.message
    })
    return null
  }
  if (updateTopicError) {
    console.error('error@managetopic:2')
    globalDispatch({
      networkError: updateTopicError.message
    })
    return null
  }
  if (loading || updateTopicLoading) return <FullPageLoader />
  const topic = getObjectValue(data, 'topic[0]')
  console.log('Topic:', topic)
  return (
    <div className='mb-5'>
      <div className='d-flex'>
        <Button text='Go back' onClick={() => history.push('/profile')} />
      </div>
      <ContentCenter className='mt-3'>
        <HeaderText className='font-weight-bold'>Manage Topic</HeaderText>
      </ContentCenter>
      <small>
        Title: {topic.name}
        <br />
        Description: {topic.description}
      </small>
      <div>
        <small>Target fields:</small>
        <br />
        {topic.target_fields && topic.target_fields.length
          ? topic.target_fields.map((field, index) => {
            return (
              <Badge color='secondary' key={index} className='mx-3'>
                {field.field}
              </Badge>
            )
          })
          : null}
      </div>
      <hr />
      <Button text='See results' className='mb-2 p-4' />
      <Button
        text='List of allowed users'
        onClick={() => {
          history.push(`/topic/${id}/users`)
        }}
        className='mb-2 p-4'
      />
      <Button text='Manage admins' className='mb-2 p-4'
        onClick={() => {
          history.push(`/topic/${id}/admins`)
        }}
      />
      <Button text='Edit details' className='mb-2 p-4' />
      <Button text='Edit questions' className='mb-2 p-4' />
      <Button text='Edit target fields' className='mb-2 p-4' />
      <hr />
      <Button
        text={topic.is_published ? 'Unpublish' : 'Publish'}
        className='mb-2 p-4'
        type={topic.is_published ? 'warning' : 'success'}
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
      <Button
        text={topic.is_private ? 'Make public' : 'Make private'}
        className='mb-2 p-4'
        type={topic.is_private ? 'success' : 'warning'}
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
      />
    </div>
  )
}

export default ManageTopic
