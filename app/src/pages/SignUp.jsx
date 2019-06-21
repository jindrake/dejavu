import React from 'react'
import withFirebase from '../hocs/withFirebase'
import { compose, graphql } from 'react-apollo'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import ErrorText from '../components/ErrorText'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import uuid from 'uuid/v4'

const CREATE_USER = gql`
  mutation createUser($user: [user_insert_input!]!) {
    insert_user(objects: $user) {
      affected_rows
      returning {
        id
        first_name
        last_name
        email
      }
    }
  }
`

const SignUp = ({ firebase, history, createUser }) => {
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        passwordConfirmation: '',
        firstName: '',
        lastName: ''
      }}
      validationSchema={yup.object().shape({
        email: yup
          .string()
          .email('Invalid email')
          .required('Required'),
        password: yup
          .string()
          .min(8, 'Password must be at least 8 characters')
          .required('Required'),
        passwordConfirmation: yup
          .string()
          .oneOf([yup.ref('password'), null], 'Passwords must match'),
        firstName: yup.string().required('Required'),
        lastName: yup.string().required('Required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true)
        firebase
          .doCreateUserWithEmailAndPassword(values.email, values.password)
          .then(() => {
            return createUser({
              variables: {
                user: [
                  {
                    email: values.email,
                    first_name: values.firstName,
                    last_name: values.lastName,
                    id: uuid()
                  }
                ]
              }
            })
          })
          .catch((error) => {
            setSubmitting(false)
            console.error(error)
            // setStatus()
          })
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting
      }) => {
        return (
          <Form>
            SIGNUP
            <FormGroup row>
              <Label for='signup email' sm={2}>
                Email
                <ErrorText text={touched.email && errors.email} />
              </Label>
              <Col sm={10}>
                <Input
                  type='email'
                  name='email'
                  data-cy='email'
                  onChange={handleChange}
                  invalid={errors.email && touched.email}
                  value={values.email}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for='signup firstname' sm={2}>
                First name
                <ErrorText text={touched.firstName && errors.firstName} />
              </Label>
              <Col sm={10}>
                <Input
                  type='text'
                  name='firstName'
                  data-cy='first-name'
                  onChange={handleChange}
                  invalid={errors.firstName && touched.firstName}
                  value={values.firstName}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for='signup lastname' sm={2}>
                Last name
                <ErrorText text={touched.lastName && errors.lastName} />
              </Label>
              <Col sm={10}>
                <Input
                  type='text'
                  name='lastName'
                  data-cy='last-name'
                  onChange={handleChange}
                  invalid={errors.lastName && touched.lastName}
                  value={values.lastName}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for='signup password' sm={2}>
                Password
                <ErrorText text={touched.password && errors.password} />
              </Label>
              <Col sm={10}>
                <Input
                  type='password'
                  name='password'
                  data-cy='password'
                  onChange={handleChange}
                  value={values.password}
                  invalid={errors.password && touched.password}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for='signup confirmation password' sm={2}>
                Confirm password
                <ErrorText text={touched.passwordConfirmation && errors.passwordConfirmation} />
              </Label>
              <Col sm={10}>
                <Input
                  type='password'
                  name='passwordConfirmation'
                  data-cy='password-2'
                  onChange={handleChange}
                  value={values.passwordConfirmation}
                  invalid={errors.passwordConfirmation && touched.passwordConfirmation}
                />
              </Col>
            </FormGroup>
            <Button data-cy='submit' onClick={handleSubmit}>{isSubmitting ? 'Submitting...' : 'SIGNUP'}</Button>
            <Button
              color='link'
              onClick={() => {
                history.push('/login')
              }}
            >
              Already have an account? Login
            </Button>
          </Form>
        )
      }}
    </Formik>
  )
}

export default compose(
  withRouter,
  withFirebase(),
  graphql(CREATE_USER, { name: 'createUser' })
)(SignUp)
