import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import TitleSection from './TitleSection'
import Button from '../../components/Button'

const dummyTopic = {
  title: 'Nursing Reviewer for Compre',
  dateAdded: 'Jun 11, 2019',
  author: 'Lucille Tumambo',
  items: {
    id: 1,
    question: 'What',
    correct: 'A',
    options: ['B', 'C', 'D'],
    answer: null
  },
  timeLimit: 'No time limit',
  tacklersNumber: 10,
  upvotes: 1,
  downvotes: 2,
  tags: [ 'nursing', 'college', 'microbiology', 'lorem', 'ipsum', 'dolor' ]
}

const Topic = ({ history }) => (
  <Wrapper>
    <TopSection><Button text='back' onClick={() => history.push('/')} /></TopSection>
    <MainSection>
      <Belt>
        <Paper>
          <TitleSection
            upvotes={dummyTopic.upvotes}
            downvotes={dummyTopic.downvotes}
            author={dummyTopic.author}
            title={dummyTopic.title}
            tags={dummyTopic.tags}
            timeLimit={dummyTopic.timeLimit}
            tacklersNumber={dummyTopic.tacklersNumber}
            dateAdded={dummyTopic.dateAdded}
          />
        </Paper>
        <Paper>Item</Paper>
        <Paper>Item</Paper>
        <Paper>Item</Paper>
        <Paper>Item</Paper>
        <Paper>Item</Paper>
        <Paper>Item</Paper>
        <Paper>Results</Paper>
      </Belt>
    </MainSection>
    <BottomSection>
      {/* TODO add actual next function */}
      <Button text='tackle' type='primary' onClick={() => history.push('/')} />
    </BottomSection>
  </Wrapper>
)

const Paper = styled.div`
  background: linear-gradient(#e8eaf6, #c5cae9);
  padding: 40px;
  width: 280px;
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
  position: relative;
  margin-bottom: 10px;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
`

const Belt = styled.div`
  position: absolute;
  height: 100%;
  display: flex;
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

export default withRouter(Topic)
