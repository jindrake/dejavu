import React from 'react'
import styled from 'styled-components'

const TopicPreview = ({ author, title }) => (
  <Wrapper>
    <Author>{author}</Author>
    <Title>{title}</Title>
  </Wrapper>
)

const Title = styled.div`
  color: #1A237E;
  font-size: 20px;
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
  background: #E8EAF6;
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
  margin-bottom: 6px;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
`

export default TopicPreview
