import React from 'react'
import styled from 'styled-components'

import { Icon } from '../index'

const TitleSection = ({
  // upvotes,
  // downvotes,
  author,
  title,
  description,
  items
  // tags,
  // dateAdded,
  // tacklersNumber,
  // timeLimit
}) => (
  <Wrapper>
    <TopWrap>
      {/* <Stat><Icon name='arrow_upward' />&nbsp;&nbsp;{upvotes - downvotes} upvotes</Stat> */}
    </TopWrap>
    <Title>{title}</Title>
    <Description>Description: {description}</Description>
    <StatsWrap>
      {/* <Stat><Icon name='calendar_today' />{dateAdded}</Stat>
      <Stat><Icon name='account_circle' />{author}</Stat>
      <Stat><Icon name='timer' />{timeLimit}</Stat>
      <Stat><Icon name='people' />{tacklersNumber} people tackled this</Stat>
    </StatsWrap>
    <TagsWrap>{
      tags.map((tag, index) => <Tag key={index}>#{tag}</Tag>)
    }</TagsWrap> */}
      <Stat>
        <Icon name='account_circle' />
        &nbsp;&nbsp;{`${author.first_name} ${author.last_name}`}
      </Stat>
      <Stat>
        <Icon name='account_circle' />
        &nbsp;&nbsp;{`${author.email}`}
      </Stat>
      <Stat>{`${items} items`}</Stat>
    </StatsWrap>
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
  i {
    margin-right: 6px;
  }
`

// const Tag = styled.div`
//   background: #5C6BC0;
//   color: #E8EAF6;
//   padding-left: 10px;
//   padding-right: 10px;
//   margin-right: 6px;
//   margin-top: 6px;
//   height: 24px;
//   display: flex;
//   border-radius: 6px;
//   align-items: center;
//   font-size: 12px;
//   float: left;
// `

const StatsWrap = styled.div`
  height: 40%;
  font-size: 14px;
  display: flex;
  flex-direction: column;
`

// const TagsWrap = styled.div`
//   justify-self: flex-end;
//   align-items: flex-end;
//   height: 25%;
//   overflow: scroll;
// `

const Wrapper = styled.div`
  display: 'flex';
  height: 100%;
`

const Title = styled.div`
  color: #1a237e;
  font-size: 24px;
  line-height: 24px;
  font-weight: 700;
  height: 30%;
  display: flex;
  align-items: center;
  overflow-y: scroll;
`

const Description = styled.div`
  color: #1a237e;
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
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
