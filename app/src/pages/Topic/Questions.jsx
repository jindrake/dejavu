import React, { useState } from 'react'
import { Formik, FieldArray } from 'formik'
import { withRouter } from 'react-router-dom'
import { Button, Form, Input, FormGroup, FormText, CustomInput, Alert } from 'reactstrap'
import styled from 'styled-components'
import { Mutation, Subscription, compose } from 'react-apollo'
import uuid from 'uuid/v4'
import { getObjectValue, useStateValue } from '../../libs'
import { REMOVE_QUESTION, INSERT_QUESTION, FETCH_TOPIC, FETCH_TOPIC_QUESTIONS } from './queries'
import {
  Title,
  OverlayLoaderContainer,
  SubText
} from '../../components'
import gql from 'graphql-tag'
// left the styled components here for now for easy restyling
const CurrentQuestionsSection = styled.div`
  padding: 5px;
  margin-bottom: 60px;
`

const QuestionCard = styled.div`
  background-color: white;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
`

const CenterText = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

const StyledForm = styled(Form)`
  width: 100%;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 30px;
  overflow-y: auto;
`

const RightText = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`

const UnderlineInput = styled(Input)`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #ffffff;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-radius: 0;
  color: white;
  &:focus {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #ffffff;
    -webkit-box-shadow: none;
    box-shadow: none;
    border-radius: 0;
    color: white;
  }
`

const RemoveButton = styled(Button)`
  color: red;
`

const ChoiceItem = styled(FormGroup)`
  display: flex;
`

const Hint = styled.span`
  color: #ef5350;
  margin-left: 6px;
