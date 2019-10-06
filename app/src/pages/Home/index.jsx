import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withFirebase from '../../hocs/withFirebase'

import { useStateValue } from '../../libs'
import { Button } from 'reactstrap'
import { FETCH_HOT_TOPICS, FETCH_RECENT_TOPICS } from './queries'
import { FullPageLoader, Icon, Placeholder } from '../../components'
import TopicPreview from './TopicPreview'
import { useQuery } from '@apollo/react-hooks'

const Home = ({ history }) => {
  const [{ user }, globalDispatch] = useStateValue()

  const {
    data: recentTopicsData,
    loading: recentTopicsLoading,
    error: recentTopicsError
  } = useQuery(FETCH_RECENT_TOPICS, {
    fetchPolicy: 'no-cache'
  })
  const { data: hotTopicsData, loading: hotTopicsLoading, error: hotTopicsError } = useQuery(
    FETCH_HOT_TOPICS,
    {
      fetchPolicy: 'no-cache'
    }
  )

  // useEffect(() => {
  //   if (fetchHotTopics.topic) {
  //     setHotTopics(fetchHotTopics.topic)
  //   }
  //   if (fetchRecentTopics.topic) {
  //     setRecentTopics(fetchHotTopics.topic || [])
  //   }
  //   if (fetchHotTopics.error) {
  //     console.error('error@home:1')
  //     globalDispatch({
  //       networkError: fetchHotTopics.error.message
  //     })
  //   }
  //   if (fetchRecentTopics.error) {
  //     console.error('error@home:2')
  //     globalDispatch({
  //       networkError: fetchRecentTopics.error.message
  //     })
  //   }
  // }, [
  //   fetchHotTopics.loading,
  //   fetchRecentTopics.loading,
  //   fetchHotTopics,
  //   fetchRecentTopics,
  //   globalDispatch
  // ])

  if (window.localStorage.getItem('newUser')) {
    window.localStorage.removeItem('newUser')
    history.push('/welcome')
  }

  const componentError = recentTopicsError || hotTopicsError

  if (componentError) {
    console.error('error@home')
    globalDispatch({
      networkError: componentError.message
    })
  }

  if (recentTopicsLoading || hotTopicsLoading) {
    return <FullPageLoader />
  }

  const hotTopics = hotTopicsData.topic
  const recentTopics = recentTopicsData.topic
  console.log(hotTopics, recentTopics)

  return (
    <Wrapper>
      <GreetingWrapper>
        Hello, {user ? user.first_name : 'Study Buddy'}!
        <CreateButtonContainer>
          <CreateTopicButton id='button' onClick={() => history.push('/topic/create')}>
            <AddIcon name='add' />
            Create a Topic
          </CreateTopicButton>
        </CreateButtonContainer>
      </GreetingWrapper>
      <SectionWrapper>
        <Title>Hot Topics</Title>
        <TopicsContainer>
          <Belt className='w-100'>
            {hotTopics.length > 0 ? (
              hotTopics.map((topic, index) => (
                <TopicPreview key={index} n={index} topic={topic} user={user} />
              ))
            ) : (
              <Placeholder />
            )}
          </Belt>
        </TopicsContainer>
      </SectionWrapper>
      <SectionWrapper>
        <Title>Recent Topics</Title>
        <TopicsContainer>
          <Belt className='w-100'>
            {recentTopics.length > 0 ? (
              recentTopics.map((topic, index) => (
                <TopicPreview key={index} n={index} topic={topic} user={user} />
              ))
            ) : (
              <Placeholder />
            )}
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
  bottom: 80px;
  width: 100%;
  top: 0;
  padding: 40px;
  padding-bottom: 0;
`

const GreetingWrapper = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #e8eaf6;
  text-align: left;
`

const CreateButtonContainer = styled.div`
  justify-content: left;
`

const CreateTopicButton = styled(Button)`
  background: linear-gradient(#ffa726, #ff9800);
  font-size: 12px;
  border: none;
`

const AddIcon = styled(Icon)`
  width: 30%;
`

const Belt = styled.div`
  position: absolute;
  top: 6px;
  bottom: 6px;
  display: flex;
`

const TopicsContainer = styled.div`
  position: relative;
  overflow-x: scroll;
  height: 100%;
  margin-left: -40px;
  margin-right: -40px;
`

const Title = styled.div`
  color: #c5cae9;
  font-size: 12px;
  margin-bottom: 4px;
`

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 4vh;
  height: 80%;
`

export default compose(
  withFirebase()
  // graphql(FETCH_HOT_TOPICS, { name: 'fetchHotTopics', options: { fetchPolicy: 'no-cache' } }),
  // graphql(FETCH_RECENT_TOPICS, { name: 'fetchRecentTopics', options: { fetchPolicy: 'no-cache' } })
)(Home)
