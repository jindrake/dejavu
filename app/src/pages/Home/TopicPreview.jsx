import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import uuid from 'uuid/v4'
import { compose, graphql } from 'react-apollo'

import { INSERT_USER_ACTIVITY } from './queries'

const TopicPreview = ({ n, creator, id, name, history, insertUserActivity }) => (
  <Wrapper
    n={n}
    onClick={() => {
      insertUserActivity({
        variables: {
          userActivity: {
            id: uuid(),
            activity_type: 'view',
            user_id: creator.id,
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
      history.push(`topic/${id}`)
    }}
  >
    <Author>{`${creator.first_name} ${creator.last_name}`}</Author>
    <Title>{name}</Title>
  </Wrapper>
)

const Title = styled.div`
  color: #1A237E;
  font-size: 20px;d A
  line-height: 20px;
  font-weight: 700;
  max-height: 60%;
  overflow-y: scroll;
`

const Author = styled.div`
  color: #1A237E;
  font-size: 12px;
  opacity: 0.8;
  line-height: 12px;
  margin-bottom: 6px
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
  };
  &:last-child {
    margin-right: 40px;
  };
  border-radius: 6px;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  animation-delay: ${({ n }) => (n) * 100 + 'ms'};
`

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(TopicPreview)
