import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { Subscription, compose } from 'react-apollo'
// import { FormGroup, Label, Input } from 'reactstrap'

import TitleSection from './TitleSection'
import Button from '../../components/Button'

import { FETCH_FULL_TOPIC } from './queries'
import { getObjectValue } from '../../libs'

const Topic = ({
  history,
  match: { params: { id } },
  user
}) => {
  console.log('hello')
  console.log(id)
  let questionIds
  return (
    <Wrapper>
      <TopSection><Button text='Back' onClick={() => history.push('/')} /></TopSection>
      <Subscription subscription={FETCH_FULL_TOPIC} variables={{ topicId: id }}>
        {({ data, error, loading }) => {
          if (error) return <div>Error fetching topic: {error.message}</div>
          if (loading) return <div>loading topic...</div>
          const topic = getObjectValue(data, 'topic[0]')
          console.log(topic)
          console.log('Questions:', topic.questions)
          questionIds = topic.questions
          return (
            <MainSection>
              <Belt>
                <Paper>
                  <TitleSection
                    upvotes={topic.ratings.filter(rating => rating.type === 'upvote').length}
                    downvotes={topic.ratings.filter(rating => rating.type === 'downvote').length}
                    author={topic.creator}
                    title={topic.name}
                    description={topic.description}
                    items={topic.questions.length}
                    // tags={dummyTopic.tags}
                    // timeLimit={dummyTopic.timeLimit}
                    // tacklersNumber={dummyTopic.tacklersNumber}
                    // dateAdded={dummyTopic.dateAdded}
                  />
                </Paper>
              </Belt>
            </MainSection>

          )
        }}
      </Subscription>
      <BottomSection>
        {/* TODO add actual next function */}
        <Button
          text='Tackle'
          type='primary'
          onClick={() => history.push({ pathname: `/topic/${id}/questions/${questionIds[0].id}`, state: { questionIds } })}
        />
      </BottomSection>
    </Wrapper>
  )
}

const Paper = styled.div`
  background: linear-gradient(#e8eaf6, #c5cae9);
  padding: 40px;
  min-width: 280px;
  position: relative;
  margin-bottom: 10px;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  &:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    margin-left: 40px;
  }
  &:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    margin-right: 40px;  
  }
`

const MainSection = styled.div`
  height: 100%;
  margin-right: -40px;
  margin-left: -40px;
  display: flex;
  overflow-x: scroll;
  position: relative;
`

const TopSection = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
`

const BottomSection = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
  justify-content: flex-end;
`

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 40px;
  right: 40px;
`

export default compose(withRouter)(Topic)
