import React from 'react'
import { Formik, FieldArray } from 'formik'
import { withRouter } from 'react-router-dom'
import { Button, Form, Input, FormGroup, Label, FormText, CustomInput } from 'reactstrap'
import styled from 'styled-components'
import { Mutation, Query, Subscription, compose } from 'react-apollo'
import uuid from 'uuid/v4'
import { getObjectValue } from '../../libs'
import { REMOVE_QUESTION, INSERT_QUESTION, FETCH_TOPIC, FETCH_TOPIC_QUESTIONS } from './queries'

// left the styled components here for now for easy restyling
const CurrentQuestionsSection = styled.div`
  padding: 5px;
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
  padding: 5px;
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
  user,
  history
}) => {
  return (
    <StyledForm>
      <Query query={FETCH_TOPIC} variables={{ uri: uri }}>
        {({ data, error, loading }) => {
          if (error) return <div>Error fetching topic: {error.message}</div>
          if (loading) return <div>loading topic...</div>
          const topic = getObjectValue(data, 'topic[0]')

          return (
            <Mutation mutation={INSERT_QUESTION}>
              {(insertQuestion, { data, error, loading }) => {
                if (loading) return <div>saving question...</div>
                if (error) return <div>Error: {error.message}</div>
                console.log('Data:', data)
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
                          console.log('mutation result:', result)
                          setSubmitting(false)
                        })
                        .catch((error) => {
                          console.log('mutation error:', error)
                          setSubmitting(false)
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
                          <Label>
                            Add Question{' '}
                            {touched.question && errors.question && <Hint>{errors.question}</Hint>}
                          </Label>
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
                            <Button color='success' outline onClick={handleSubmit}>
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
          )
        }}
      </Query>
      <CurrentQuestionsSection>
        Topic Questions
        <Subscription subscription={FETCH_TOPIC_QUESTIONS} variables={{ topicUri: uri }}>
          {({ data, error, loading }) => {
            if (error) return <div>Error fetching questions: {error.message}</div>
            if (loading) return <div>loading topic questions...</div>
            const topicQuestions = data.question_topic
            return (
              <Mutation mutation={REMOVE_QUESTION}>
                {(removeQuestion, { error }) => {
                  if (error) return <div>Remove Question Error: {error.message}</div>
                  return (
                    <>
                      {topicQuestions.map(({ question, index }) => {
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
        <RightText>
          <Button
            onClick={() => {
              history.push('/profile')
            }}
          >
            Done
          </Button>
        </RightText>
      </CurrentQuestionsSection>
    </StyledForm>
  )
}

export default compose(withRouter)(AddQuestions)
