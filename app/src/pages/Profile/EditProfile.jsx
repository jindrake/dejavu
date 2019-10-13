import React from 'react'
import styled from 'styled-components'
import withFirebase from '../../hocs/withFirebase'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'
import { Formik } from 'formik'
import * as yup from 'yup'
import uuid from 'uuid/v4'
import { withRouter } from 'react-router-dom'
import { useStateValue, getObjectValue } from '../../libs'
import gql from 'graphql-tag'
import {
  StyledInput,
  FormWrapper,
  StyledCheckbox,
  OverlayLoader,
  Button,
  FullPageLoader,
  Icon,
  Label,
  Header
} from '../../components'

const FETCH_FIELDS = gql`
  query fetchFields {
    enum_field(order_by: { field: asc }) {
      field
    }
  }
`

const UPDATE_USER = gql`
  mutation updateUser(, $id: uuid!, $user: user_set_input) {
    update_user (_set: $user, where: {id: {_eq: $id}}) {
      returning {
        id
      }
    }
  }
`
const FETCH_USER = gql`
  query fetchUser($userId: uuid!) {
    user(where: { id: { _eq: $userId } }) {
      email
      first_name
      last_name
      id
      fields {
        field
        id
        has_finished
      }
    }
  }
`

const DELETE_USER_FIELD_RELATIONSHIP = gql`
  mutation deleteUserFieldRelationship($userId: uuid!) {
    delete_user_field(where: { user_id: { _eq: $userId }}) {
      affected_rows
    }
  }
`
const CREATE_USER_FIELD_RELATIONSHIP = gql`
  mutation insertUserFieldRelationship($userField: [user_field_insert_input!]!) {
    insert_user_field(objects: $userField) {
      affected_rows
    }
  }
`

const EditProfile = ({ firebase, user, history, updateUser, deleteUserTopicRelationship, createUserTopicRelationship }) => {
  console.log('EDIT PROFILE PAGE')
  console.log(user)
  const [, globalDispatch] = useStateValue()
  const { data, loading: fieldsLoading, error: fieldsError } = useQuery(FETCH_FIELDS)

  const { data: userData, loading, error } = useQuery(FETCH_USER, {
    variables: {
      userId: user.id
    }
  })
  // console.log('DATA:', userData.user)
  // console.log(getObjectValue(userData, 'user[0]'))
  const currentUser = getObjectValue(userData, 'user[0]')
  console.log(currentUser)
  // const { data: mutationData, loading: mutationLoading, error: mutationError } = useMutation(
  //   UPDATE_USER
  // )
  // console.log(user.fields[0].has_finished)
  // const fieldOfStudyId = user.fields[0].id
  // console.log(fieldOfStudyId)
  if (fieldsLoading) {
    return <FullPageLoader />
  }
  if (fieldsError) {
    console.error('error@editprofile:1')

    globalDispatch({
      networkError: fieldsError.message
    })
    return null
  }

  if (loading) {
    return <FullPageLoader />
  }
  if (error) {
    console.error('error@editprofile:1')

    globalDispatch({
      networkError: error.message
    })
    return null
  }

  return (
    <Formik
      initialValues={{
        email: currentUser.email,
        // password: '',
        // passwordConfirmation: '',
        firstName: currentUser.first_name,
        lastName: currentUser.last_name,

        fieldOfStudy: currentUser.fields[0].field,
        isStudent: currentUser.fields[0].has_finished
      }}
      validationSchema={yup.object().shape({
        email: yup
          .string()
          .email('Invalid email')
          .required('Required'),
        // password: yup
        //   .string()
        //   .min(8, 'Password must be at least 8 characters')
        //   .required('Required'),
        // passwordConfirmation: yup
        //   .string()
        //   .oneOf([yup.ref('password'), null], 'Passwords must match')
        //   .required('Required'),
        firstName: yup.string().required('Required'),
        lastName: yup.string().required('Required'),
        fieldOfStudy: yup.string().required('Required')
      })}
      onSubmit={(values, { setSubmitting, setStatus }) => {
        setSubmitting(true)
        console.log('Values:', values)
        updateUser({
          variables: {
            id: user.id,
            user: {
              first_name: values.firstName,
              last_name: values.lastName
            }
          }
        })
          .then((res) => {
            const resultId = getObjectValue(res, 'data.update_user.returning[0].id')
            if (values.fieldOfStudy !== currentUser.fields[0].field || values.isStudent !== currentUser.fields[0].has_finished) {
              deleteUserTopicRelationship({
                variables: {
                  userId: resultId
                }
              })

              return createUserTopicRelationship({
                variables: {
                  userField: {
                    id: uuid(),
                    field: values.fieldOfStudy,
                    user_id: resultId,
                    has_finished: values.isStudent
                  }
                }
              })
            }
            return res
          })
          .then((res) => {
            setSubmitting(false)
            console.log('RESSSSS:', res)
            history.goBack()
          })
          .catch((err) => {
            setSubmitting(false)
            console.log(err.message)
            setStatus({ type: 'error', text: err.message })
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
            {isSubmitting && <OverlayLoader />}
            <Form isSubmitting={isSubmitting}>
              <Close onClick={() => history.push('/profile')}>
                <Icon name='close' />
              </Close>
              <Header>Edit Profile Settings</Header>
              <TwinItems className='mt-2'>
                <FormItem>
                  <Label>
                    First name
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
                    Last name
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
                <Label>
                  Email
                  {touched.email && errors.email && <Hint>{errors.email}</Hint>}
                </Label>
                <StyledInput
                  type='email'
                  name='email'
                  data-cy='email'
                  onChange={handleChange}
                  invalid={errors.email && touched.email}
                  value={`${values.email} (disabled)`}
                  disabled
                />
              </FormItem>
              <FormItem>
                <Label>
                  Field of study
                  {touched.fieldOfStudy && errors.fieldOfStudy && (
                    <Hint data-cy='select-field-of-study'>{errors.fieldOfStudy}</Hint>
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
                    checked={values.isStudent}
                    // value={values.isStudent}
                    onChange={(event) => {
                      setFieldValue('isStudent', event.target.checked)
                    }}
                    label='are you currently a student?'
                  />
                )}
              </FormItem>
              <ButtonGroup>
                <Button onClick={() => history.goBack()} text='Cancel' type='action' />
                <Button
                  data-cy='submit-button'
                  onClick={handleSubmit}
                  text='Update Profile'
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
  withFirebase(),
  graphql(UPDATE_USER, { name: 'updateUser' }),
  graphql(DELETE_USER_FIELD_RELATIONSHIP, { name: 'deleteUserTopicRelationship' }),
  graphql(CREATE_USER_FIELD_RELATIONSHIP, { name: 'createUserTopicRelationship' })
)(EditProfile)
