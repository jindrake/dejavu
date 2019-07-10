import React from 'react'
import styled from 'styled-components'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import uuid from 'uuid/v4'

import Alert from '../../components/Alert'
import ErrorText from '../../components/ErrorText'

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

const CreateTopicScreen = ({ user, createTopic, history }) => {
  console.log(user)
  console.log('Hello topic screen')
  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
        isPrivate: false,
        uri: ''
      }}
      validationSchema={yup.object().shape({
        name: yup
          .string()
          .min(3, 'Enter Title at least 3 characters')
          .required('Required'),
        description: yup.string().required('Required'),
        isPrivate: yup.boolean().required('Required'),
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
              uri: values.uri
            }
          }
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
        setValues,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting
      }) => {
        return (
          <Form>
            <Header>Create Topic Screen</Header>
            <FormGroup>
              <Label for='name'>
                <SubHeader>Title</SubHeader>
              </Label>
              <Input
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
              <ErrorText text={touched.name && errors.name} />
            </FormGroup>
            <FormGroup>
              <Label for='description'>
                <SubHeader>Description</SubHeader>
              </Label>
              <Input
                type='textarea'
                name='description'
                placeholder='Enter description here ..'
                values={values.description}
                onChange={handleChange}
                invalid={errors.description && touched.description}
              />
              <ErrorText text={touched.description && errors.description} />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type='checkbox' /> <SubHeader>make topic private</SubHeader>
              </Label>
              <FormText color='white'>
                Private topics are exclusive only to users with a special link to the topic
              </FormText>
            </FormGroup>
            {status && <Alert {...status} />}
            <Button data-cy='submit' onClick={handleSubmit}>
              {isSubmitting ? 'Submitting...' : 'Proceed'}
            </Button>
          </Form>
        )
      }}
    </Formik>
  )
}

const Header = styled.div`
  color: #e8eaf6;
  font-size: 12;
`
const SubHeader = styled.div`
  color: #f2b202;
  font-size: 12;
`

export default compose(
  withRouter,
  graphql(CREATE_TOPIC, { name: 'createTopic' })
)(CreateTopicScreen)
