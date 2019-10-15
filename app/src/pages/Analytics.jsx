import React, { useState } from 'react'
import styled from 'styled-components'
import { ListGroup, ListGroupItem, Button, Row, Col } from 'reactstrap'
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
          <Title className='text-capitalize mb-5'>{topic.name} Analytics</Title>
        </ContentCenter>
        <ContentCenter>
          <h1 className='display-4 font-weight-bold'>{analyticsData.get_topic_average_score}%</h1>
        </ContentCenter>
        <ContentCenter>
          <SubText>Average Score</SubText>
        </ContentCenter>
        <div className='d-flex justify-content-around mt-3'>
          <div className='p-10 col text-center mt-4 mb-3'>
            <Title>{analyticsData.get_topic_takers_count}</Title>
            <SubText>Users tackled the topic</SubText>
          </div>
          <div className='p-10 col text-center mt-4 mb-3'>
            <Title>{analyticsData.solo_takers}</Title>
            <SubText>Times tackled alone</SubText>
          </div>
          <div className='p-10 col text-center mt-4 mb-3'>
            <Title>{analyticsData.duo_takers}</Title>
            <SubText>Times tackled with a friend</SubText>
          </div>
        </div>
        <div className='d-flex justify-content-around mt-3'>
          <div className='p-10 col text-center mt-4 mb-3'>
            <Title>{analyticsData.get_topic_comments_count}</Title>
            <SubText>Comments</SubText>
          </div>
          <div className='p-10 col text-center mt-4 mb-3'>
            <Title>
              {topic.ratings.length > 0
                ? topic.ratings.filter((r) => r.type === 'upvote').length
                : 0}
            </Title>
            <SubText>Upvotes</SubText>
          </div>
          <div className='p-10 col text-center mt-4 mb-3'>
            <Title>
              {topic.ratings.length > 0
                ? topic.ratings.filter((r) => r.type === 'downvote').length
                : 0}
            </Title>
            <SubText>Downvotes</SubText>
          </div>
        </div>
      </div>
      <Row className='p-3 bg-white'>
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
        <div className='m-3 d-inline'>
          <SubText className='mr-2 d-inline'>Sort by:</SubText>
          <Button
            className='m-1 border-0 rounded-pill text-wrap text-sm  bg-light text-dark'
            active={sortBy === 'average'}
            onClick={() => {
              setSortBy('average')
            }}
          >
            Rank
          </Button>
          <Button
            className='m-1 rounded-pill text-wrap text-sm border-0 bg-light text-dark'
            active={sortBy === 'name'}
            onClick={() => {
              setSortBy('name')
            }}
          >
            Name
          </Button>
          <Button
            className='m-1 rounded-pill text-wrap text-sm border-0 bg-light text-dark'
            active={sortBy === 'coverage'}
            onClick={() => {
              setSortBy('coverage')
            }}
          >
            Items Answered
          </Button>
        </div>
        <ResultsWrapper>
          {rankings
            .filter(
              ({ userInfo: { first_name: firstName, last_name: lastName } }) =>
                firstName.includes(search) || lastName.includes(search)
            )
            .map((rankingData, index) => {
              return (
                <ListGroup key={index}>
                  <ListGroupItem>
                    <Row>
                      <Col className='justify-content-between' xs='9'>
                        <Title className='m-0 text-capitalize'>
                          {rankingData.userInfo.first_name} {rankingData.userInfo.last_name}
                        </Title>
                        <div className='m-0'>
                          <SubText>{rankingData.questionIdsSeen.length} items answered</SubText>
                          <SubText>out of {topic.questions.length}</SubText>
                        </div>
                      </Col>
                      <Col className='text-center' xs='3'>
                        <Title className='font-weight-bold m-0'>
                          {Number(
                            (rankingData.numberOfCorrect / rankingData.totalTimesAnswered) * 100
                          ).toFixed(2)}
                        </Title>
                        <SubText className='m-0'>Score</SubText>
                      </Col>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              )
            })}
        </ResultsWrapper>
      </Row>
    </Wrapper>
  )
}

const ResultsWrapper = styled.div`
  margin-bottom: 10px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: 70%;
  width: 100%;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  color: black !important;
`

export default Analytics
