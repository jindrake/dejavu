import React from 'react'
import { withRouter } from 'react-router-dom'
import compose from 'recompose/compose'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import { faComments, faThumbsUp, faThumbsDown, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Formik } from 'formik'
import * as yup from 'yup'
import uuid from 'uuid/v4'
import { graphql } from '@apollo/react-hoc'

import { getObjectValue, useStateValue } from '../../libs'
import {
  FETCH_TOPIC,
  INSERT_TOPIC_COMMENT,
  FETCH_TOPIC_COMMENTS,
  INSERT_TOPIC_COMMENT_RATING
} from './queries'
import {
  FullPageLoader,
  DejavuCard,
  FaIcon,
  Stat,
  HeaderText,
  IconsDiv,
  StyledInput,
  TopSection
} from '../../components'
import { Button, Label, InputGroup, InputGroupAddon, Badge } from 'reactstrap'
import Comment from './Comment'

const Discussion = ({
  user,
  history,
  match: {
    params: { id }
  },
  insertTopicComment,
  insertTopicCommentRating
}) => {
  const [, globalDispatch] = useStateValue()
  const { data, loading, error } = useQuery(FETCH_TOPIC, {
    skip: !id,
    variables: {
      topicId: id
    }
  })

  const {
    data: topicCommentData,
    loading: topicCommentDataLoading,
    error: topicCommentDataError
  } = useSubscription(FETCH_TOPIC_COMMENTS, {
    skip: !id,
    variables: {
      topicId: id
    }
  })

  //
  const componentError = error || topicCommentDataError
  if (componentError) {
    console.error('error@discussion')
    globalDispatch({
      networkError: componentError.message
    })
    return null
  }
  if (loading || topicCommentDataLoading) return <FullPageLoader />

  const topic = getObjectValue(data, 'topic[0]')
  const comments = topicCommentData ? topicCommentData.topic_comment : []

  return (
    <Formik
      initialValues={{
        comment: ''
      }}
      validationSchema={yup.object().shape({
        comment: yup.string()
          .min(1, 'Enter Title at least 1 character')
          .required('Required')
      })}
      onSubmit={async (values, { setSubmitting, setStatus, touched, resetForm }) => {
        try {
          await insertTopicComment({
            variables: {
              commentObject: {
                id: uuid(),
                topic_id: id,
                user_id: user.id,
                content: values.comment
              }
            }
          })
          // window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight)
          resetForm()
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
        return (
          <div>
            {/* <div>
              <FontAwesomeIcon icon={faArrowLeft} onClick={() => history.goBack()} />
            </div> */}
            {/* <FlexWrapper> */}
            <TopSection>
              <div onClick={() => history.goBack()}>
                <FaIcon icon={faArrowLeft} />
              </div>
            </TopSection>
            <DejavuCard>
              <Stat>
                {/* <FaIcon icon={faUserCircle} />
                <div className='dejavu-small-text text-primary text-center mt-2'>&nbsp;{`${topic.creator.first_name} ${topic.creator.last_name}`}</div>
                &nbsp; */}
                <div className='dejavu-small-text text-center text-md-right'>
                  {topic.target_fields && topic.target_fields.length
                    ? topic.target_fields.map((field, index) => {
                      return (
                        <Badge color='secondary' key={index}>
                          {field.field}
                        </Badge>
                      )
                    })
                    : null}
                </div>
              </Stat>
              <div className='mt-2'>
                <HeaderText>{topic.name}</HeaderText>
              </div>
              <div className='dejavu-small-text'>{topic.description}</div>
              <div>
                <Label>By</Label>
                <div className='text-capitalize'>{`${topic.creator.first_name} ${topic.creator.last_name}`}</div>
              </div>
              {/* <div className='dejavu-small-text text-primary'>
                {moment(new Date(topic.created_at)).fromNow()}
              </div> */}
              <IconsDiv>
                <div className='d-inline-flex p-2 col-example'>
                  <div className='dejavu-small-text'>
                    <FaIcon icon={faThumbsUp} />
                    &nbsp;
                    {`${topic.ratings && topic.ratings.filter((t) => t.type === 'upvote').length}`}
                  </div>
                  &nbsp;
                  <div className='dejavu-small-text'>
                    <FaIcon icon={faThumbsDown} />
                    &nbsp;{`${topic.ratings && topic.ratings.filter(t => t.type === 'downvote').length}`}
                  </div>
                  &nbsp;
                  <div className='dejavu-small-text'>
                    <FaIcon icon={faComments} />
                    &nbsp;{`${topic.comments.length}`}
                  </div>
                </div>
              </IconsDiv>
            </DejavuCard>
            <div>
              <InputGroup className='d-flex align-items-end mb-2'>
                <StyledInput
                  type='text'
                  name='comment'
                  placeholder='Write a comment...'
                  value={values.comment}
                  onChange={(e) => {
                    setFieldValue('comment', e.target.value)
                  }}
                  invalid={errors.name && touched.name}
                />
                <InputGroupAddon addonType='prepend'>
                  <Button
                    // className='sm-50'
                    color='link'
                    onClick={handleSubmit}
                    size='sm'
                  >
                    Submit
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              {comments.map((comment) => {
                return (
                  <Comment
                    topicId={id}
                    insertTopicComment={insertTopicComment}
                    key={comment.id}
                    user={user}
                    comment={comment}
                    insertTopicCommentRating={insertTopicCommentRating}
                  />
                )
              })}
            </div>
          </div>
        )
      }}
    </Formik>
  )
}

export default compose(
  withRouter,
  graphql(INSERT_TOPIC_COMMENT, { name: 'insertTopicComment' }),
  graphql(INSERT_TOPIC_COMMENT_RATING, { name: 'insertTopicCommentRating' })
)(Discussion)
