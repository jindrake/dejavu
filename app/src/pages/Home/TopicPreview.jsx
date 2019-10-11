import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import uuid from 'uuid/v4'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { INSERT_USER_ACTIVITY } from './queries'
import { CardWrapper, CardTitle, CardDescription } from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

const TopicPreview = ({ n, user, topic, history, insertUserActivity }) => {
  const {
    /* eslint-disable camelcase */
    created_at: createdAt,
    id,
    name,
    ratings,
    description
  } = topic

  const date = new Date(createdAt)

  return (
    <CardWrapper
      n={n}
      onClick={() => {
        if (user) {
          insertUserActivity({
            variables: {
              userActivity: {
                id: uuid(),
                activity_type: 'view',
                user_id: user.id,
                topic_id: id
              }
            }
          })
        }
        history.push(`topic/${id}`)
      }}
    >
      <CardTitle>{name}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <CardDescription>{date.toDateString()}</CardDescription>
      <div>
        {topic.target_fields && topic.target_fields.length && topic.target_fields.map(({ field }, index) => (
          <CardDescription key={index}>{field}</CardDescription>
        ))}
      </div>
      <Author
        className='mt-3 mb-3'
      >{date.toDateString()}</Author>
      <RatingContainer>
        <Ratings>
          <StyledIcon icon={faThumbsUp} />{'   '}
          {ratings.length > 0 ? ratings.filter((r) => r.type === 'upvote').length : 0}
        </Ratings>
        <Ratings>
          <StyledIcon icon={faThumbsDown} />{'   '}
          {ratings.length > 0 ? ratings.filter((r) => r.type === 'downvote').length : 0}
        </Ratings>
      </RatingContainer>
    </CardWrapper>
  )
}

const RatingContainer = styled.div`
  display: flex;
  width: 100%;
  position: absolute;
  bottom: 1vh;
`

const StyledIcon = styled(FontAwesomeIcon)`
  width: 100%;
  justify-content: right;
  color: #015249;
`

const Ratings = styled.div`
  color: #015249;
  font-size: 14px;
  opacity: 0.8;
  line-height: 12px;
  margin-bottom: 6px;
  margin-right: 7px;
  font-weight: 600;
`

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(TopicPreview)
