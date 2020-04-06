import React, { useState } from 'react'
import styled from 'styled-components'
import { ListGroup, Button, Col, Row } from 'reactstrap'
import { Title, ContentCenter, StyledInput, FullPageLoader, DejavuCard } from '../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faAward } from '@fortawesome/free-solid-svg-icons'
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
  }, history
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

  const topic = getObjectValue(topicData, 'topic[0]')
  const rankings = resultsData.get_topic_rankings ? JSON.parse(resultsData.get_topic_rankings) : []
  return (
    <Wrapper>
      <Statistics className='justify-content-center'>
        <FontAwesomeIcon className='m-3' icon={faArrowLeft} onClick={() => history.goBack()} />
        <div className='justify-content-center'>
          <ContentCenter>
            <Title className='text-white text-capitalize mt-1 mb-4'>{topic.name} Analytics</Title>
          </ContentCenter>
          <ContentCenter>
            <h1 className='display-4 text-white font-weight-bold'>{analyticsData.get_topic_average_score}%</h1>
          </ContentCenter>
          <ContentCenter>
            <div className='text-white mb-3'>Average Score</div>
          </ContentCenter>
        </div>
        <div className='justify-content-center'>
          <Row className='justify-content-center m-3'>
            <Col xs='4' sm='4' md='4' lg='4' xl='4' className='p-2 text-center text-wrap'>
              <Title className='mb-2 dejavu-large-text'>{analyticsData.get_topic_takers_count}</Title>
              <div className='dejavu-small-text'>Users tackled the topic</div>
            </Col>
            <Col xs='4' sm='4' md='4' lg='4' xl='4' className='p-2 text-center text-wrap'>
              <Title className='mb-2 dejavu-large-text'>{analyticsData.solo_takers}</Title>
              <div className='dejavu-small-text'>Times tackled alone</div>
            </Col>
            <Col xs='4' sm='4' md='4' lg='4' xl='4' className='p-2 text-center text-wrap'>
              <Title className='mb-2 dejavu-large-text'>{analyticsData.duo_takers}</Title>
              <div className='dejavu-small-text'>Times tackled with a friend</div>
            </Col>
          </Row>
          <Row className='justify-content-center ml-3 mr-3 mt-3 pb-3'>
            <Col xs='4' sm='4' md='4' lg='4' xl='4' className='p-2 text-center text-wrap'>
              <Title className='mb-2 dejavu-large-text'>{analyticsData.get_topic_comments_count}</Title>
              <div className='dejavu-small-text'>Comments</div>
            </Col>
            <Col xs='4' sm='4' md='4' lg='4' xl='4' className='p-2 text-center text-wrap'>
              <Title className='mb-2 dejavu-large-text'>
                {topic.ratings.length > 0
                  ? topic.ratings.filter((r) => r.type === 'upvote').length
                  : 0}
              </Title>
              <div className='dejavu-small-text'>Upvotes</div>
            </Col>
            <Col xs='4' sm='4' md='4' lg='4' xl='4' className='p-2 text-center text-wrap'>
              <Title className='mb-2 dejavu-large-text'>
                {topic.ratings.length > 0
                  ? topic.ratings.filter((r) => r.type === 'downvote').length
                  : 0}
              </Title>
              <div className='dejavu-small-text'>Downvotes</div>
            </Col>
          </Row>
        </div>
      </Statistics>
      <div className='p-3 bg-white'>
        <div className='overflow-auto sticky-top bg-white'>
          <ContentCenter className='mt-2'>
            <Title className='text-dark'>Leaderboard</Title>
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
            <div className='mr-2 d-inline dejavu-small-text'>Sort by:</div>
            <Button
              className='dejavu-small-text text-dark m-1 border-0 rounded-pill text-wrap text-sm  bg-light'
              active={sortBy === 'average'}
              onClick={() => {
                setSortBy('average')
              }}
            >
              Rank
            </Button>
            <Button
              className='dejavu-small-text text-dark m-1 rounded-pill text-wrap text-sm border-0 bg-light'
              active={sortBy === 'name'}
              onClick={() => {
                setSortBy('name')
              }}
            >
              Name
            </Button>
            <Button
              className='dejavu-small-text text-dark m-1 rounded-pill text-wrap text-sm border-0 bg-light'
              active={sortBy === 'coverage'}
              onClick={() => {
                setSortBy('coverage')
              }}
            >
              Items Answered
            </Button>
          </div>
        </div>
        <div>
          {rankings
            .filter(
              ({ userInfo: { first_name: firstName, last_name: lastName } }) =>
                firstName.includes(search) || lastName.includes(search)
            )
            .map((rankingData, index) => {
              return (
                <ListGroup className='overflow-auto' key={index}>
                  <DejavuCard>
                    <Row>
                      <Col xs='1' sm='1' md='1' lg='1' xl='1' className='align-middle dejavu-large-text justify-content-between'>
                        {index + 1 === 1 ? (<FontAwesomeIcon className='' icon={faAward} />) : (index + 1)}
                      </Col>
                      <Col xs='6' sm='7' md='7' lg='7' xl='7' className='justify-content-between'>
                        <Title className='m-0 text-capitalize'>
                          {rankingData.userInfo.first_name} {rankingData.userInfo.last_name}
                        </Title>
                        <div className='m-0'>
                          <div className='dejavu-small-text'>{rankingData.questionIdsSeen.length} items answered</div>
                          <div className='dejavu-small-text'>out of {topic.questions.length}</div>
                        </div>
                      </Col>
                      <Col xs='4' sm='4' md='4' lg='4' xl='4' className='text-center'>
                        <Title className='text-capitalize font-weight-bold m-0'>
                          {Number(
                            (rankingData.numberOfCorrect / rankingData.totalTimesAnswered) * 100
                          ).toFixed(1)}
                        </Title>
                        <div className='dejavu-small-text m-0'>Score</div>
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
  overflow: auto;
`

export default Analytics
