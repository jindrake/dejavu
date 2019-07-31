import React from 'react'
import styled from 'styled-components'
import { compose } from 'react-apollo'
import { Formik } from 'formik'
import * as yup from 'yup'
import { withFirebase } from '../hocs'
import { withRouter } from 'react-router-dom'

import Button from '../components/Button'
import Icon from '../components/Icon'
import Alert from '../components/Alert'
import { StyledInput, FormWrapper, Title, OverlayLoader } from '../components'

const SignIn = ({ firebase, history, ...rest }) => {
  console.log(rest)
  return (
    <Formik
      initialValues={{
        signInEmail: '',
        signInPassword: ''
      }}
      validationSchema={yup.object().shape({
        signInEmail: yup
          .string()
          .email('Invalid email')
          .required('Required'),
        signInPassword: yup
          .string()
          .min(8, 'Password must be at least 8 characters')
          .required('Required')
      })}
      onSubmit={(values, { setSubmitting, setStatus }) => {
        console.log(values)
        setSubmitting(true)
        firebase
          .doSignInWithEmailAndPassword(values.signInEmail, values.signInPassword)
          .then(() => {})
          .catch((error) => {
            setSubmitting(false)
            console.error(error)
            if (error && error.code === 'auth/user-not-found') {
              setStatus({ type: 'error', text: 'Email and password combination not found' })
            } else {
              setStatus({ type: 'error', text: error.message })
            }
          })
      }}
    >
      {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, status }) => {
        return (
          <FormWrapper>
            {isSubmitting && <OverlayLoader />}
            <Form isSubmitting={isSubmitting}>
              <Close onClick={() => history.push('/')}>
                <Icon name='close' />
              </Close>
              <Title>
                Welcome back,
                <br />
                study buddy!
              </Title>
              {status && <Alert {...status} data-cy='alert' />}
              <FormItem>
                <Label>
                  Email{' '}
                  {touched.signInEmail && errors.signInEmail && (
                    <Hint data-cy='sign-in-email-error'>{errors.signInEmail}</Hint>
                  )}
                </Label>
                <StyledInput
                  type='email'
                  name='signInEmail'
                  data-cy='email'
                  onChange={handleChange}
                  invalid={errors.signInEmail && touched.signInEmail}
                  value={values.signInEmail}
                />
              </FormItem>
              <FormItem>
                <Label>
                  Password{' '}
                  {touched.signInPassword && errors.signInPassword && (
                    <Hint data-cy='sign-in-password-error'>{errors.signInPassword}</Hint>
                  )}
                </Label>
                <StyledInput
                  type='password'
                  name='signInPassword'
                  data-cy='password'
                  onChange={handleChange}
                  value={values.signInPassword}
                  invalid={errors.signInPassword && touched.signInPassword}
                />
              </FormItem>
              <ButtonGroup>
                <Button onClick={() => history.push('/sign-up')} text='No account? Sign up!' />
                <Button data-cy='submit' onClick={handleSubmit} text='Sign in' type='primary' />
              </ButtonGroup>
            </Form>
          </FormWrapper>
        )
      }}
    </Formik>
  )
}

const Close = styled.div`
  position: absolute;
  font-size: 20px;
  color: #e8eaf6;
  opacity: 0.5;
  right: 0;
  top: 0;
`

const Label = styled.div`
  color: #e8eaf6;
  font-size: 12px;
`

const Hint = styled.span`
  color: #ef5350;
  margin-left: 6px;
`

const FormItem = styled.div`
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  div:first-child {
    margin-right: 10px;
  }
`

const Form = styled.form`
  position: relative;
  opacity: ${({ isSubmitting }) => (isSubmitting ? 0.25 : 1)};
  transition: 300ms;
`

export default compose(
  withFirebase(),
  withRouter
)(SignIn)
