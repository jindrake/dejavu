import React, { useState } from 'react'
import styled from 'styled-components'
import { ListGroup, Button, Col, Row } from 'reactstrap'
import { Title, ContentCenter, StyledInput, SubText, FullPageLoader, DejavuCard } from '../components'
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
      <Statistics className='justify-content-center'>
        <div className='justify-content-center'>
          <ContentCenter>
            <Title className='text-capitalize mt-5 mb-4'>{topic.name} Analytics</Title>
          </ContentCenter>
          <ContentCenter>
            <h1 className='display-4 font-weight-bold'>{analyticsData.get_topic_average_score}%</h1>
          </ContentCenter>
          <ContentCenter>
            <SubText className='mb-3'>Average Score</SubText>
          </ContentCenter>
        </div>
        <div className='justify-content-center'>
          <Row className='justify-content-center m-3'>
            <Col xs='4' sm='4' md='4' lg='4' xl='4' className='p-2 text-center text-wrap'>
              <Title className='mb-2 dejavu-large-text'>{analyticsData.get_topic_takers_count}</Title>
              <SubText className='dejavu-small-text'>Users tackled the topic</SubText>
            </Col>
            <Col xs='4' sm='4' md='4' lg='4' xl='4' className='p-2 text-center text-wrap'>
              <Title className='mb-2 dejavu-large-text'>{analyticsData.solo_takers}</Title>
              <SubText className='dejavu-small-text'>Times tackled alone</SubText>
            </Col>
            <Col xs='4' sm='4' md='4' lg='4' xl='4' className='p-2 text-center text-wrap'>
              <Title className='mb-2 dejavu-large-text'>{analyticsData.duo_takers}</Title>
              <SubText className='dejavu-small-text'>Times tackled with a friend</SubText>
            </Col>
          </Row>
          <Row className='justify-content-center ml-3 mr-3 mt-3 pb-3'>
            <Col xs='4' sm='4' md='4' lg='4' xl='4' className='p-2 text-center text-wrap'>
              <Title className='mb-2 dejavu-large-text'>{analyticsData.get_topic_comments_count}</Title>
              <SubText className='dejavu-small-text'>Comments</SubText>
            </Col>
            <Col xs='4' sm='4' md='4' lg='4' xl='4' className='p-2 text-center text-wrap'>
              <Title className='mb-2 dejavu-large-text'>
                {topic.ratings.length > 0
                  ? topic.ratings.filter((r) => r.type === 'upvote').length
                  : 0}
              </Title>
              <SubText className='dejavu-small-text'>Upvotes</SubText>
            </Col>
            <Col xs='4' sm='4' md='4' lg='4' xl='4' className='p-2 text-center text-wrap'>
              <Title className='mb-2 dejavu-large-text'>
                {topic.ratings.length > 0
                  ? topic.ratings.filter((r) => r.type === 'downvote').length
                  : 0}
              </Title>
              <SubText className='dejavu-small-text'>Downvotes</SubText>
            </Col>
          </Row>
        </div>
      </Statistics>
      <div className='overflow-auto p-3 bg-white'>
        <ContentCenter className='mt-2'>
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
          <SubText className='mr-2 d-inline dejavu-small-text'>Sort by:</SubText>
          <Button
            className='dejavu-small-text m-1 border-0 rounded-pill text-wrap text-sm  bg-light'
            active={sortBy === 'average'}
            onClick={() => {
              setSortBy('average')
            }}
          >
            Rank
          </Button>
          <Button
            className='dejavu-small-text m-1 rounded-pill text-wrap text-sm border-0 bg-light'
            active={sortBy === 'name'}
            onClick={() => {
              setSortBy('name')
            }}
          >
            Name
          </Button>
          <Button
            className='dejavu-small-text m-1 rounded-pill text-wrap text-sm border-0 bg-light'
            active={sortBy === 'coverage'}
            onClick={() => {
              setSortBy('coverage')
            }}
          >
            Items Answered
          </Button>
        </div>
        <div>
          {rankings
            .filter(
              ({ userInfo: { first_name: firstName, last_name: lastName } }) =>
                firstName.includes(search) || lastName.includes(search)
            )
            .map((rankingData, index) => {
              console.log('thernkingdata', rankingData)
              return (
                <ListGroup key={index}>
                  <DejavuCard>
                    <Row>
                      <Col xs='8' sm='8' md='8' lg='8' xl='8' className='justify-content-between'>
                        <Title className='m-0 text-capitalize'>
                          {rankingData.userInfo.first_name} {rankingData.userInfo.last_name}
                        </Title>
                        <div className='m-0'>
                          <SubText className='dejavu-small-text'>{rankingData.questionIdsSeen.length} items answered</SubText>
                          <SubText className='dejavu-small-text'>out of {topic.questions.length}</SubText>
                        </div>
                      </Col>
                      <Col xs='4' sm='4' md='4' lg='4' xl='4' className='text-center'>
                        <Title className='text-capitalize font-weight-bold m-0'>
                          {Number(
                            (rankingData.numberOfCorrect / rankingData.totalTimesAnswered) * 100
                          ).toFixed(2)}
                        </Title>
                        <SubText className='dejavu-small-text m-0'>Score</SubText>
                      </Col>
                    </Row>
                  </DejavuCard>
                </ListGroup>
              )
            })}
        </div>
      </div>
    </Wrapper>
  )
}

const Statistics = styled.div`
  background-color: #5eb2fb;
  width: 100%;
  color: white;
`

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`

export default Analytics
