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

const SignIn = ({ firebase, history }) => {
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
            setStatus({ type: 'error', text: error.message })
          })
      }}
    >
      {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, status }) => {
        console.log(errors, touched, status)
        return (
          <Wrapper>
            {isSubmitting && <Loader>Loading...</Loader>}
            <Form isSubmitting={isSubmitting}>
              <Close onClick={() => history.push('/')}><Icon name='close' /></Close>
              <Title>Welcome back,<br />study buddy!</Title>
              {status && <Alert {...status} />}
              <FormGroup>
                <Label>
                  Email {touched.signInEmail && errors.signInEmail && <Hint>{errors.signInEmail}</Hint>}
                </Label>
                <Input
                  type='email'
                  name='signInEmail'
                  data-cy='email'
                  onChange={handleChange}
                  invalid={errors.signInEmail && touched.signInEmail}
                  value={values.signInEmail}
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  Password {touched.signInPassword && errors.signInPassword && <Hint>{errors.signInPassword}</Hint>}
                </Label>
                <Input
                  type='password'
                  name='signInPassword'
                  data-cy='password'
                  onChange={handleChange}
                  value={values.signInPassword}
                  invalid={errors.signInPassword && touched.signInPassword}
                />
              </FormGroup>
              <ButtonGroup>
                <Button
                  onClick={() => history.push('/sign-up')}
                  text='No account? Sign up for free!'
                />
                <Button
                  data-cy='submit'
                  onClick={handleSubmit}
                  text='Sign in'
                  type='primary'
                />
              </ButtonGroup>
            </Form>
          </Wrapper>
        )
      }}
    </Formik>
  )
}

const Loader = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  color: #E8EAF6;
  font-size: 12px;
  height: 100%;
  width: 100%;
`

const Close = styled.div`
  position: absolute;
  font-size: 20px;
  color: #E8EAF6;
  opacity: 0.5;
  right: 0;
  top: 0;
`

const Title = styled.div`
  font-size: 24px;
  line-height: 24px;
  font-weight: 700;
  color: #E8EAF6;
`

const Input = styled.input`
  margin-top: 6px;
  font-size: 12px;
  height: 36px;
  color: #1A237E;
  padding-left: 12px;
  padding-right: 12px;
  background: linear-gradient(#e8eaf6, #c5cae9);
  border-radius: 6px;
  border: none;
  outline: none;
  :focus {
    background: #e8eaf6;
  };
`

const Label = styled.div`
  color: #E8EAF6;
  font-size: 12px;
`

const Hint = styled.span`
  color: #EF5350;
  margin-left: 6px;
`

const FormGroup = styled.div`
  margin-top: 20px; 
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

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  left: 40px;
  right: 40px;
`

const Form = styled.form`
  position: relative;
  opacity: ${({ isSubmitting }) => isSubmitting ? 0.5 : 1};
  transition: 300ms;
`

export default compose(
  withFirebase(),
  withRouter
)(SignIn)
