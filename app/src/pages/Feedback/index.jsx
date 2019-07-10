import React from 'react'
import { Input, Form, FormGroup, Label, Button } from 'reactstrap'
import { Formik } from 'formik'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import uuid from 'uuid/v4'

import Icon from '../../components/Icon'
import Alert from '../../components/Alert'
import ErrorText from '../../components/ErrorText'

const CREATE_FEEDBACK = gql`
  mutation createFeedback($feedback: [feedback_insert_input!]!) {
  insert_feedback (objects: $feedback) {
    affected_rows
  }
}
`

const Feedback = ({ createFeedback, user }) => {
  return (
    <Formik
      initialValues={{
        rating: '',
        message: ''
      }}
      validate={values => {
        let errors = {}
        if (!values.rating) {
          errors.rating = 'Field required!'
        }
        if (!values.message) {
          errors.message = 'Field required'
        }
        return errors
      }
      }
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
            console.log('Successfully Added', res)
            setSubmitting(false)
          })
          .catch((error) => {
            console.log('the error', error)
            setSubmitting(false)
            setStatus({ type: 'error', text: error.message })
          })
      }
      }
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
            <Label>
              Help us make this application better!
            </Label>
            <FormGroup>
              <Label>
                Did you have a great experience?
              </Label>
              <Button
                onClick={() => {
                  values.rating = 'Good'
                }}
              >
                <Icon name='thumb_up' />
                Yes! It was Great!
              </Button>
              <Button
                onClick={() => {
                  values.rating = 'Bad'
                }}
              >
                <Icon name='thumb_down' />
                No! It needs improvement.
              </Button>
            </FormGroup>
            <ErrorText text={errors.rating && touched.rating} />
            <FormGroup>
              <Label>
                Tell us more how can we improve the app :)
              </Label>
              <Input
                name='message'
                id='message'
                type='textarea'
                placeholder='Give us your feedback...'
                onChange={handleChange}
                value={values.message}
                invalid={errors.message && touched.message}
              />
              <ErrorText text={errors.message && touched.message} />
            </FormGroup>
            {status && <Alert {...status} />}
            <FormGroup>
              <Button
                data-cy='submit'
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </FormGroup>
          </Form>
        )
      }}
    />
  )
}

export default compose(
  withRouter,
  graphql(CREATE_FEEDBACK, { name: 'createFeedback' })
)(Feedback)
