import React from 'react'
import styled from 'styled-components'

import TopicPreview from './TopicPreview'

const RecentTopics = ({ user, title, topics = [] }) => (
  <Wrapper>
    <Title>{title}</Title>
    {topics.map((topic, index) => (
      <TopicsContainer>
        <TopicPreview key={index} n={index} topic={topic} user={user} />
      </TopicsContainer>
    ))}
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  height: 20%;
`

const Title = styled.div`
  color: #c5cae9;
  font-size: 12px;
  margin-bottom: 4px;
`

const TopicsContainer = styled.div`
  width: 100%;
  overflow-x: scroll;
  height: 100%;
  margin-left: -40px;
  margin-right: -40px;
  margin-bottom: 2vh;
`

export default RecentTopics
