import React from 'react'
import styled from 'styled-components'
import { ListGroup, ListGroupItem, Button } from 'reactstrap'
import { Title, ContentCenter, StyledInput, SubText } from '../../components'

const users = [
  { name: 'Jethro', score: 50 },
  { name: 'Pymy', score: 20 },
  { name: 'Angel', score: 10 },
  { name: 'Nica', score: 70 },
  { name: 'Joel', score: 40 }
]

const Analytics = ({
  match: {
    params: { id }
  }
}) => (<Wrapper>
  <TopicInfoWrapper>
    <ContentCenter>
      <Title>Topic Title</Title>
    </ContentCenter>
    <ContentCenter>
      <Title>80</Title>
    </ContentCenter>
    <ContentCenter>
      <SubText>
      Average Score
      </SubText>
    </ContentCenter>
    <StatisticsWrapper>
      <StatisticsContainer>
        <StatisticText>
          <Title>90</Title>
          <SubText>Users took the exam</SubText>
        </StatisticText>
      </StatisticsContainer>
      <StatisticsContainer>
        <StatisticText>
          <Title>90%</Title>
          <SubText>Users finished answering</SubText>
        </StatisticText>
      </StatisticsContainer>
      <StatisticsContainer>
        <StatisticText>
          <Title>90%</Title>
          <SubText>exceeded from 50%</SubText>
        </StatisticText>
      </StatisticsContainer>
    </StatisticsWrapper>
  </TopicInfoWrapper>
  <TableWrapper>
    <ContentCenter>
      <Title>Leaderboard</Title>
    </ContentCenter>
    <StyledInput
      type='text'
      name='search'
      id='search'
      placeholder='Search user...'
    />
    <ButtonWrapper>
      <SortText>Sort by:</SortText>
      <StyledButton>Name</StyledButton>
      <StyledButton>Rank</StyledButton>
      <StyledButton>Items Answered</StyledButton>
    </ButtonWrapper>
    <ResultsWrapper>
      {users.map((user, index) => (
        <ListGroup>
          <ListGroupItem>
            <Rank>1</Rank>
            <Score>{user.score}</Score>
            <UserWrapper>
              <Title>{user.name}</Title>
              <SubText>45 items answered</SubText>
              <SubText>out of 50</SubText>
            </UserWrapper>
          </ListGroupItem>
        </ListGroup>
      ))}
    </ResultsWrapper>
  </TableWrapper>
</Wrapper>
)

const ButtonWrapper = styled.div`
  margin: 5px;
`

const SortText = styled.div`
  font-size: 12px;
  display: inline;
  color: #4d4d4d;
`

const StyledButton = styled(Button)`
  border-radius: 18px;
  margin: 2px;
  font-size: 10px;
  display: inline;
  padding: 8px;
  border: none;
  background: #d4d4d4;
  color: #4d4d4d;
`

const ResultsWrapper = styled.div`
  margin-bottom: 10px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: 70%;
  width: 100%;
`

const StatisticsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  textalign: center;
  margin-top: 10;
`

const UserWrapper = styled.div`
  justify-content: space-between;
  float: left;
  vertical-align: center;
`

const Rank = styled.div`
  font-weight: bold;
  float: left;
  clear: right;
  font-size: 50px;
  margin-right: 15px;
  justify-content: space-between;
`

const Score = styled.div`
  font-size: 20px;
  width: 20%
  font-weight: bold;
  float: right;
  vertical-align: center;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  justify-content: center;
  display: flex;
`

const StatisticsContainer = styled.div`
  padding: 10px;
  width: 50%;
  text-align: center;
  margin-top: 5vh;
  margin-bottom: 5vh;
`

const StatisticText = styled.div`
  color: #ffffff;
  font-size: 12px;
  display: inline;
  text-align: center;
  justify-content: center;
`

const TopicInfoWrapper = styled.div`

`

const TableWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 20px 20px 0px 0px;
  width: 100%;
  height: 80vh;
  position: absolute;
  justify-content: center;
  top: 40%;
  padding: 5px;
`

export default Analytics
