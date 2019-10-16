import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { DejavuCard, FullPageLoader } from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import gql from 'graphql-tag'
import { useStateValue } from '../../libs'
import { Button } from 'reactstrap'

const FETCH_TOPIC_TAKERS = gql`
  query fetchTopicTakers ($id: ID) {
    get_topic_takers_count(topicId: $id)
  }
`

const TopicManagementCard = ({ topic, history }) => {
  const [, globalDispatch] = useStateValue()
  const { data, loading, error } = useQuery(FETCH_TOPIC_TAKERS, {
    skip: !topic,
    variables: {
      id: topic.id
    }
  })

  if (error) {
    globalDispatch({
      networkError: error.message
    })
    return null
  }

  if (loading) {
    return <FullPageLoader />
  }

  console.log(data)

  return (
    <DejavuCard className='justify-content-between flex-column mb-2'>
      <div>
        <div className='font-weight-bold'>{topic.name}</div>
        <div>
          <small>{topic.description}</small>
        </div>
        <div className='small w-100 d-flex justify-content-between'>
          <div className='pt-2'>
            {data.get_topic_takers_count} takers
          </div>
          <span className='d-flex text-center justify-content-evenly'>
            <div>
              <FontAwesomeIcon icon={faThumbsDown} />{' '}
              {topic.ratings.length > 0
                ? topic.ratings.filter((r) => r.type === 'downvote').length
                : 0}
              &nbsp;&nbsp;
              <FontAwesomeIcon icon={faThumbsUp} />{' '}
              {topic.ratings.length > 0
                ? topic.ratings.filter((r) => r.type === 'upvote').length
                : 0}
              <Button
                color='link'
                onClick={() => {
                  history.push(`/topic/${topic.id}/manage`)
                }}
              >
                MANAGE
              </Button>
            </div>
          </span>
        </div>
      </div>
    </DejavuCard>
  )
}

export default TopicManagementCard
