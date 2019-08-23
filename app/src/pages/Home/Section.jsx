import React from 'react'
import styled from 'styled-components'

import TopicPreview from './TopicPreview'

const Section = ({ user, title, topics = [] }) => (
  <Wrapper>
    <Title>{title}</Title>
    <TopicsContainer>
      <Belt>
        {topics.map((topic, index) => (
          <TopicPreview key={index} n={index} topic={topic} user={user} />
        ))}
      </Belt>
    </TopicsContainer>
  </Wrapper>
)

const Belt = styled.div`
  position: absolute;
  top: 6px;
  bottom: 6px;
  display: flex;
`

const TopicsContainer = styled.div`
  position: relative;
  overflow-x: scroll;
  height: 100%;
  margin-left: -40px;
  margin-right: -40px;
`

const Title = styled.div`
  color: #c5cae9;
  font-size: 12px;
  margin-bottom: 4px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  height: 80%;
`

export default Section
