import React, { useState } from 'react'
import { Formik } from 'formik'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import uuid from 'uuid/v4'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Button, Input, Form, FormGroup, Label } from 'reactstrap'

import styled from 'styled-components'

import Alert from '../../components/Alert'
import { TopSection, FaIcon } from '../../components'

const CREATE_FEEDBACK = gql`
  mutation createFeedback($feedback: [feedback_insert_input!]!) {
    insert_feedback(objects: $feedback) {
      affected_rows
    }
  }
`

const Feedback = ({ createFeedback, user, history }) => {
  const [good, setGood] = useState(false)
  const [bad, setBad] = useState(false)

  return (
    <Formik
      initialValues={{
        rating: '',
        message: ''
      }}
      validate={(values) => {
        let errors = {}
        if (!values.rating) {
          errors.rating = 'Field required!'
        }
        if (!values.message) {
          errors.message = 'Field required'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting, setStatus }) => {
        setSubmitting(true)
        createFeedback({
          variables: {
            feedback: {
              id: uuid(),
              content: `${values.rating} ${values.message}`,
              user_id: user.id
            }
          }
        })
          .then((res) => {
            setSubmitting(false)
          })
          .catch((error) => {
            setSubmitting(false)
            setStatus({ type: 'error', text: error.message })
          })
      }}
      render={({
        values,
        errors,
        status,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting
      }) => {
        return (
          <Form>
            <TopSection>
              <div onClick={() => history.goBack()}>
                <FaIcon icon={faArrowLeft} />
              </div>
            </TopSection>
            <div className='text-center'>FEEDBACK</div>
            {/* <FeedbackClose onClick={() => history.push('/')}>
              <Icon name='close' />
            </FeedbackClose> */}
            <hr />
            <FormGroup>
              <Label>How would you rate your experience?</Label>
              <div className='d-flex flex-row justify-content-center'>
                {/* <Button
                  onClick={() => {
                    values.rating = 'Good'
                  }}
                  // type='primary'
                  text='It was great!'
                /> */}
                <Button
                  color={good ? 'success' : 'primary'}
                  onClick={() => {
                    setGood(true)
                    setBad(false)
                    values.rating = 'Good'
                  }}
                  size='sm'
                  className='pl-4 pr-4 mr-3'
                >
                    It was great!
                </Button>
                <br />
                {/* <Button
                  onClick={() => {
                    values.rating = 'Bad'
                  }}
                  // type='action'
                  text='It needs improvement'
                /> */}
                <Button
                  color={bad ? 'danger' : 'primary'}
                  onClick={() => {
                    setGood(false)
                    setBad(true)
                    values.rating = 'Bad'
                  }}
                  size='sm'
                >
                  It needs improvement
                </Button>
              </div>
            </FormGroup>
            <hr />
            {/* <ErrorText text={errors.rating && touched.rating} /> */}
            <FormGroup>
              <Label>Tell us more on how we can improve the app</Label>
              <FeedbackText
                name='message'
                id='message'
                type='textarea'
                placeholder='Your Suggestions'
                onChange={handleChange}
                value={values.message}
                invalid={errors.message && touched.message}
              />
              {/* <ErrorText text={errors.message && touched.message} /> */}
            </FormGroup>
            {status && <Alert {...status} />}
            <FeedbackSubmitDiv>
              {/* <FeedbackNewButton
                text={isSubmitting ? 'Submitting...' : 'Submit'}
                type='action'
                onClick={handleSubmit}
              /> */}
              <Button
                color='primary'
                onClick={handleSubmit}
                size='lg w-100'
              >
                Submit
              </Button>
            </FeedbackSubmitDiv>
          </Form>
        )
      }}
    />
  )
}

const FeedbackText = styled(Input)`
  background: white;
  boder: 2px solid grey;
  border-radius: 5px;
`

const FeedbackSubmitDiv = styled(FormGroup)`
  display: flex;
  justify-content: center;
`

// const FeedbackLabel = styled.div`
//   /* font-size: .75em; */
//   text-align: center;
//   margin-bottom: 10px;
// `

export default compose(
  withRouter,
  graphql(CREATE_FEEDBACK, { name: 'createFeedback' })
)(Feedback)
