import React from 'react'
import styled from 'styled-components'

import TopicPreview from './TopicPreview'

const Section = ({ title, topics }) => (
  <Wrapper>
    <Title>{title}</Title>
    <TopicsContainer><Belt>{
      topics.map((topic) => (
        <TopicPreview {...topic} />
      ))
    }</Belt></TopicsContainer>
  </Wrapper>
)

const Belt = styled.div`
  position: absolute;
  height: 100%;
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
  color: #C5CAE9;
  font-size: 12px;
  margin-bottom: 10px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  height: 40%;
`

export default Section
