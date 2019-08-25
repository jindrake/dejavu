import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import uuid from 'uuid/v4'
import { compose, graphql } from 'react-apollo'

import { INSERT_USER_ACTIVITY } from './queries'

const TopicPreview = ({ n, user, topic, history, insertUserActivity }) => {
  const {
    /* eslint-disable camelcase */
    created_at: createdAt,
    id,
    name
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
            .then((res) => {
              console.log(res)
            })
            .catch((err) => {
              console.log(err.message)
            })
        }
        history.push(`topic/${id}`)
      }}
    >
      <Title>{name}</Title>
      <Author>{date.toDateString()}</Author>
    </Wrapper>
  )
}

const Title = styled.div`
  font-size: 17px;
  color: #DDDCDC
`

const Author = styled.div`
  color: #A9A9A9
  font-size: 10px;
`

const Wrapper = styled.div`
  flex-direction: column;
  justify-content: left;
  width: 100%;
  margin-left: 40px;
`

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(TopicPreview)
