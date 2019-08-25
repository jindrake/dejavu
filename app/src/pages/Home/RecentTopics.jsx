import React from 'react'
import styled from 'styled-components'

import RecentTopicPreview from './RecentTopicPreview'

const RecentTopics = ({ user, title, topics = [] }) => (
  <Wrapper>
    <Title>{title}</Title>
    <ContentWrapper>
      {topics.map((topic, index) => (
        <TopicsContainer>
          <RecentTopicPreview key={index} n={index} topic={topic} user={user} />
        </TopicsContainer>
      ))}
    </ContentWrapper>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 4vh;
  height: 50%;
`
const Title = styled.div`
  color: #c5cae9;
  font-size: 12px;
  margin-bottom: 5px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
`

const TopicsContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-left: -40px;
  margin-right: -40px;
  margin-bottom: 2vh;
`
// border-bottom: 2px solid #4B4B4B;

export default RecentTopics
