import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { FETCH_FULL_TOPIC, UPDATE_TOPIC } from './queries'
import { getObjectValue, useStateValue } from '../../libs'
import { FullPageLoader, ContentCenter, HeaderText } from '../../components'
import { Label, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

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
    <div className='h-100 overflow-y-scroll'>
      <div>
        <FontAwesomeIcon icon={faArrowLeft} onClick={() => history.goBack()} />
      </div>
      <ContentCenter>
        <HeaderText>Manage Topic</HeaderText>
      </ContentCenter>
      <Label>Title</Label>
      <br />
      <strong>{topic.name}</strong>
      <br />
      <Label>Description</Label>
      <p className='dejavu-small-text'>{topic.description}</p>
      <hr />
      <div className='d-flex flex-column overflow-y-scroll h-100'>
        <Button
          color='primary'
          className='mb-2 '
          size='lg'
          onClick={() => {
            history.push(`/topic/${id}/analytics`)
          }}
        >
          See results
        </Button>
        <Button
          color='primary'
          onClick={() => {
            history.push(`/topic/${id}/users`)
          }}
          className='mb-2 '
          size='lg'
        >
          List of allowed users
        </Button>
        <Button
          color='primary'
          className='mb-2 '
          size='lg'
          onClick={() => {
            history.push(`/topic/${id}/admins`)
          }}
        >
          Manage admins
        </Button>
        <Button
          color='primary'
          className='mb-2 '
          size='lg'
          onClick={() => {
            history.push(`/topic/${id}/edit`)
          }}
        >
          Edit details
        </Button>
        <Button
          color='primary'
          className='mb-2 '
          size='lg'
          onClick={() => {
            history.push(`/topic/${id}/questions`)
          }}
        >
          Edit questions
        </Button>
        {/* <Button text='Edit target fields' className='mb-2 ' /> */}
        <hr />
        <Button
          className='mb-2 '
          size='lg'
          color={topic.is_published ? 'warning' : 'success'}
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
        >
          {topic.is_published ? 'Unpublish' : 'Publish'}
        </Button>
        <Button
          className='mb-2 '
          size='lg'
          color={topic.is_private ? 'success' : 'warning'}
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
          {topic.is_private ? 'Make public' : 'Make private'}
        </Button>
      </div>
    </div>
  )
}

export default ManageTopic
