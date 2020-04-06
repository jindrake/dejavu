import React, { useState } from 'react'
import { Formik, FieldArray } from 'formik'
import { withRouter } from 'react-router-dom'
import { FormText, FormGroup, Label, Button, InputGroup, InputGroupAddon } from 'reactstrap'
import compose from 'recompose/compose'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import uuid from 'uuid/v4'
import { getObjectValue, useStateValue } from '../../libs'
import Img from 'react-image'
import {
  REMOVE_QUESTION,
  INSERT_QUESTION,
  FETCH_TOPIC,
  FETCH_TOPIC_QUESTIONS,
  FETCH_USER_PREVIOUS_QUESTIONS,
  INSERT_QUESTION_TOPIC_RELATIONSHIP,
  PUBLISH_TOPIC,
  UPDATE_QUESTION
} from './queries'
import {
  OverlayLoader,
  DejavuCard,
  HeaderText,
  StyledInput,
  ContentCenter,
  PageLabel
} from '../../components'
import Dropzone from '../../components/Dropzone'

import {
  CurrentQuestionsSection,
  CenterText,
  StyledForm,
  RemoveButton
} from '../../components/Topic'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { withFirebase } from '../../hocs'

const AddQuestions = ({
  match: {
    params: { id }
  },
  user,
  firebase,
  history
}) => {
  const [currentQuestionPhoto, setCurrentQuestionPhoto] = useState(null)
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
  const [
    updateQuestion,
    { loading: updateQuestionLoading, error: updateQuestionError }
  ] = useMutation(UPDATE_QUESTION)
  const {
    data: fetchTopicData,
    error: fetchTopicError,
    loading: fetchTopicLoading,
    refetch: refetchTopic
  } = useQuery(FETCH_TOPIC, {
    skip: !id,
    variables: {
      id: id
    }
  })

  console.log(
    fetchTopicLoading,
    insertQuestionLoading,
    publishTopicLoading,
    topicQuestionsLoading,
    removeQuestionLoading,
    userQuestionsLoading,
    addQuestionLoading
  )

  const componentError =
    fetchTopicError ||
    insertQuestionError ||
    publishTopicError ||
    topicQuestionsError ||
    removeQuestionError ||
    userQuestionsError ||
    addQuestionError ||
    updateQuestionError

  if (componentError) {
    console.error('error@questions:1')
    globalDispatch({
      networkError: componentError.message
    })
    return null
  }

  if (
    fetchTopicLoading ||
    insertQuestionLoading ||
    publishTopicLoading ||
    // topicQuestionsLoading ||
    removeQuestionLoading ||
    userQuestionsLoading ||
    addQuestionLoading ||
    updateQuestionLoading
  ) {
    return <OverlayLoader />
  }
  if (userQuestionsData && userQuestionsData.get_topic_suggested_questions && !previousQuestions) {
    setPreviousQuestions(JSON.parse(userQuestionsData.get_topic_suggested_questions) || [])
  }

  const topicQuestions = topicQuestionsData ? topicQuestionsData.question_topic : []
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
      <div>
        <FontAwesomeIcon icon={faArrowLeft} onClick={() => history.goBack()} />
      </div>
      <Formik
        initialValues={{
          question: '',
          choices: [],
          correctAnswers: [],
          newChoiceValue: ''
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
        onSubmit={async (values) => {
          globalDispatch({
            loading: true
          })
          try {
            const questionId = uuid()
            let correctAnswers = values.choices.filter((_, index) => !!values.correctAnswers[index])
            let dummyAnswers = values.choices.filter((_, index) => !values.correctAnswers[index])

            await insertQuestion({
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
            if (currentQuestionPhoto) {
              const photoId = uuid()
              const uploadTask = firebase.storage
                .ref(`images/${user.id}/${currentQuestionPhoto.name}-${photoId}`)
                .put(currentQuestionPhoto, {
                  contentType: currentQuestionPhoto.type
                })
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  if (snapshot.bytesTransferred === snapshot.totalBytes) {
                    setCurrentQuestionPhoto(null)
                    globalDispatch({
                      loading: false
                    })
                  }
                },
                (error) => {
                  throw error
                },
                async () => {
                  const url = await firebase.storage
                    .ref(`images/${user.id}`)
                    .child(`${currentQuestionPhoto.name}-${photoId}`)
                    .getDownloadURL()

                  await updateQuestion({
                    variables: {
                      questionId: questionId,
                      data: {
                        img_url: url
                      }
                    }
                  })
                }
              )
            } else {
              globalDispatch({
                loading: false
              })
            }
          } catch (error) {
            console.error('error@questions:8:', error.message)
            globalDispatch({
              networkError: error.message,
              loading: false
            })
          }
        }}
        render={({
          values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          handleSubmit,
          setTouched
        }) => {
          return (
            <>
              <ContentCenter>
                <HeaderText>Add Question </HeaderText>
              </ContentCenter>
              <FormGroup>
                <Label>Question</Label>
                <StyledInput
                  type='textarea'
                  id={`question`}
                  name={`question`}
                  value={values.question}
                  onChange={handleChange}
                  invalid={errors.question && touched.question}
                  className='mb-1'
                />
                {touched.question && errors.question && (
                  <FormText color='danger'>
                    <Label className='text-danger'>{errors.question}</Label>
                  </FormText>
                )}
              </FormGroup>
              <div className='mb-3'>
                <Label>Add an image to this question</Label>
                {currentQuestionPhoto && (
                  <div className='d-flex flex-column justify-content-center'>
                    <div>
                      <img
                        src={currentQuestionPhoto && URL.createObjectURL(currentQuestionPhoto)}
                        style={{ borderRadius: '5px', width: '100%' }}
                      />
                    </div>
                  </div>
                )}
                <Dropzone
                  className='w-100 p-1 btn btn-primary'
                  text={'Add question image'}
                  centered
                  onUpload={(files) => {
                    if (!files[0]) return
                    setCurrentQuestionPhoto(files[0])
                  }}
                  accept='image/*'
                  max={1}
                  onRemove={() => {
                    setCurrentQuestionPhoto(null)
                  }}
                />
              </div>
              <Label>Add choices</Label>
              <FieldArray
                name='choices'
                render={(arrayHelpers) => (
                  <div>
                    <InputGroup className='mb-2'>
                      <StyledInput
                        type='text'
                        name={'newChoiceValue'}
                        value={values.newChoiceValue}
                        bsSize='sm'
                        onChange={handleChange}
                        autoFocus
                      />
                      <InputGroupAddon>
                        <Button
                          color='link'
                          bsSize='sm'
                          size='sm'
                          onClick={() => {
                            if (values.newChoiceValue) {
                              arrayHelpers.push(values.newChoiceValue)
                              setFieldValue('newChoiceValue', '')
                            }
                          }}
                        >
                          ADD
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {touched.choices && errors.choices && (
                      <FormText color='danger'>
                        <Label className='text-danger'>{errors.choices}</Label>
                      </FormText>
                    )}
                    {touched.correctAnswers && errors.correctAnswers && (
                      <FormText color='danger'>
                        <Label className='text-danger'>{errors.correctAnswers}</Label>
                      </FormText>
                    )}
                    {values.choices && values.choices.length > 0 ? (
                      values.choices.map((_, index) => (
                        <div key={index}>
                          <FormGroup className='px-3 d-flex'>
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className={'pt-1 '.concat(
                                values.correctAnswers[index] ? 'text-success' : 'text-warning'
                              )}
                              onClick={(event) => {
                                const correctAnswers = values.correctAnswers
                                correctAnswers[index] = !correctAnswers[index]
                                setFieldValue('correctAnswers', correctAnswers)
                              }}
                            />
                            <div className='w-100 ml-3'>{values.choices[index]}</div>
                            <FontAwesomeIcon
                              icon={faTimes}
                              className='pt-1 text-info'
                              onClick={() => {
                                const correctAnswers = values.correctAnswers
                                correctAnswers.splice(index, 1)
                                setFieldValue('correctAnswers', correctAnswers)
                                arrayHelpers.remove(index)
                                setTouched('choices', false)
                              }}
                            />
                          </FormGroup>
                        </div>
                      ))
                    ) : (
                      <CenterText className='px-4'>
                        <Label>
                          No Choices added yet. At least 2 choices are required for a question
                        </Label>
                      </CenterText>
                    )}
                    {values.choices.length ? (
                      <CenterText>
                        <Label className='px-4'>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className={'pt-1 '.concat('text-success')}
                          />
                          Tick the checkbox of the correct choices
                        </Label>
                      </CenterText>
                    ) : null}
                  </div>
                )}
              />
              <Button color='primary' onClick={handleSubmit} className='w-100' size='lg'>
                Add Question
              </Button>
              {/* <div className='w-100 mt-3'>
              </div> */}
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
            size='lg'
            onClick={async () => {
              await publishTopic({
                variables: {
                  topicId: topic.id,
                  isPublished: !topic.is_published
                }
              })
              await refetchTopic()
            }}
          >
            {topic.is_published ? 'Unpublish' : 'Publish'}
          </Button>
          <hr />
        </>
      ) : (
        <Label>
          In order to publish a topic, it must at least have <strong>10 questions</strong> first
        </Label>
      )}
      <CurrentQuestionsSection>
        <PageLabel>{numberOfQuestions} Questions</PageLabel>
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
            <DejavuCard key={`questions:${index}`}>
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
              {question.img_url && (
                <Img
                  src={[question.img_url, 'http://via.placeholder.com/300x300']}
                  alt='question img'
                  style={{ borderRadius: '5px', width: '100%' }}
                />
              )}
              <strong>{question.question}</strong>
              <br />
              <Label>correct answers</Label>
              <br />
              {correctAnswers}
              <br />
              <Label>wrong answers</Label>
              <br />
              {dummyAnswers}
            </DejavuCard>
          )
        })}
      </CurrentQuestionsSection>
      {field && (
        <CurrentQuestionsSection>
          <PageLabel>Select from your previous questions</PageLabel>
          {previousQuestions &&
            previousQuestions.map((question, index) => {
              const dummyAnswers = question.answers
                .filter((answer) => !answer.is_correct)
                .map((answer) => answer.answer)
                .join(', ')
              const correctAnswers = question.answers
                .filter((answer) => answer.is_correct)
                .map((answer) => answer.answer)
                .join(', ')
              return (
                <DejavuCard
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
                  <strong>{question.question}</strong>
                  <br />
                  <Label>correct answers</Label>
                  <br />
                  {correctAnswers}
                  <br />
                  <Label>wrong answers</Label>
                  <br />
                  {dummyAnswers}
                </DejavuCard>
              )
            })}
        </CurrentQuestionsSection>
      )}
    </StyledForm>
  )
}

export default compose(
  withRouter,
  withFirebase()
)(AddQuestions)
