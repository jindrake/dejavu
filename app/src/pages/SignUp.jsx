import React from 'react'
import styled from 'styled-components'
import withFirebase from '../hocs/withFirebase'
import compose from 'recompose/compose'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Formik } from 'formik'
import * as yup from 'yup'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import Alert from '../components/Alert'
import {
  StyledInput,
  FormWrapper,
  Title,
  StyledCheckbox,
  OverlayLoader,
  Button,
  FullPageLoader,
  Icon
} from '../components'
import { useStateValue } from '../libs'
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

const FETCH_FIELDS = gql`
  query fetchFields {
    enum_field(order_by: { field: asc }) {
      field
    }
  }
`

const SignUp = ({ firebase, history }) => {
  console.log('UR IN SIGNUP:')
  const [, globalDispatch] = useStateValue()
  const { data, loading: fieldsLoading, error: fieldsError } = useQuery(FETCH_FIELDS)
  const [createUser, { loading: createUserLoading }] = useMutation(CREATE_USER)

  if (fieldsLoading) {
    return <FullPageLoader />
  }
  if (fieldsError) {
    console.error('error@signup:1')
    globalDispatch({
      networkError: fieldsError.message
    })
    return null
  }

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        passwordConfirmation: '',
        firstName: '',
        lastName: '',
        fieldOfStudy: '',
        isStudent: true
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
        lastName: yup.string().required('Required'),
        fieldOfStudy: yup.string().required('Required')
      })}
      onSubmit={(values, { setSubmitting, setStatus }) => {
        setSubmitting(true)
        let firebaseUser = null
        firebase
          .doCreateUserWithEmailAndPassword(values.email, values.password)
          .then((result) => {
            firebaseUser = result.user
            return result.user.getIdTokenResult()
          })
          .then((idTokenResult) => {
            const hasuraClaim = idTokenResult.claims['https://hasura.io/jwt/claims']
            if (hasuraClaim && !createUserLoading) {
              console.warn('CREATING USER@1')
              window.localStorage.setItem('newUser', true)
              return createUser({
                variables: {
                  user: [
                    {
                      email: values.email,
                      first_name: values.firstName,
                      last_name: values.lastName,
                      id: hasuraClaim['x-hasura-user-id'],
                      fields: {
                        data: [
                          {
                            field: values.fieldOfStudy,
                            has_finished: values.isStudent,
                            id: uuid()
                          }
                        ]
                      }
                    }
                  ]
                }
              })
            } else {
              const metadataRef = firebase
                .database()
                .ref('metadata/' + firebaseUser.uid + '/refreshTime')

              metadataRef.on('value', async () => {
                // Force refresh to pick up the latest custom claims changes.
                // const token = await result.user.getIdToken(true)
                const idTokenResult = await firebaseUser.getIdTokenResult(true)
                const hasuraClaim = await idTokenResult.claims['https://hasura.io/jwt/claims']
                // if there's no hasuraClaim but token exists, maintain authState({loading: true}) state
                if (hasuraClaim && !createUserLoading) {
                  console.warn('CREATING USER@2')
                  try {
                    await createUser({
                      variables: {
                        user: [
                          {
                            email: values.email,
                            first_name: values.firstName,
                            last_name: values.lastName,
                            id: hasuraClaim['x-hasura-user-id'],
                            fields: {
                              data: [
                                {
                                  field: values.fieldOfStudy,
                                  has_finished: values.isStudent,
                                  id: uuid()
                                }
                              ]
                            }
                          }
                        ]
                      }
                    })
                    window.localStorage.setItem('newUser', true)
                  } catch (error) {
                    console.error('error@signup:2')
                    globalDispatch({
                      networkError: error.message
                    })
                  }
                }
              })
            }
          })
          .catch((error) => {
            setSubmitting(false)
            window.localStorage.removeItem('newUser')
            setStatus({ type: 'error', text: error.message })
          })
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
        status,
        setStatus,
        setFieldValue
      }) => {
        return (
          <FormWrapper>
            {(isSubmitting) && <OverlayLoader />}
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
                  <StyledInput
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
                    Last name{' '}
                    {touched.lastName && errors.lastName && <Hint>{errors.lastName}</Hint>}
                  </Label>
                  <StyledInput
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
                <StyledInput
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
                  Field of study{' '}
                  {touched.fieldOfStudy && errors.fieldOfStudy && (
                    <Hint data-cy='confirm-password-error'>{errors.fieldOfStudy}</Hint>
                  )}
                </Label>
                <StyledInput
                  type='select'
                  name='fieldOfStudy'
                  data-cy='field-of-study'
                  onChange={handleChange}
                  invalid={errors.fieldOfStudy && touched.fieldOfStudy}
                  value={values.fieldOfStudy}
                >
                  <option value='' />
                  {data.enum_field &&
                    data.enum_field.map(({ field }) => (
                      <option value={field} key={field}>
                        {field}
                      </option>
                    ))}
                </StyledInput>
                {values.fieldOfStudy && (
                  <StyledCheckbox
                    type='checkbox'
                    id={`isStudent`}
                    name={`isStudent`}
                    data-cy='is-student'
                    checked={!!values.isStudent}
                    onChange={(event) => {
                      setFieldValue('isStudent', event.target.checked)
                    }}
                    label='are you currently a student?'
                  />
                )}
              </FormItem>
              <FormItem>
                <Label>
                  Password {touched.password && errors.password && <Hint>{errors.password}</Hint>}
                </Label>
                <StyledInput
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
                <StyledInput
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

const Form = styled.form`
  position: relative;
  opacity: ${({ isSubmitting }) => (isSubmitting ? 0.5 : 1)};
  transition: 300ms;
`

export default compose(
  withRouter,
  withFirebase()
)(SignUp)
