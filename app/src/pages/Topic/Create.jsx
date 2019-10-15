import React from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { FormGroup, Label } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import uuid from 'uuid/v4'
import {
  StyledInput,
  Title,
  OverlayLoader,
  FormWrapper,
  Button
} from '../../components'
import Alert from '../../components/Alert'
import { getObjectValue, useStateValue } from '../../libs'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'

const FETCH_FIELDS = gql`
  query fetchFields {
    enum_field(order_by: { field: asc }) {
      field
    }
  }
`

const CREATE_TOPIC = gql`
  mutation createTopic($topic: topic_insert_input!) {
    insert_topic(objects: [$topic]) {
      returning {
        id
        name
        description
      }
    }
  }
`

const CREATE_TOPIC_FIELD_RELATIONSHIP = gql`
  mutation createTopicFieldRelationship($topicField: [topic_field_insert_input!]!) {
    insert_topic_field(objects: $topicField) {
      affected_rows
    }
  }
`

const CreateTopicScreen = ({ user, createTopic, history, createTopicFieldRelationship }) => {
  const [, globalDispatch] = useStateValue()
  const { data, loading, error } = useQuery(FETCH_FIELDS)
  if (error) {
    console.error('error@create:1')
    globalDispatch({
      networkError: error.message
    })
  }
  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
        isPrivate: false,
        fieldOfStudy: user.fields.length ? user.fields[0].field : ''
      }}
      validationSchema={yup.object().shape({
        name: yup
          .string()
          .min(3, 'Enter Title at least 3 characters')
          .required('Required'),
        description: yup.string(),
        isPrivate: yup.boolean(),
        fieldOfStudy: yup.string().required('Required')
      })}
      onSubmit={(values, { setSubmitting, setStatus }) => {
        setSubmitting(true)
        const topicId = uuid()
        createTopic({
          variables: {
            topic: {
              name: values.name,
              creator_id: user.id,
              description: values.description,
              id: topicId,
              is_private: values.isPrivate
            }
          }
        })
          .then((res) => {
            console.log(res)
            return createTopicFieldRelationship({
              variables: {
                topicField: {
                  id: uuid(),
                  field: values.fieldOfStudy,
                  topic_id: getObjectValue(res, 'data.insert_topic.returning[0].id')
                }
              }
            })
          })
          .then((res) => {
            console.log(res)
            setSubmitting(false)
            history.push(`/topic/${topicId}/questions`)
          })
          .catch((error) => {
            setSubmitting(false)
            console.log(error.message)
            setStatus({ type: 'error', text: error.message })
          })
        console.log(values)
      }}
    >
      {({
        values,
        status,
        errors,
        setFieldValue,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
        setStatus
      }) => {
        return (
          <FormWrapper>
            {(isSubmitting || loading) && <OverlayLoader />}
            <Title>Create a topic</Title>
            <FormGroup>
              <Label for='name'>
                <div>Title</div>
              </Label>
              <StyledInput
                type='text'
                name='name'
                placeholder='Enter title here ..'
                value={values.name}
                onChange={(e) => {
                  setFieldValue('name', e.target.value)
                }}
                invalid={errors.name && touched.name}
              />
            </FormGroup>
            <FormGroup>
              <Label for='description'>
                <div>Description</div>
              </Label>
              <StyledInput
                type='textarea'
                name='description'
                placeholder='Enter description here ..'
                values={values.description}
                onChange={handleChange}
                invalid={errors.description && touched.description}
              />
            </FormGroup>
            <FormGroup>
              <Label for='fieldOfStudy'>
                <div>Target field</div>
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
            </FormGroup>
            {status && <Alert {...status} />}
            <Button data-cy='submit' onClick={handleSubmit} text='Proceed' />
          </FormWrapper>
        )
      }}
    </Formik>
  )
}

export default compose(
  withRouter,
  graphql(CREATE_TOPIC, { name: 'createTopic' }),
  graphql(CREATE_TOPIC_FIELD_RELATIONSHIP, { name: 'createTopicFieldRelationship' })
)(CreateTopicScreen)
