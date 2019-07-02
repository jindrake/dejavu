import React from 'react'
import styled from 'styled-components'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import uuid from 'uuid/v4'

import Alert from '../../../components/Alert'
import ErrorText from '../../../components/ErrorText'

const CREATE_TOPIC = gql`
  mutation createTopic($topic: topic_insert_input!){
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

const CreateTopicScreen = ({ user, createTopic }) => {
  console.log(user)
  console.log('Hello topic screen')
  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
        isPrivate: '',
        uri: ''
      }}
      validationSchema={yup.object().shape({
        name: yup
          .string()
          .min(2, 'Enter Title at least 2 characters')
          .required('Required'),
        description: yup
          .string()
          .min(4, 'Description at least 4 characters')
          .required('Required'),
        isPrivate: yup
          .boolean()
          .required('Required'),
        uri: yup
          .string()
          .required('Required Please Click Generate')
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
          })
          .catch((error) => {
            setSubmitting(false)
            console.log(error.message)
            setStatus({ type: 'error', text: error.message })
          })
        console.log(values)
      }}
    >
      {({ values, status, errors, setValues, touched, handleChange, handleSubmit, isSubmitting }) => {
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
                onChange={handleChange}
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
            <FormGroup tag='fieldset'>
              <SubHeader>Private Topic?</SubHeader>
              <FormGroup check>
                <Label check>
                  <Input type='radio' name='isPrivate' value onChange={handleChange} />
                  <Header>True</Header>
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type='radio' name='isPrivate' value={false} onChange={handleChange} />
                  <Header>False</Header>
                </Label>
              </FormGroup>
              <ErrorText text={touched.isPrivate && errors.isPrivate} />
            </FormGroup>
            <FormGroup>
              <Label for='uri'>
                <SubHeader>URI</SubHeader>
                <Button
                  color='primary'
                  onClick={() => {
                    console.log('hellow')
                    values.uri = `dejavu.io/topic/${uuid()}`
                    setValues(values)
                  }}
                >
              Generate URI
                </Button>
              </Label>
              <Input
                disabled
                type='text'
                name='uri'
                value={values.uri}
              />
              <ErrorText text={touched.uri && errors.uri} />
            </FormGroup>
            {status && <Alert {...status} />}
            <Button data-cy='submit' onClick={handleSubmit}>
              {isSubmitting ? 'Submitting...' : 'TOPIC'}
            </Button>
          </Form>
        )
      }}
    </Formik>
  )
}

const Header = styled.div`
  color: #E8EAF6;
  #1A237E
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
