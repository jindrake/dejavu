import React, { useState } from 'react'
import styled from 'styled-components'
import { ListGroup, ListGroupItem, Button } from 'reactstrap'
import { Title, ContentCenter, StyledInput, SubText, FullPageLoader } from '../components'
import { useQuery } from '@apollo/react-hooks'
import { FETCH_TOPIC } from './Topic/queries'
import { useStateValue, getObjectValue } from '../libs'
import gql from 'graphql-tag'

const FETCH_TOPIC_ANALYTICS = gql`
  query fetchTopicAnalytics($id: ID) {
    get_topic_average_score(topicId: $id)
    get_topic_takers_count(topicId: $id)
    duo_takers: get_topic_tackle_type_count(topicId: $id, type: "duo")
    solo_takers: get_topic_tackle_type_count(topicId: $id, type: "solo")
    get_topic_comments_count(topicId: $id)
  }
`

const FETCH_TOPIC_RESULTS = gql`
  query fetchTopicResults($id: ID, $sortBy: String) {
    get_topic_rankings(topicId: $id, sortBy: $sortBy)
  }
`

const Analytics = ({
  match: {
    params: { id }
  }
}) => {
  const [, globalDispatch] = useStateValue()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('average')
  const { data: topicData, loading: topicLoading, error: topicError } = useQuery(FETCH_TOPIC, {
    skip: !id,
    variables: {
      id
    }
  })

  const { data: analyticsData, loading: analyticsLoading, error: analyticsError } = useQuery(
    FETCH_TOPIC_ANALYTICS,
    {
      skip: !id,
      variables: {
        id
      }
    }
  )

  const { data: resultsData, error: resultsError } = useQuery(
    FETCH_TOPIC_RESULTS,
    {
      skip: !id,
      variables: {
        id,
        sortBy
      }
    }
  )

  const componentError = topicError || analyticsError || resultsError
  if (componentError) {
    globalDispatch({
      networkError: componentError.message
    })
    return null
  }

  if (topicLoading || analyticsLoading) {
    return <FullPageLoader />
  }

  console.log(analyticsData)
  const topic = getObjectValue(topicData, 'topic[0]')
  const rankings = resultsData.get_topic_rankings ? JSON.parse(resultsData.get_topic_rankings) : []
  return (
    <Wrapper>
      <div className='mb-3'>
        <ContentCenter className='mt-5'>
          <Title className='text-capitalize'>{topic.name} Analytics</Title>
        </ContentCenter>
        <ContentCenter>
          <Title>{analyticsData.get_topic_average_score} %</Title>
        </ContentCenter>
        <ContentCenter>
          <SubText>Average Score</SubText>
        </ContentCenter>
        <StatisticsWrapper className='mb-3'>
          <StatisticsContainer>
            <StatisticText>
              <Title>{analyticsData.get_topic_takers_count}</Title>
              <SubText>Users tackled the topic</SubText>
            </StatisticText>
          </StatisticsContainer>
          <StatisticsContainer>
            <StatisticText>
              <Title>{analyticsData.solo_takers}</Title>
              <SubText>Times tackled alone</SubText>
            </StatisticText>
          </StatisticsContainer>
          <StatisticsContainer>
            <StatisticText>
              <Title>{analyticsData.duo_takers}</Title>
              <SubText>Times tackled with a friend</SubText>
            </StatisticText>
          </StatisticsContainer>
        </StatisticsWrapper>
        <StatisticsWrapper className='mb-3'>
          <StatisticsContainer>
            <StatisticText>
              <Title>{analyticsData.get_topic_comments_count}</Title>
              <SubText>Comments</SubText>
            </StatisticText>
          </StatisticsContainer>
          <StatisticsContainer>
            <StatisticText>
              <Title>
                {topic.ratings.length > 0
                  ? topic.ratings.filter((r) => r.type === 'upvote').length
                  : 0}
              </Title>
              <SubText>Upvotes</SubText>
            </StatisticText>
          </StatisticsContainer>
          <StatisticsContainer>
            <StatisticText>
              <Title>
                {topic.ratings.length > 0
                  ? topic.ratings.filter((r) => r.type === 'downvote').length
                  : 0}
              </Title>
              <SubText>Downvotes</SubText>
            </StatisticText>
          </StatisticsContainer>
        </StatisticsWrapper>
      </div>
      <TableWrapper>
        <ContentCenter className='mt-3'>
          <Title>Users</Title>
        </ContentCenter>
        <StyledInput
          type='text'
          name='search'
          id='search'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          placeholder='Search user...'
        />
        <ButtonWrapper>
          <SortText className='mr-2'>Sort by:</SortText>
          <StyledButton
            active={sortBy === 'average'}
            onClick={() => {
              setSortBy('average')
            }}
          >
            Rank
          </StyledButton>
          <StyledButton
            active={sortBy === 'name'}
            onClick={() => {
              setSortBy('name')
            }}
          >
            Name
          </StyledButton>
          <StyledButton
            active={sortBy === 'coverage'}
            onClick={() => {
              setSortBy('coverage')
            }}
          >
            Items Answered
          </StyledButton>
        </ButtonWrapper>
        <ResultsWrapper>
          {rankings
            .filter(
              ({ userInfo: { first_name: firstName, last_name: lastName } }) =>
                firstName.includes(search) || lastName.includes(search)
            )
            .map((rankingData, index) => (
              <ListGroup key={index}>
                <ListGroupItem>
                  {/* <Rank>{index + 1}</Rank> */}
                  <Score>
                    {Number(
                      (rankingData.numberOfCorrect / rankingData.totalTimesAnswered) * 100
                    ).toFixed(2)}<br />
                  </Score>
                  <UserWrapper>
                    <Title className='text-capitalize'>
                      {rankingData.userInfo.first_name} {rankingData.userInfo.last_name}
                    </Title>
                    <SubText>{rankingData.questionIdsSeen.length} items answered</SubText>
                    <SubText>out of {topic.questions.length}</SubText>
                  </UserWrapper>
                </ListGroupItem>
              </ListGroup>
            ))}
        </ResultsWrapper>
      </TableWrapper>
    </Wrapper>
  )
}

const ButtonWrapper = styled.div`
  margin: 5px;
`

const SortText = styled.div`
  font-size: 15px;
  display: inline;
  color: #4d4d4d;
`

const StyledButton = styled(Button)`
  border-radius: 18px;
  margin: 2px;
  font-size: 15px;
  display: inline;
  padding: 10px;
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
`

const UserWrapper = styled.div`
  justify-content: space-between;
  float: left;
  vertical-align: center;
`

const Score = styled.div`
  font-size: 20px;
  width: 20%;
  font-weight: bold;
  float: right;
  vertical-align: center;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  /* justify-content: center; */
  /* display: flex; */
  color: black !important;
`

const StatisticsContainer = styled.div`
  padding: 10px;
  width: 50%;
  text-align: center;
  margin-top: 5vh;
  margin-bottom: 5vh;
`

const StatisticText = styled.div`
  /* color: #ffffff; */
  font-size: 15px;
  display: inline;
  text-align: center;
  justify-content: center;
`

const TableWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 20px 20px 0px 0px;
  width: 100%;
  height: 80vh;
  /* position: absolute; */
  justify-content: center;
  /* top: 50%; */
  padding: 5px;
`

export default Analytics
