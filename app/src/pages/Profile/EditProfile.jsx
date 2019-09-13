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
import Icon from '../../components/Icon'
// import Alert from '../../components/Alert'
import {
  StyledInput,
  FormWrapper,
  Title,
  StyledCheckbox,
  OverlayLoader,
  Button,
  FullPageLoader
} from '../../components'

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
const DELETE_USER_FIELD_RELATIONSHIP = gql`
  mutation deleteUserFieldRelationship($id: uuid!) {
    delete_user_field(where: { id: { _eq: $id }}) {
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
  // console.log(user.fields[0].field)
  const [, globalDispatch] = useStateValue()
  const { data, loading: fieldsLoading, error: fieldsError } = useQuery(FETCH_FIELDS)
  // const { data: mutationData, loading: mutationLoading, error: mutationError } = useMutation(
  //   UPDATE_USER
  // )
  // console.log(user.fields[0].has_finished)
  const fieldOfStudyId = user.fields[0].id
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
<<<<<<< HEAD
  if (mutationError) {
    console.error('error@editprofile:2')

    globalDispatch({
      networkError: mutationError.message
    })
  }
=======
>>>>>>> feat(Added query for edit user profile.):

  return (
    <Formik
      initialValues={{
        email: user.email,
        // password: '',
        // passwordConfirmation: '',
        firstName: user.first_name,
        lastName: user.last_name,
        fieldOfStudy: user.fields[0].field,
        isStudent: user.fields[0].has_finished
        // isStudent: false,
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
            console.log('RES: ', res)
            if (values.fieldOfStudy !== user.fields[0].field || values.isStudent !== user.fields[0].has_finished) {
              console.log('UPDATE!')
              console.log(getObjectValue(res, 'data.update_user.returning[0].id'))
              deleteUserTopicRelationship({
                variables: {
                  id: fieldOfStudyId
                }
              })
              return createUserTopicRelationship({
                variables: {
                  userField: {
                    id: uuid(),
                    field: values.fieldOfStudy,
                    user_id: getObjectValue(res, 'data.update_user.returning[0].id'),
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
              <Title>Edit Profile Settings</Title>
              <TwinItems>
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
              {/* <FormItem>
                <Label>
                  Password
                  {touched.password && errors.password && <Hint>{errors.password}</Hint>}
                </Label>
                <StyledInput
                  type='password'
                  name='password'
                  data-cy='password'
                  onChange={handleChange}
                  invalid={errors.password && touched.password}
                  value={values.password}
                />
              </FormItem> */}
              {/* <FormItem>
                <Label>
                  Confirm password
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
              </FormItem> */}
              <ButtonGroup>
                <Button onClick={() => history.push('/profile')} text='Cancel' />
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

export default compose(
  withRouter,
  withFirebase(),
  graphql(UPDATE_USER, { name: 'updateUser' }),
  graphql(DELETE_USER_FIELD_RELATIONSHIP, { name: 'deleteUserTopicRelationship' }),
  graphql(CREATE_USER_FIELD_RELATIONSHIP, { name: 'createUserTopicRelationship' })
)(EditProfile)
