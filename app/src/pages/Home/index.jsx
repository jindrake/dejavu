import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withFirebase from '../../hocs/withFirebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import { getObjectValue, useStateValue } from '../../libs'
import { FETCH_RECENT_TOPICS } from './queries'
import {
  FullPageLoader,
  // Icon,
  HomeCardWrapper,
  Belt,
  TopicsContainer,
  PageLabel,
  HeaderText
} from '../../components'
import { useQuery } from '@apollo/react-hooks'
import { Button, Badge } from 'reactstrap'

const Home = ({ history }) => {
  const [{ user }, globalDispatch] = useStateValue()
  const {
    data: recentTopicsData,
    loading: recentTopicsLoading,
    error: recentTopicsError
  } = useQuery(FETCH_RECENT_TOPICS, {
    fetchPolicy: 'no-cache'
  })

  if (window.localStorage.getItem('newUser')) {
    window.localStorage.removeItem('newUser')
    history.push('/welcome')
  }

  const componentError = recentTopicsError

  if (componentError) {
    console.error('error@home')
    globalDispatch({
      networkError: componentError.message
    })
  }

  if (recentTopicsLoading) {
    return <FullPageLoader />
  }

  const recentTopics = getObjectValue(recentTopicsData, 'topics.nodes') || []

  return (
    <Wrapper>
      <div>
        <HeaderText>
          Hello, {user ? <span className='text-capitalize'>{user.firstName}</span> : 'Study Buddy'}!
        </HeaderText>
        <CreateButtonContainer className='mt-3'>
          <Button color='primary' id='button' onClick={() => history.push('/topic/create')}>
            {/* <AddIcon name='add' /> */}
            {/* <FontAwesomeIcon icon={faPlus} />{' '} */}
            Create Topic
          </Button>
        </CreateButtonContainer>
      </div>
      <SectionWrapper>
        <PageLabel>Recent Topics</PageLabel>
        <TopicsContainer>
          <Belt>
            {recentTopics.length > 0
              ? recentTopics.map((topic, index) => (
                <HomeCardWrapper
                  key={index}
                  onClick={() => {
                    // history.push(`topic/${topic.id}`)
                  }}
                >
                  <div className='font-weight-bold'>{topic.name}</div>
                  <div className='overflow-y-scroll'>
                    <small>{topic.description}</small>
                  </div>
                  <div>
                    <small>
                      {getObjectValue(topic, 'topicFields.nodes[0]') &&
                          topic.topicFields.nodes.map(({ field }, index) => (
                            <Badge
                              className='text-lowercase font-weight-light'
                              color='warning'
                              key={index}
                            >
                              {field}
                            </Badge>
                          ))}
                    </small>
                  </div>
                  <div>
                    <div className='dejavu-small-text'>
                      {moment(new Date(topic.createdAt)).fromNow()}
                    </div>
                  </div>
                  <div className='d-flex flex-row justify-content-end text-center mr-3 dejavu-small-text'>
                    <div>
                      <FontAwesomeIcon icon={faThumbsUp} /> &nbsp;
                      {topic.topicRatings.nodes.length > 0
                        ? topic.topicRatings.nodes.filter((r) => r.type === 'upvote').length
                        : 0}
                    </div>
                      &nbsp;
                    <div>
                      <FontAwesomeIcon icon={faThumbsDown} /> &nbsp;
                      {topic.topicRatings.nodes.length > 0
                        ? topic.topicRatings.nodes.filter((r) => r.type === 'downvote').length
                        : 0}
                    </div>
                  </div>
                </HomeCardWrapper>
              ))
              : null}
          </Belt>
        </TopicsContainer>
      </SectionWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 40px;
  width: 100%;
  top: 0;
  padding: 30px;
  padding-bottom: 0;
`

const CreateButtonContainer = styled.div`
  justify-content: left;
  width: 16.5vh;
  margin-top: 5px;
`

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 4vh;
  height: 80%;
`

export default compose(
  withFirebase()
)(Home)
