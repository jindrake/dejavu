import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import uuid from 'uuid/v4'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { INSERT_USER_ACTIVITY } from './queries'
import Icon from '../../components/Icon'

const TopicPreview = ({ n, user, topic, history, insertUserActivity }) => {
  const {
    /* eslint-disable camelcase */
    created_at: createdAt,
    id,
    name,
    ratings
  } = topic

  const date = new Date(createdAt)

  return (
    <Wrapper
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
      <Avatar name='account_circle' />
      <Content>
        <Title>{name}</Title>
        <Author>{date.toDateString()}</Author>
        <Ratings>
          <StyledIcon name='thumb_up' />
          {ratings.length > 0 ? ratings.filter((r) => r.type === 'upvote').length : 0}
        </Ratings>
        <Ratings>
          <StyledIcon name='thumb_down' />
          {ratings.length > 0 ? ratings.filter((r) => r.type === 'downvote').length : 0}
        </Ratings>
      </Content>
    </Wrapper>
  )
}

const Title = styled.div`
  color: #1a237e;
  font-size: 20px;
  line-height: 20px;
  font-weight: 700;
  max-height: 60%;
  overflow-y: scroll;
  margin-bottom: 6px;
`

const Author = styled.div`
  color: #1a237e;
  font-size: 12px;
  opacity: 0.8;
  line-height: 12px;
  margin-bottom: 6px;
`

const StyledIcon = styled(Icon)`
  width: 20%;
`

const Ratings = styled.div`
  color: #1a237e;
  font-size: 14px;
  opacity: 0.8;
  line-height: 12px;
  margin-bottom: 6px;
  margin-right: 7px;
`

const Wrapper = styled.div`
  background: linear-gradient(#e8eaf6, #c5cae9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 200px;
  padding: 20px;
  margin-left: 20px;
  &:first-child {
    margin-left: 40px;
  }
  &:last-child {
    margin-right: 40px;
  }
  border-radius: 6px;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  animation-delay: ${({ n }) => n * 100 + 'ms'};
`
const Avatar = styled(Icon)`
  float: right;
  width: 30%;
`

const Content = styled.div`
  margin-top: 8vh;
`

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(TopicPreview)
