import React from 'react'
import styled from 'styled-components'
import withFirebase from '../hocs/withFirebase'
import { compose, graphql } from 'react-apollo'
import { Formik } from 'formik'
import * as yup from 'yup'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import uuid from 'uuid/v4'

import Button from '../components/Button'
import Icon from '../components/Icon'
import Alert from '../components/Alert'

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
          .oneOf([yup.ref('password'), null], 'Passwords must match')
          .required('Required'),
        firstName: yup.string().required('Required'),
        lastName: yup.string().required('Required')
      })}
      onSubmit={(values, { setSubmitting, setStatus }) => {
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
            setStatus({ type: 'error', text: error.message })
          })
      }}
    >
      {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, status }) => {
        return (
          <Wrapper>
            {isSubmitting && <Loader>Loading...</Loader>}
            <Form isSubmitting={isSubmitting}>
              <Close onClick={() => history.push('/')}>
                <Icon name='close' />
              </Close>
              <Title>
                Let's be
                <br />
                study buddies!
              </Title>
              {status && <Alert {...status} />}
              <TwinItems>
                <FormItem>
                  <Label>
                    First name{' '}
                    {touched.firstName && errors.firstName && <Hint>{errors.firstName}</Hint>}
                  </Label>
                  <Input
                    type='text'
                    name='firstName'
                    data-cy='first-name'
                    onChange={handleChange}
                    invalid={errors.firstName && touched.firstName}
                    value={values.firstName}
                  />
                </FormItem>
                <FormItem>
                  <Label>
                    Last name {touched.lastName && errors.lastName && <Hint>{errors.lastName}</Hint>}
                  </Label>
                  <Input
                    type='text'
                    name='lastName'
                    data-cy='last-name'
                    onChange={handleChange}
                    invalid={errors.lastName && touched.lastName}
                    value={values.lastName}
                  />
                </FormItem>
              </TwinItems>
              <FormItem>
                <Label>Email {touched.email && errors.email && <Hint>{errors.email}</Hint>}</Label>
                <Input
                  type='email'
                  name='email'
                  data-cy='email'
                  onChange={handleChange}
                  invalid={errors.email && touched.email}
                  value={values.email}
                />
              </FormItem>
              <FormItem>
                <Label>
                  Password {touched.password && errors.password && <Hint>{errors.password}</Hint>}
                </Label>
                <Input
                  type='password'
                  name='password'
                  data-cy='password'
                  onChange={handleChange}
                  invalid={errors.password && touched.password}
                  value={values.password}
                />
              </FormItem>
              <FormItem>
                <Label>
                  Confirm password{' '}
                  {touched.passwordConfirmation && errors.passwordConfirmation && (
                    <Hint data-cy='confirm-password-error'>{errors.passwordConfirmation}</Hint>
                  )}
                </Label>
                <Input
                  type='password'
                  name='passwordConfirmation'
                  data-cy='password-confirmation'
                  onChange={handleChange}
                  invalid={errors.passwordConfirmation && touched.passwordConfirmation}
                  value={values.passwordConfirmation}
                />
              </FormItem>
              <ButtonGroup>
                <Button onClick={() => history.push('/sign-in')} text='Have an account? Sign in.' />
                <Button
                  data-cy='submit-button'
                  onClick={handleSubmit}
                  text='Sign up'
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
  color: #e8eaf6;
  font-size: 12px;
  height: 100%;
  width: 100%;
`

const Close = styled.div`
  position: absolute;
  font-size: 20px;
  color: #e8eaf6;
  opacity: 0.5;
  right: 0;
  top: 0;
`

const Title = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
  line-height: 24px;
  font-weight: 700;
  color: #e8eaf6;
`

const Input = styled.input`
  margin-top: 6px;
  font-size: 12px;
  height: 36px;
  width: 100%;
  color: #1a237e;
  padding-left: 12px;
  padding-right: 12px;
  background: linear-gradient(#e8eaf6, #c5cae9);
  border-radius: 6px;
  border: none;
  outline: none;
  :focus {
    background: #e8eaf6;
  }
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

const TwinItems = styled(FormItem)`
  flex-direction: row;
  margin-top: -10px;
  div:first-child input {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  div:last-child input {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
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
  withRouter,
  withFirebase(),
  graphql(CREATE_USER, { name: 'createUser' })
)(SignUp)
