import React from 'react'
import styled from 'styled-components'
import { Input, ListGroup, ListGroupItem, Button } from 'reactstrap'
// import Icon from '../../components/Icon'

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
}) => (
  <Wrapper>
    <TopicInfoWrapper>
      <Title>Topic Title</Title>
      <AverageScore>80</AverageScore>
      <AverageScoreText>Average Score</AverageScoreText>
      <StatisticsWrapper>
        <StatisticsContainer>
          <StatisticText>
            <StatisticalData>90</StatisticalData>
            <Label>Users took the exam</Label>
          </StatisticText>
        </StatisticsContainer>
        <StatisticsContainer>
          <StatisticText>
            <StatisticalData>90%</StatisticalData>
            <Label>Users finished answering</Label>
          </StatisticText>
        </StatisticsContainer>
        <StatisticsContainer>
          <StatisticText>
            <StatisticalData>90%</StatisticalData>
            <Label>exceeded from 50%</Label>
          </StatisticText>
        </StatisticsContainer>
      </StatisticsWrapper>
    </TopicInfoWrapper>
    <TableWrapper>
      <Leaderboard>Leaderboard</Leaderboard>
      <Search type='text' name='search' id='search' placeholder='Search user...' />
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
                {/* <Avatar name='user' /> */}
                <Name>{user.name}</Name>
                <NumberOfItemsAnswered>45 items answered</NumberOfItemsAnswered>
                <NumberOfItemsAnswered>out of 50</NumberOfItemsAnswered>
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
  height: 55%;
  width: 100%;
`

const StatisticsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  textalign: center;
  margin-top: 10;
`

const Search = styled(Input)``

const UserWrapper = styled.div`
  justify-content: space-between;
  float: left;
  vertical-align: center;
`

// const Avatar = styled(Icon)`
//   width: 200px;
//   font-size: 300px;
//   background-size: 100% 100%;
// `

const Leaderboard = styled.div`
  font-weight: bold;
  text-align: center;
  margin: 5px;
`

const Rank = styled.div`
  font-weight: bold;
  float: left;
  clear: right;
  font-size: 50px;
  margin-right: 15px;
  justify-content: space-between;
`

const Name = styled.div`
  font-size: 20px;
  font-weight: bold;
`

const Score = styled.div`
  font-size: 20px;
  width: 20%
  font-weight: bold;
  float: right;
  vertical-align: center;
`

const NumberOfItemsAnswered = styled.div`
  font-size: 12px;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  justify-content: center;
  display: flex;
`

const Title = styled.div`
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 3vh;
`

const AverageScoreText = styled.div`
  color: #ffffff;
  font-size: 15px;
  text-align: center;
  justify-content: center;
  margin-bottom: 1vh;
`

const StatisticsContainer = styled.div`
  padding: 10px;
  width: 50%;
  text-align: center;
  margin-top: 5vh;
  margin-bottom: 5vh;
`

const StatisticalData = styled.div`
  color: #ffffff;
  font-size: 18px;
`

const Label = styled.div`
  font-size: 12px;
`

const StatisticText = styled.div`
  color: #ffffff;
  font-size: 12px;
  display: inline;
  text-align: center;
  justify-content: center;
`

const AverageScore = styled.div`
  text-align: center;
  justify-content: center;
  color: #ffffff;
  font-size: 60px;
`

const TopicInfoWrapper = styled.div`
  margin-bottom: 40
  background-color:  'red'
`

const TableWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 20px 20px 0px 0px;
  width: 100%;
  height: 50vh;
  position: absolute;
  justify-content: center;
  bottom: 0;
  margin: 5;
  padding: 5px;
`

export default Analytics
