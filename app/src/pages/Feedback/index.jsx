import React from 'react'
import { Input, Form, FormGroup } from 'reactstrap'
import { Formik } from 'formik'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import uuid from 'uuid/v4'
import styled from 'styled-components'

import Icon from '../../components/Icon'
import Alert from '../../components/Alert'
import { Button } from '../../components'

const CREATE_FEEDBACK = gql`
  mutation createFeedback($feedback: [feedback_insert_input!]!) {
    insert_feedback(objects: $feedback) {
      affected_rows
    }
  }
`

const Feedback = ({ createFeedback, user, history }) => {
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
            <Title>FEEDBACK</Title>
            <Close onClick={() => history.push('/')}>
              <Icon name='close' />
            </Close>
            <hr />
            <FormGroup>
              <Label>How would you rate your experience?</Label>
              <ButtonContainer>
                <NewButton
                  onClick={() => {
                    values.rating = 'Good'
                  }}
                  type='primary'
                  text='It was great!'
                />
                <br />
                <NewButton
                  onClick={() => {
                    values.rating = 'Bad'
                  }}
                  text='It needs improvement'
                />
              </ButtonContainer>
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
            <SubmitDiv>
              <NewButton
                text={isSubmitting ? 'Submitting...' : 'Submit'}
                type='primary'
                onClick={handleSubmit}
              />
            </SubmitDiv>
          </Form>
        )
      }}
    />
  )
}

const Title = styled.div`
  color: #e8eaf6;
  font-size: 1.25em;
  font-weight: 700;
  text-align: center;
`

const NewButton = styled(Button)`
  margin-bottom: 20px;
  width: 75%;
  display: flex;
  justify-content: center;
`

const ButtonContainer = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
`

const Close = styled.div`
  position: absolute;
  font-size: 20px;
  color: #e8eaf6;
  opacity: 0.5;
  right: .25em;
  top: .25em;
`

const FeedbackText = styled(Input)`
  background: linear-gradient(#e8eaf6, #c5cae9);
`

const SubmitDiv = styled(FormGroup)`
  display: flex;
  justify-content: center;
`

const Label = styled.div`
  color: #e8eaf6;
  font-size: .75em;
  text-align: center;
  margin-bottom: 10px;
`
export default compose(
  withRouter,
  graphql(CREATE_FEEDBACK, { name: 'createFeedback' })
)(Feedback)
