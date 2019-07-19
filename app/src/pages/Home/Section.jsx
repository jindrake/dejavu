import React from 'react'
import styled from 'styled-components'

import TopicPreview from './TopicPreview'

const Section = ({ title, data }) => (
  <Wrapper>
    <Title>{title}</Title>
    <TopicsContainer><Belt>{
      data.topic.map((topic, index) => (
        <TopicPreview key={index} n={index} topic={topic} />
      ))
    }</Belt></TopicsContainer>
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
  color: #C5CAE9;
  font-size: 12px;
  margin-bottom: 4px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  height: 35%;
`

export default Section
