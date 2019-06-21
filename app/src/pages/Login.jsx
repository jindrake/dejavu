import React from 'react'
import { compose } from 'react-apollo'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import ErrorText from '../components/ErrorText'
import { withFirebase } from '../hocs'
import { withRouter } from 'react-router-dom'

const Login = ({ firebase, history }) => {
  return (
    <Formik
      initialValues={{
        loginEmail: '',
        loginPassword: ''
      }}
      validationSchema={yup.object().shape({
        loginEmail: yup
          .string()
          .email('Invalid email')
          .required('Required'),
        loginPassword: yup
          .string()
          .min(8, 'Password must be at least 8 characters')
          .required('Required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values)
        setSubmitting(true)
        firebase
          .doSignInWithEmailAndPassword(values.loginEmail, values.loginPassword)
          .then(() => {})
          .catch((error) => {
            setSubmitting(false)
            console.error('Login error:', error)
          })
      }}
    >
      {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => {
        console.log(errors, touched)
        return (
          <Form>
            LOGIN
            <FormGroup row>
              <Label for='login email' sm={2}>
                Email
                <ErrorText text={touched.loginEmail && errors.loginEmail} />
              </Label>
              <Col sm={10}>
                <Input
                  type='email'
                  name='loginEmail'
                  data-cy='email'
                  onChange={handleChange}
                  invalid={errors.loginEmail && touched.loginEmail}
                  value={values.loginEmail}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for='login password' sm={2}>
                Password
                <ErrorText text={touched.loginPassword && errors.loginPassword} />
              </Label>
              <Col sm={10}>
                <Input
                  type='password'
                  name='loginPassword'
                  data-cy='password'
                  onChange={handleChange}
                  value={values.loginPassword}
                  invalid={errors.loginPassword && touched.loginPassword}
                />
              </Col>
            </FormGroup>
            <Button data-cy='submit' onClick={handleSubmit}>
              {isSubmitting ? 'Submitting...' : 'LOGIN'}
            </Button>
            <Button
              color='link'
              onClick={() => {
                history.push('/signup')
              }}
            >
              Don't have an account? Sign up
            </Button>
          </Form>
        )
      }}
    </Formik>
  )
}

export default compose(
  withFirebase(),
  withRouter
)(Login)
