import React from 'react'
import styled from 'styled-components'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Button, FormGroup, Label } from 'reactstrap'
import { compose, graphql, Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import uuid from 'uuid/v4'
import { StyledInput, Title, StyledCheckbox, OverlayLoader, FormWrapper } from '../../components'
import Alert from '../../components/Alert'
import { getObjectValue } from '../../libs'
// import ErrorText from '../../components/ErrorText'

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
        uri
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
  // const [globalState, globalDispatch] = useStateValue()
  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
        isPrivate: false,
        fieldOfStudy: user.fields.length ? user.fields[0].field : '',
        uri: ''
      }}
      validationSchema={yup.object().shape({
        name: yup
          .string()
          .min(3, 'Enter Title at least 3 characters')
          .required('Required'),
        description: yup.string().required('Required'),
        isPrivate: yup.boolean(),
        fieldOfStudy: yup.string().required('Required'),
        uri: yup.string().required('Required')
      })}
      onSubmit={(values, { setSubmitting, setStatus }) => {
        setSubmitting(true)
        createTopic({
          variables: {
            topic: {
              name: values.name,
              creator_id: user.id,
              description: values.description,
              id: uuid(),
              uri: values.uri,
              is_private: values.isPrivate
              // target_fields: {
              //   data: {
              //     field: values.fieldOfStudy,
              //     id: uuid()
              //   }
              // }
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
            history.push(`/topic/${values.uri}/questions`)
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
          <Query query={FETCH_FIELDS}>
            {({ data, loading, error }) => {
              if (error) {
                setStatus({ type: 'error', text: error })
              }
              return (
                <FormWrapper>
                  {(isSubmitting || loading) && <OverlayLoader />}
                  <Title>Create a topic</Title>
                  <FormGroup>
                    <Label for='name'>
                      <SubHeader>Title</SubHeader>
                    </Label>
                    <StyledInput
                      type='text'
                      name='name'
                      placeholder='Enter title here ..'
                      value={values.name}
                      onChange={(e) => {
                        setFieldValue('name', e.target.value)
                        const uri = `${e.target.value.toLowerCase().replace(/[\W\s^-]/g, '-')}`
                        const validateUri = uri.replace(/(-+|_+)/g, '')
                        setFieldValue('uri', `${validateUri}-${uuid().substr(0, 4)}`)
                      }}
                      invalid={errors.name && touched.name}
                    />
                    {/* <ErrorText text={touched.name && errors.name} /> */}
                  </FormGroup>
                  <FormGroup>
                    <Label for='description'>
                      <SubHeader>Description</SubHeader>
                    </Label>
                    <StyledInput
                      type='textarea'
                      name='description'
                      placeholder='Enter description here ..'
                      values={values.description}
                      onChange={handleChange}
                      invalid={errors.description && touched.description}
                    />
                    {/* <ErrorText text={touched.description && errors.description} /> */}
                  </FormGroup>
                  <FormGroup>
                    <Label for='fieldOfStudy'>
                      <SubHeader>Target field</SubHeader>
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
                  <FormGroup>
                    <StyledCheckbox
                      label='make topic private'
                      type='checkbox'
                      id='isPrivate'
                      name='isPrivate'
                      onChange={(event) => {
                        setFieldValue('isPrivate', event.target.checked)
                      }}
                      value={!!values.isPrivate}
                    />
                  </FormGroup>
                  {status && <Alert {...status} />}
                  <Button data-cy='submit' onClick={handleSubmit}>
                    {'Proceed'}
                  </Button>
                </FormWrapper>
              )
            }}
          </Query>
        )
      }}
    </Formik>
  )
}

const SubHeader = styled.div`
  color: #e8eaf6;
  font-size: 12;
`

export default compose(
  withRouter,
  graphql(CREATE_TOPIC, { name: 'createTopic' }),
  graphql(CREATE_TOPIC_FIELD_RELATIONSHIP, { name: 'createTopicFieldRelationship' })
)(CreateTopicScreen)
