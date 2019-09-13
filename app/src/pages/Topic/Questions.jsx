import React, { useState } from 'react'
import { Formik, FieldArray } from 'formik'
import { withRouter } from 'react-router-dom'
import { Button, Input, FormText, CustomInput, Alert } from 'reactstrap'
import compose from 'recompose/compose'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import uuid from 'uuid/v4'
import { getObjectValue, useStateValue } from '../../libs'
import styled from 'styled-components'
import {
  REMOVE_QUESTION,
  INSERT_QUESTION,
  FETCH_TOPIC,
  FETCH_TOPIC_QUESTIONS,
  FETCH_USER_PREVIOUS_QUESTIONS,
  INSERT_QUESTION_TOPIC_RELATIONSHIP,
  PUBLISH_TOPIC
} from './queries'
import { Title, OverlayLoader, SubText } from '../../components'
import {
  CurrentQuestionsSection,
  CenterText,
  StyledForm,
  RightText,
  UnderlineInput,
  RemoveButton,
  ChoiceItem,
  Hint,
  QuestionCard
} from '../../components/Topic'

const AddQuestions = ({
  match: {
    params: { id }
  },
  user
}) => {
  const [, globalDispatch] = useStateValue()
  const [numberOfQuestions, setNumberOfQuestions] = useState(0)
  const [field, setField] = useState(null)
  const [topicId, setTopicId] = useState(null)
  const [previousQuestions, setPreviousQuestions] = useState(null)
  const [
    insertQuestion,
    { error: insertQuestionError, loading: insertQuestionLoading }
  ] = useMutation(INSERT_QUESTION)
  const [publishTopic, { loading: publishTopicLoading, error: publishTopicError }] = useMutation(
    PUBLISH_TOPIC
  )
  const {
    data: topicQuestionsData,
    error: topicQuestionsError,
    loading: topicQuestionsLoading
  } = useSubscription(FETCH_TOPIC_QUESTIONS, {
    skip: !id,
    variables: {
      topicId: id
    }
  })
  const [
    removeQuestion,
    { error: removeQuestionError, loading: removeQuestionLoading }
  ] = useMutation(REMOVE_QUESTION)
  const {
    data: userQuestionsData,
    loading: userQuestionsLoading,
    error: userQuestionsError
  } = useQuery(FETCH_USER_PREVIOUS_QUESTIONS, {
    skip: !topicId || !user,
    variables: { creatorId: user.id, topicId: topicId }
  })
  const [addQuestion, { loading: addQuestionLoading, error: addQuestionError }] = useMutation(
    INSERT_QUESTION_TOPIC_RELATIONSHIP
  )
  const {
    data: fetchTopicData,
    error: fetchTopicError,
    loading: fetchTopicLoading
  } = useSubscription(FETCH_TOPIC, {
    skip: !id,
    variables: {
      id: id
    }
  })

  if (
    fetchTopicLoading ||
    insertQuestionLoading ||
    publishTopicLoading ||
    topicQuestionsLoading ||
    removeQuestionLoading ||
    userQuestionsLoading ||
    addQuestionLoading
  ) {
    return <OverlayLoader />
  }

  if (fetchTopicError) {
    console.error('error@questions:1')
    globalDispatch({
      networkError: fetchTopicError.message
    })
    return null
  }

  if (insertQuestionError) {
    console.error('error@questions:2')
    globalDispatch({
      networkError: insertQuestionError.message
    })
    return null
  }

  if (publishTopicError) {
    console.error('error@questions:3')
    globalDispatch({
      networkError: publishTopicError.message
    })
    return null
  }
  if (topicQuestionsError) {
    console.error('error@questions:4')
    globalDispatch({
      networkError: topicQuestionsError.message
    })
    return null
  }
  if (removeQuestionError) {
    console.error('error@questions:5')
    globalDispatch({
      networkError: removeQuestionError.message
    })
    return null
  }
  if (userQuestionsError) {
    console.error('error@questions:6')
    globalDispatch({
      networkError: userQuestionsError.message
    })
    return null
  }
  if (addQuestionError) {
    console.error('error@questions:7')
    globalDispatch({
      networkError: addQuestionError.message
    })
    return null
  }
  if (userQuestionsData && userQuestionsData.get_topic_suggested_questions && !previousQuestions) {
    setPreviousQuestions(JSON.parse(userQuestionsData.get_topic_suggested_questions) || [])
  }

  const topicQuestions = topicQuestionsData.question_topic
  if (topicQuestions.length !== numberOfQuestions) {
    setNumberOfQuestions(topicQuestions.length)
  }
  const topic = getObjectValue(fetchTopicData, 'topic[0]')
  if (!field && getObjectValue(topic, 'target_fields[0].field')) {
    setField(getObjectValue(topic, 'target_fields[0].field'))
  }
  if (!topicId && topic.id) {
    setTopicId(topic.id)
  }

  return (
    <StyledForm>
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
          let correctAnswers = values.choices.filter((_, index) => !!values.correctAnswers[index])
          let dummyAnswers = values.choices.filter((_, index) => !values.correctAnswers[index])
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
            .then(() => {
              setSubmitting(false)
            })
            .catch((error) => {
              setSubmitting(false)
              console.error('error@questions:8')
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
                      <Button type='button' color='link' onClick={() => arrayHelpers.push('')}>
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
                          No Choices added yet. At least 2 choices are required for a question
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
                  {isSubmitting || insertQuestionLoading ? 'Saving' : 'Add'}
                </Button>
              </RightText>
            </>
          )
        }}
      />
      <hr />
      {numberOfQuestions >= 10 ? (
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
      ) : (
        <Alert color='warning'>
          <SubText>
            In order to publish a topic, it must at least have <strong>10 questions</strong> first
          </SubText>
        </Alert>
      )}
      <CurrentQuestionsSection>
        <Title>Topic Questions: {numberOfQuestions}</Title>
        {topicQuestions.map(({ question, id }, index) => {
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
              <RemoveButton
                close
                onClick={() => {
                  removeQuestion({
                    variables: {
                      id
                    }
                  })
                }}
              />
              <CenterText>{question.question}</CenterText>
              <AnswerDiv>
                answers: {correctAnswers}
              </AnswerDiv>
              <DummyDiv>
                wrong answers: {dummyAnswers}
              </DummyDiv>
            </QuestionCard>
          )
        })}
      </CurrentQuestionsSection>
      {field && (
        <CurrentQuestionsSection>
          <Title>Select from your previous questions</Title>
          {previousQuestions && previousQuestions.map((question, index) => {
            const dummyAnswers = question.answers
              .filter((answer) => !answer.is_correct)
              .map((answer) => answer.answer)
              .join(', ')
            const correctAnswers = question.answers
              .filter((answer) => answer.is_correct)
              .map((answer) => answer.answer)
              .join(', ')
            return (
              <QuestionCard
                key={`questions:${index}`}
                onClick={async () => {
                  await addQuestion({
                    variables: {
                      questionTopic: {
                        id: uuid(),
                        topic_id: topicId,
                        question_id: question.id
                      }
                    }
                  })
                  const questions = Object.assign([], previousQuestions)
                  questions.splice(index, 1)
                  setPreviousQuestions(questions)
                }}
              >
                <CenterText>{question.question}</CenterText>
                <AnswerDiv>
                  answers: {correctAnswers}
                </AnswerDiv>
                <DummyDiv>
                  dummy answers: {dummyAnswers}
                </DummyDiv>
              </QuestionCard>
            )
          })}
        </CurrentQuestionsSection>
      )}
    </StyledForm>
  )
}

const AnswerDiv = styled.div`
  font-size: 2vh;
  color: green;
`

const DummyDiv = styled.div`
  font-size: 2vh;
  color: red;
`

export default compose(withRouter)(AddQuestions)
