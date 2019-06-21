import React from 'react'
import styled from 'styled-components'

import Icon from '../../components/Icon'

const TitleSection = ({
  upvotes,
  downvotes,
  author,
  title,
  tags,
  dateAdded,
  tacklersNumber,
  timeLimit
}) => (
  <Wrapper>
    <TopWrap>
      <Stat><Icon name='arrow_upward' />&nbsp;&nbsp;{upvotes - downvotes} upvotes</Stat>
    </TopWrap>
    <Title>{title}</Title>
    <StatsWrap>
      <Stat><Icon name='calendar_today' />&nbsp;&nbsp;{dateAdded}</Stat>
      <Stat><Icon name='account_circle' />&nbsp;&nbsp;{author}</Stat>
      <Stat><Icon name='timer' />&nbsp;&nbsp;{timeLimit}</Stat>
      <Stat><Icon name='people' />&nbsp;&nbsp;{tacklersNumber} people tackled this</Stat>
    </StatsWrap>
    <TagsWrap>{
      tags.map(tag => <Tag>{tag}</Tag>)
    }</TagsWrap>
  </Wrapper>
)

const Stat = styled.div`
  opacity: 0.8;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  margin-bottom: 2px;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background: #5C6BC0;
  color: #E8EAF6;
  padding-left: 10px;
  padding-right: 10px;
  margin-right: 6px;
  margin-top: 6px;
  height: 24px;
  display: flex;
  border-radius: 6px;
  align-items: center;
  font-size: 12px;
  float: left;
`

const StatsWrap = styled.div`
  height: 40%;
  font-size: 14px;
  display: flex;
  flex-direction: column;
`

const TagsWrap = styled.div`
  justify-self: flex-end;
  align-items: flex-end;
  height: 25%;
  overflow: scroll;
`

const Wrapper = styled.div`
  display: 'flex';
  height: 100%;
`

const Title = styled.div`
  color: #1A237E;
  font-size: 24px;
  line-height: 24px;
  font-weight: 700;
  height: 30%;
  display: flex;
  align-items: center;
  overflow-y: scroll;
`

const TopWrap = styled.div`
  font-size: 14px;
  height: 5%;
  display: flex;
  line-height: 14px;
`

export default TitleSection
