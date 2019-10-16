import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import uuid from 'uuid/v4'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { INSERT_USER_ACTIVITY } from './queries'
import { Icon, HomeCardWrapper } from '../../components'

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
    <HomeCardWrapper
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
      <div>{name}</div>
      <div>{description}</div>
      <div>
        {topic.target_fields && topic.target_fields.length && topic.target_fields.map(({ field }, index) => (
          <div key={index}>{field}</div>
        ))}
      </div>
      <div>{date.toDateString()}</div>
      <div>
        <div>
          <StyledIcon name='thumb_up' />&nbsp;
          {ratings.length > 0 ? ratings.filter((r) => r.type === 'upvote').length : 0}
        </div>
        <div>
          <StyledIcon name='thumb_down' />&nbsp;
          {ratings.length > 0 ? ratings.filter((r) => r.type === 'downvote').length : 0}
        </div>
      </div>
    </HomeCardWrapper>
  )
}

const StyledIcon = styled(Icon)`
  width: 100%;
  justify-content: right;
  color: #ffffff;
`

// const Wrapper = styled.div`
//   background: linear-gradient(#e8eaf6, #c5cae9);
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   width: 200px;
//   padding: 20px;
//   margin-left: 20px;
//   &:first-child {
//     margin-left: 40px;
//   }
//   &:last-child {
//     margin-right: 40px;
//   }
//   border-radius: 6px;
//   box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
//   animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
//   animation-delay: ${({ n }) => n * 100 + 'ms'};
// `

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(TopicPreview)
