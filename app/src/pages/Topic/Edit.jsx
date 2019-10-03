import React from 'react'
import { withRouter } from 'react-router-dom'
import compose from 'recompose/compose'
import { FETCH_FULL_TOPIC, FETCH_FIELDS, UPDATE_TOPIC, DELETE_TOPIC_FIELD_RELATIONSHIP, CREATE_TOPIC_FIELD_RELATIONSHIP } from './queries'
import { useQuery } from '@apollo/react-hooks'
import { Formik } from 'formik'
import { useStateValue, getObjectValue } from '../../libs'
import * as yup from 'yup'
import { OverlayLoader, FormWrapper } from '../../components'
import { Button, FormGroup, Label, Input, CustomInput } from 'reactstrap'
import uuid from 'uuid/v4'
import styled from 'styled-components'
import Alert from '../../components/Alert'
import { graphql } from '@apollo/react-hoc'

const EditTopicScreen = ({ user, history, updateTopic, deleteTopicFieldRelationship, createTopicFieldRelationship }) => {
  // console.log(history.location.state.topicId)
  const [, globalDispatch] = useStateValue()
  const topicId = history.location.state.topicId
  const { data, loading, error } = useQuery(FETCH_FULL_TOPIC, {
    variables: {
      topicId: topicId
    }
  })

  // for field of study
  const {
    data: studyFields,
    loading: studyFieldsLoading,
    error: studyFieldsError
  } = useQuery(FETCH_FIELDS)

  if (
    loading ||
    studyFieldsLoading
  ) {
    return <OverlayLoader />
  }

  if (error) {
    globalDispatch({
      networkError: error.message
    })
  }

  if (studyFieldsError) {
    globalDispatch({
      networkError: studyFieldsError.message
    })
  }

  const topic = getObjectValue(data, 'topic[0]')
  console.log('TOPIC:', topic)
  const fieldOfStudyId = topic.target_fields[0]
  console.log(fieldOfStudyId)
  return (
    <Formik
      initialValues={{
        name: topic.name ? topic.name : '',
        description: topic.description,
        isPrivate: topic.is_private,
        fieldOfStudy: fieldOfStudyId.field
      }}
      validationSchema={yup.object().shape({
        name: yup
          .string()
          .min(3, 'Enter Title at least 3 characters')
          .required('Required'),
        description: yup.string().required('Required'),
        isPrivate: yup.boolean(),
        fieldOfStudy: yup.string().required('Required')
      })}
      onSubmit={(values, { setSubmitting, setStatus }) => {
        console.log(values)
        updateTopic({
          variables: {
            id: topicId,
            topic: {
              name: values.name,
              description: values.description,
              is_private: values.isPrivate
              // target_fields:
            }
          }
        })
          .then((res) => {
            console.log('RES:', res)
            console.log(getObjectValue(res, 'data.update_topic.returning[0].id'))
            deleteTopicFieldRelationship({
              variables: {
                id: fieldOfStudyId.id
              }
            })
            return createTopicFieldRelationship({
              variables: {
                topicField: {
                  id: uuid(),
                  field: values.fieldOfStudy,
                  topic_id: getObjectValue(res, 'data.update_topic.returning[0].id')
                }
              }
            })
          })
          .then((res) => {
            console.log(res)
            history.goBack()
          })
          .catch((err) => {
            console.log(err.message)
          })
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
        isSubmitting
      }) => {
        console.log('ERRORS:', errors)
        return (
          <FormWrapper>
            {(isSubmitting || loading) && <OverlayLoader />}
            <Title>Edit topic</Title>
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
            </FormGroup>
            <FormGroup>
              <Label for='description'>
                <SubHeader>Description</SubHeader>
              </Label>
              <StyledInputDesc
                type='textarea'
                name='description'
                placeholder='Enter description here ..'
                value={values.description}
                onChange={(e) => {
                  setFieldValue('description', e.target.value)
                }}
                invalid={errors.name && touched.name}
              />
            </FormGroup>
            <FormGroup>
              <Label for='fieldOfStudy'>
                <SubHeader>Target field</SubHeader>
              </Label>
              <StyledInputDesc

                type='select'
                name='fieldOfStudy'
                data-cy='field-of-study'
                placeholder='Select field of study'
                onChange={(e) => { setFieldValue('fieldOfStudy', e.target.value) }}
                invalid={errors.fieldOfStudy && touched.fieldOfStudy}
                value={values.fieldOfStudy}
              >
                <option value='' />
                {studyFields.enum_field &&
                  studyFields.enum_field.map(({ field }) => (
                    <option value={field} key={field}>
                      {field}
                    </option>
                  ))}
              </StyledInputDesc>
            </FormGroup>
            <FormGroup>
              <StyledCheckbox
                defaultChecked={values.isPrivate}
                value={values.isPrivate}
                label='make topic private'
                type='checkbox'
                id='isPrivate'
                name='isPrivate'
                onChange={(e) => { setFieldValue('isPrivate', e.target.value) }}
              />
            </FormGroup>
            <Button
              style={{ marginBottom: '20px', backgroundColor: 'blue', height: '5vh' }}
              data-cy='add_remove_questions'
              onClick={() => {
                history.push({
                  pathname: `/topic/${topic.id}/questions`
                })
              }}
            >
              {'Add/Remove questions'}
            </Button>
            {status && <Alert {...status} />}
            <Button
              style={{ marginBottom: '10px', backgroundColor: 'green', height: '5vh' }}
              data-cy='save_topic'
              onClick={handleSubmit}
            >
              {'Save'}
            </Button>
            <Button
              style={{ marginBottom: '10px', height: '5vh' }}
              data-cy='back'
              onClick={() => {
                history.goBack()
              }}
            >
              {'Back'}
            </Button>
          </FormWrapper>
        )
      }}
    </Formik>
  )
}

const StyledInput = styled(Input)`
  margin-top: 6px;
  font-size: 3vh;
  height: 5vh;
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
const StyledInputDesc = styled(Input)`
  margin-top: 6px;
  font-size: 2vh;
  height: 5vh;
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

const StyledCheckbox = styled(CustomInput)`
  font-size: 2vh;
  color: white;
  height: 2vh;
  padding-top: 5px;
`

const Title = styled.div`
  font-size: 4vh;
  margin-bottom: 20px;
  line-height: 24px;
  font-weight: 700;
  color: #e8eaf6;
`

const SubHeader = styled.div`
  color: #e8eaf6;
  font-size: 4vh;
`

export default compose(
  withRouter,
  graphql(UPDATE_TOPIC, { name: 'updateTopic' }),
  graphql(DELETE_TOPIC_FIELD_RELATIONSHIP, { name: 'deleteTopicFieldRelationship' }),
  graphql(CREATE_TOPIC_FIELD_RELATIONSHIP, { name: 'createTopicFieldRelationship' })
)(EditTopicScreen)
