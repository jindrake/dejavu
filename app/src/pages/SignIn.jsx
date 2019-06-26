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
      onSubmit={(values, { setSubmitting, setStatus }) => {
        console.log(values)
        setSubmitting(true)
        firebase
          .doSignInWithEmailAndPassword(values.loginEmail, values.loginPassword)
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
            <Form isSubmitting={isSubmitting}>
              <Close onClick={() => history.push('/')}><Icon name='close' /></Close>
              <Title>Hello, study buddy!</Title>
              {status && <Alert {...status} />}
              <FormGroup>
                <Label htmlFor='login email'>
                  Email {touched.loginEmail && errors.loginEmail && <Hint>{errors.loginEmail}</Hint>}
                </Label>
                <Input
                  type='email'
                  name='loginEmail'
                  data-cy='email'
                  onChange={handleChange}
                  invalid={errors.loginEmail && touched.loginEmail}
                  value={values.loginEmail}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor='login password'>
                  Password {touched.loginPassword && errors.loginPassword && <Hint>{errors.loginPassword}</Hint>}
                </Label>
                <Input
                  type='password'
                  name='loginPassword'
                  data-cy='password'
                  onChange={handleChange}
                  value={values.loginPassword}
                  invalid={errors.loginPassword && touched.loginPassword}
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

const Close = styled.div`
  position: absolute;
  color: #E8EAF6;
  opacity: 0.5;
  right: 0;
  top: 0;
`

const Title = styled.div`
  font-size: 20px;
  line-height: 20px;
  font-weight: 900;
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
  div {
    margin-left: 10px;
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
