import React from 'react'
import styled from 'styled-components'

import TitleSection from './TitleSection'

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
  timeLimit: '30m',
  tacklersNumber: 10,
  upvotes: 1,
  downvotes: 2,
  tags: [ 'nursing', 'college', 'microbiology', 'lorem', 'ipsum', 'dolor' ]
}

const Topic = () => (
  <Wrapper>
    <TopSection>Top</TopSection>
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
    <BottomSection>Bottom</BottomSection>
  </Wrapper>
)

const Paper = styled.div`
  background: #E8EAF6;
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
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: -40px;
  margin-left: -40px;
  display: flex;
  overflow-x: scroll;
  position: relative;
`

const TopSection = styled.div`
  height: 40px;
`

const BottomSection = styled.div`
  height: 40px;
`

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 40px;
  right: 40px;
`

export default Topic
