import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import { Query, compose, graphql } from 'react-apollo'
import { Form, FormGroup, Label, Input } from 'reactstrap'
import { Formik } from 'formik'
import uuid from 'uuid/v4'

import { getObjectValue } from '../../libs'
import Button from '../../components/Button'

const FETCH_QUESTION = gql`
query fetchQuestion($questionId: uuid!){
  question(where: { id: { _eq: $questionId } }){
      id
      question
      answers {
        answer
      }
    }
  }
`
const INSERT_USER_ACTIVITY = gql`
  mutation insertUserActivity ($userActivity: [user_activity_insert_input!]!) {
    insert_user_activity(objects: $userActivity) {
      affected_rows
    }
  }
`

const AnswerQuestion = ({
  location: { state: { questionIds } },
  match: { params },
  history,
  user,
  insertUserActivity
}) => {
  console.log('params:', params)
  const remainingIds = questionIds.slice(1)
  const { questionId } = params
  const topicId = params.id
  const { topicSessionId } = params
  // const topicSessionId = uuid()
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
    <Query query={FETCH_QUESTION} variables={{ questionId: questionId }}>
      {({ data, error, loading }) => {
        if (error) return <div>Error fetching question</div>
        if (loading) return <div>loading question...</div>
        const result = getObjectValue(data, 'question[0]')
        console.log(result)
        const choices = result.answers
        console.log('choices:', choices)
        return (
          <Formik
            initialValues={{
              userAnswer: ''
            }}
            onSubmit={(values, { setSubmitting, setStatus }) => {
              setSubmitting(true)
              console.log('USERS SUBMITTING VALUEs:', values.userAnswer)
              // console.log('USER:', user)
              insertUserActivity({
                variables: {
                  userActivity: {
                    id: uuid(),
                    activity_type: 'answer',
                    user_id: user.id,
                    topic_id: topicId,
                    question_id: questionId,
                    topic_session_id: topicSessionId,
                    answer: values.userAnswer
                  }
                }
              })
                .then((res) => {
                  console.log('ressssssss:', res)
                  setSubmitting(false)
                  reset()
                  remainingIds.length > 0
                    ? history.push({ pathname: `/topic/${topicId}/questions/${remainingIds[0].id}/topicSession/${topicSessionId}`,
                      state: { questionIds: remainingIds } })
                    : history.push({ pathname: `/result/${topicId}/topicSession/${topicSessionId}` })
                })
                .catch((error) => {
                  setSubmitting(false)
                  console.log(error.message)
                  setStatus({ type: 'error', text: error.message })
                })
            }}
          >
            {({
              values,
              status,
              errors,
              touched,
              handleChange,
              handleSubmit
            }) => {
              return (
                <Form>
                  <Wrapper>
                    <TopSection>
                      {/* <Button
                        text='Back'
                        onClick={() => {
                          reset()
                          history.goBack()
                        }}
                      /> */}
                    </TopSection>
                    <MainSection>
                      <Belt>
                        <Paper>
                          <div>Timer: {timer}</div>
                          Q: {result.question}
                          Choices:
                          {
                            choices && choices.map((choice, index) => (
                              <FormGroup key={index.toString()} check>
                                <Label check>
                                  <Input
                                    type='radio'
                                    name='userAnswer'
                                    values={values.userAnswer}
                                    onChange={handleChange}
                                    value={choice.answer}
                                    invalid={errors.name && touched.name}
                                    disabled={timer < 1}
                                  />{' '}
                                  {choice.answer}
                                </Label>
                              </FormGroup>
                            ))
                          }
                        </Paper>
                      </Belt>
                    </MainSection>
                    <BottomSection>
                      <Button
                        text={timer < 1 ? 'Skip' : 'Submit'}
                        type='primary'
                        onClick={() => {
                          reset()
                          handleSubmit()
                          // remainingIds.length > 0
                          //   ? history.push({ pathname: `/topic/${id}/questions/${remainingIds[0].id}`,
                          //   state: { questionIds: remainingIds } })
                          //   : console.log('GO TO RESULT PAGE')
                        }}
                      />
                    </BottomSection>
                  </Wrapper>
                </Form>
              )
            }}
          </Formik>
        )
      }}
    </Query>
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
export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(AnswerQuestion)