`

const AddQuestions = ({
  match: {
    params: { uri }
  },
  user
}) => {
  const [, globalDispatch] = useStateValue()
  const [numberOfQuestions, setNumberOfQuestions] = useState(0)
  return (
    <StyledForm>
      <Subscription subscription={FETCH_TOPIC} variables={{ uri: uri }}>
        {({ data, error, loading }) => {
          if (error) {
            globalDispatch({
              networkError: error.message
            })
            return null
          }
          if (loading) {
            return <OverlayLoaderContainer />
          }
          const topic = getObjectValue(data, 'topic[0]')
          console.log('TOPIC is:', topic)
          return (
            <>
              <Mutation mutation={INSERT_QUESTION}>
                {(insertQuestion, { data, error, loading }) => {
                  if (error) {
                    globalDispatch({
                      networkError: error.message
                    })
                    return null
                  }
                  if (loading) {
                    return <OverlayLoaderContainer />
                  }
                  return (
                    <Formik
                      initialValues={{
                        question: '',
                        choices: [],
                        correctAnswers: []
                      }}
                      validate={(values) => {
                        let errors = {}
                        if (!values.question) {
                          errors.question = 'required'
                        }
                        if (values.correctAnswers.every((answer) => !answer)) {
                          errors.correctAnswers = 'choices must at least have 1 correct answer'
                        }
                        if (values.choices.some((choice) => !choice)) {
                          errors.choices = 'remove empty choices'
                        }
                        if (values.choices.length < 2) {
                          errors.choices = 'questions require at least 2 choices'
                        }
                        return errors
                      }}
                      onSubmit={(values, { setSubmitting, setStatus }) => {
                        setSubmitting(true)
                        const questionId = uuid()
                        let correctAnswers = values.choices.filter(
                          (_, index) => !!values.correctAnswers[index]
                        )
                        let dummyAnswers = values.choices.filter(
                          (_, index) => !values.correctAnswers[index]
                        )
                        // changed the format of correct answers from '[]' to this '[<>[]<>]'
                        // to make the possibility of user input causing problems with our format even more edgy
                        insertQuestion({
                          variables: {
                            questionObject: {
                              question: values.question,
                              creator_id: user.id,
                              type: 'multiple_choice',
                              id: questionId,
                              answers: {
                                data: [
                                  ...correctAnswers.map((answer) => ({
                                    answer,
                                    id: uuid(),
                                    is_correct: true
                                  })),
                                  ...dummyAnswers.map((answer) => ({
                                    answer,
                                    id: uuid()
                                  }))
                                ]
                              }
                            },
                            questionTopic: {
                              id: uuid(),
                              question_id: questionId,
                              topic_id: topic.id
                            }
                          }
                        })
                          .then((result) => {
                            // TODO: set success status
                            console.log('mutation result:', result)
                            setSubmitting(false)
                          })
                          .catch((error) => {
                            setSubmitting(false)
                            globalDispatch({
                              networkError: error.message
                            })
                          })
                      }}
                      render={({
                        values,
                        handleChange,
                        setFieldValue,
                        errors,
                        touched,
                        handleSubmit,
                        isSubmitting
                      }) => {
                        return (
                          <>
                            <Title>Add Question </Title>
                            {touched.question && errors.question && <Hint>{errors.question}</Hint>}
                            <Input
                              type='text'
                              id={`question`}
                              name={`question`}
                              value={values.question}
                              onChange={handleChange}
                              invalid={errors.question && touched.question}
                            />

                            <FieldArray
                              name='choices'
                              render={(arrayHelpers) => (
                                <div>
                                  <CenterText>
                                    <Button
                                      type='button'
                                      color='link'
                                      onClick={() => arrayHelpers.push('')}
                                    >
                                      + add choice
                                    </Button>
                                  </CenterText>
                                  {errors.choices && touched.choices ? (
                                    <CenterText>
                                      <Hint>{errors.choices}</Hint>
                                    </CenterText>
                                  ) : errors.correctAnswers && touched.correctAnswers ? (
                                    <CenterText>
                                      <Hint>{errors.correctAnswers}</Hint>
                                    </CenterText>
                                  ) : null}
                                  {values.choices && values.choices.length > 0 ? (
                                    values.choices.map((_, index) => (
                                      <div key={index}>
                                        <ChoiceItem className='pl-3'>
                                          <CustomInput
                                            type='checkbox'
                                            id={`isCorrect:${index}`}
                                            name={`isCorrect:${index}`}
                                            checked={!!values.correctAnswers[index]}
                                            onChange={(event) => {
                                              const correctAnswers = values.correctAnswers
                                              correctAnswers[index] = event.target.checked
                                              setFieldValue('correctAnswers', correctAnswers)
                                            }}
                                          />

                                          <UnderlineInput
                                            type='text'
                                            id={`choices.${index}`}
                                            name={`choices.${index}`}
                                            value={values.choices[index]}
                                            bsSize='sm'
                                            onChange={handleChange}
                                          />
                                          <RemoveButton
                                            size='sm'
                                            color='link'
                                            onClick={() => {
                                              arrayHelpers.remove(index)
                                            }}
                                          >
                                            remove
                                          </RemoveButton>
                                        </ChoiceItem>
                                      </div>
                                    ))
                                  ) : (
                                    <CenterText className='px-4'>
                                      <FormText color='white'>
                                        No Choices added yet. At least 2 choices are required for a
                                        question
                                      </FormText>
                                    </CenterText>
                                  )}
                                  {values.choices.length ? (
                                    <CenterText>
                                      <FormText color='white' className='px-4'>
                                        Tick the checkbox of the correct choices
                                      </FormText>
                                    </CenterText>
                                  ) : null}
                                </div>
                              )}
                            />
                            <RightText>
                              <Button color='success' onClick={handleSubmit} size='sm'>
                                {isSubmitting || loading ? 'Saving' : 'Add'}
                              </Button>
                            </RightText>
                          </>
                        )
                      }}
                    />
                  )
                }}
              </Mutation>
              <hr />
              {numberOfQuestions >= 10 ? (
                <Mutation mutation={PUBLISH_TOPIC}>
                  {(publishTopic, { loading, error }) => {
                    if (error) {
                      globalDispatch({
                        networkError: error.message
                      })
                      return null
                    }
                    if (loading) {
                      return <OverlayLoaderContainer />
                    }
                    return (
                      <>
                        <Button
                          className='form-control'
                          color={topic.is_published ? 'warning' : 'success'}
                          onClick={() => {
                            publishTopic({
                              variables: {
                                topicId: topic.id,
                                isPublished: !topic.is_published
                              }
                            })
                          }}
                        >
                          {topic.is_published ? 'Unpublish' : 'Publish'}
                        </Button>
                        <hr />
                      </>
                    )
                  }}
                </Mutation>
              ) : (
                <Alert color='warning'>
                  <SubText>
                    In order to publish a topic, it must at least have <strong>10 questions</strong> first
                  </SubText>
                </Alert>
              )}
            </>
          )
        }}
      </Subscription>
      <CurrentQuestionsSection>
        <Title>Topic Questions: {numberOfQuestions}</Title>
        <Subscription subscription={FETCH_TOPIC_QUESTIONS} variables={{ topicUri: uri }}>
          {({ data, error, loading }) => {
            if (error) {
              globalDispatch({
                networkError: error.message
              })
              return null
            }
            if (loading) {
              return <OverlayLoaderContainer />
            }
            const topicQuestions = data.question_topic
            if (topicQuestions.length !== numberOfQuestions) {
              setNumberOfQuestions(topicQuestions.length)
            }
            return (
              <Mutation mutation={REMOVE_QUESTION}>
                {(removeQuestion, { error, loading }) => {
                  if (error) {
                    globalDispatch({
                      networkError: error.message
                    })
                    return null
                  }
                  if (loading) return <OverlayLoaderContainer />
                  return (
                    <>
                      {topicQuestions.map(({ question }, index) => {
                        const dummyAnswers = question.answers
                          .filter((answer) => !answer.is_correct)
                          .map((answer) => answer.answer)
                          .join(', ')
                        const correctAnswers = question.answers
                          .filter((answer) => answer.is_correct)
                          .map((answer) => answer.answer)
                          .join(', ')
                        return (
                          <QuestionCard key={`questions:${index}`}>
                            <RightText>
                              <RemoveButton
                                close
                                onClick={() => {
                                  removeQuestion({
                                    variables: {
                                      topicUri: uri,
                                      questionId: question.id
                                    }
                                  })
                                }}
                              />
                            </RightText>
                            <CenterText>{question.question}</CenterText>
                            <div>
                              answers: <span className='text-success'>{correctAnswers}</span>
                            </div>
                            <div>
                              dummy answers: <span className='text-warning'> {dummyAnswers}</span>
                            </div>
                          </QuestionCard>
                        )
                      })}
                    </>
                  )
                }}
              </Mutation>
            )
          }}
        </Subscription>
      </CurrentQuestionsSection>
    </StyledForm>
  )
}

const PUBLISH_TOPIC = gql`
  mutation publishTopic($topicId: uuid!, $isPublished: Boolean!) {
    update_topic(_set: { is_published: $isPublished }, where: { id: { _eq: $topicId } }) {
      affected_rows
    }
  }
`

export default compose(withRouter)(AddQuestions)
