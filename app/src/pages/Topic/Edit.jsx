import React from 'react'
import { withRouter } from 'react-router-dom'
import compose from 'recompose/compose'
import {
  FETCH_FULL_TOPIC,
  FETCH_FIELDS,
  UPDATE_TOPIC,
  DELETE_ALL_TOPIC_FIELD_RELATIONSHIP,
  CREATE_TOPIC_FIELD_RELATIONSHIP
} from './queries'
import { useQuery } from '@apollo/react-hooks'
import { Formik } from 'formik'
import { useStateValue, getObjectValue } from '../../libs'
import * as yup from 'yup'
import { OverlayLoader, HeaderText, StyledInput, ContentCenter } from '../../components'
import { FormGroup, Label, Button } from 'reactstrap'
import uuid from 'uuid/v4'
import { graphql } from '@apollo/react-hoc'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const EditTopicScreen = ({
  match: {
    params: { id }
  },
  history,
  updateTopic,
  deleteTopicFieldRelationship,
  createTopicFieldRelationship
}) => {
  // console.log(history.location.state.topicId)
  const [, globalDispatch] = useStateValue()
  const { data, loading, error } = useQuery(FETCH_FULL_TOPIC, {
    variables: {
      topicId: id
    }
  })

  // for field of study
  const { data: studyFields, loading: studyFieldsLoading, error: studyFieldsError } = useQuery(
    FETCH_FIELDS
  )

  if (loading || studyFieldsLoading) {
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
        fieldOfStudy: fieldOfStudyId.field
      }}
      validationSchema={yup.object().shape({
        name: yup
          .string()
          .min(3, 'Enter Title at least 3 characters')
          .required('Required'),
        description: yup.string().required('Required'),
        fieldOfStudy: yup.string().required('Required')
      })}
      onSubmit={async (values, { setSubmitting, setStatus, touched }) => {
        console.log(values, touched)
        try {
          await updateTopic({
            variables: {
              id: id,
              topic: {
                name: values.name,
                description: values.description
              }
            }
          })
          await deleteTopicFieldRelationship({
            variables: {
              topicId: id
            }
          })
          await createTopicFieldRelationship({
            variables: {
              topicField: {
                id: uuid(),
                field: values.fieldOfStudy,
                topic_id: topic.id
              }
            }
          })
          globalDispatch({
            operationSuccess: 'Topic updated'
          })
        } catch (error) {
          console.error('error@topicedit1')
          globalDispatch({
            networkError: error.message
          })
        }
        setSubmitting(false)
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
          <div className='h-100 d-flex flex-column justify-content-between'>
            <div>
              <div>
                <FontAwesomeIcon icon={faArrowLeft} onClick={() => history.goBack()} />
              </div>
              {(isSubmitting || loading) && <OverlayLoader />}
              <ContentCenter>
                <HeaderText>Edit topic</HeaderText>
              </ContentCenter>
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
                    const uri = `${e.target.value.toLowerCase().replace(/[\W\s^-]/g, '-')}`
                    const validateUri = uri.replace(/(-+|_+)/g, '')
                    setFieldValue('uri', `${validateUri}-${uuid().substr(0, 4)}`)
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
                  value={values.description}
                  onChange={(e) => {
                    setFieldValue('description', e.target.value)
                  }}
                  invalid={errors.name && touched.name}
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
                  placeholder='Select field of study'
                  onChange={(e) => {
                    setFieldValue('fieldOfStudy', e.target.value)
                  }}
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
                </StyledInput>
              </FormGroup>
            </div>
            <Button onClick={handleSubmit} size='lg' color='primary'>
              Save
            </Button>
          </div>
        )
      }}
    </Formik>
  )
}

export default compose(
  withRouter,
  graphql(UPDATE_TOPIC, { name: 'updateTopic' }),
  graphql(DELETE_ALL_TOPIC_FIELD_RELATIONSHIP, { name: 'deleteTopicFieldRelationship' }),
  graphql(CREATE_TOPIC_FIELD_RELATIONSHIP, { name: 'createTopicFieldRelationship' })
)(EditTopicScreen)
