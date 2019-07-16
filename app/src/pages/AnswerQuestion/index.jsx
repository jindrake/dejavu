import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import { Query, compose } from 'react-apollo'
// import { FormGroup, Label, Input } from 'reactstrap'

import { getObjectValue } from '../../libs'
import Button from '../../components/Button'

const FETCH_QUESTION = gql`
query fetchQuestion($questionTopicId: uuid!){
  question_topic(where: { id: { _eq: $questionTopicId } }){
      id
      question {
        answer
        question  
      }
    }
  }
`

const AnswerQuestion = ({
  location: { state: { questionIds } },
  match: { params },
  history
}) => {
  console.log('params:', params)
  const remainingIds = questionIds.slice(1)
  const id = params.questionId

  const [ timer, setTimer ] = useState(10)

  const tick = () => {
    setTimer(timer - 1)
  }

  const reset = () => {
    setTimer(10)
  }

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000)
    if (timer < 1) {
      clearInterval(timerID)
    }

    return () => {
      clearInterval(timerID)
    }
  })

  return (
    <Wrapper>
      <TopSection><Button text='Back' onClick={() => history.goBack()} /></TopSection>
      <Query query={FETCH_QUESTION} variables={{ questionTopicId: id }}>
        {({ data, error, loading }) => {
          if (error) return <div>Error fetching question</div>
          if (loading) return <div>loading question...</div>
          const result = getObjectValue(data, 'question_topic[0]')
          console.log(result.question)

          return (
            <MainSection>
              <Belt>
                <Paper>
                  <div>Timer: {timer}</div>
                  Q: {result.question.question}
                </Paper>
              </Belt>
            </MainSection>
          )
        }}
      </Query>
      <BottomSection>
        {/* TODO add actual next function */}
        <Button
          text={remainingIds.length > 0 ? 'Skip' : 'Result'}
          type='primary'
          onClick={() => {
            reset()
            remainingIds.length > 0 && history.push({ pathname: `/topic/${id}/questions/${remainingIds[0].id}`, state: { questionIds: remainingIds } })
          }
          }
        />
      </BottomSection>
    </Wrapper>
  )
}

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
  margin-top: 6px;
  margin-bottom: 6px;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
`

const MainSection = styled.div`
  height: 100%;
  margin-right: -40px;
  margin-left: -40px;
  display: flex;
  overflow-x: scroll;
  position: relative;
`

const Belt = styled.div`
  position: absolute;
  height: 100%;
  display: flex;
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
export default compose(withRouter)(AnswerQuestion)
