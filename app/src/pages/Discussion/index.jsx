import React from 'react'
import { withRouter } from 'react-router-dom'
import compose from 'recompose/compose'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import { faUserCircle, faComments, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { Badge } from 'reactstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import uuid from 'uuid/v4'
import { graphql } from '@apollo/react-hoc'

import { getObjectValue, useStateValue } from '../../libs'
import { FETCH_TOPIC, INSERT_TOPIC_COMMENT, FETCH_TOPIC_COMMENTS, INSERT_TOPIC_COMMENT_RATING } from './queries'
import {
  FlexWrapper,
  FullPageLoader,
  DejavuCard,
  FaIcon,
  Stat,
  HeaderText,
  DescriptionText,
  Button,
  TopSection,
  IconsDiv,
  StyledInput,
  BasicFontSize
} from '../../components'
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
  console.log('match', id)
  const [, globalDispatch] = useStateValue()
  const { data, loading, error } = useQuery(FETCH_TOPIC, {
    variables: {
      topicId: id
    }
  })

  const { data: topicCommentData, loading: topicCommentDataLoading, error: topicCommentDataError } = useSubscription(FETCH_TOPIC_COMMENTS, {
    variables: {
      topicId: id
    }
  })

  // console.log('DATA:', topicCommentData)

  if (error || topicCommentDataError) {
    console.error('error@topic:2')
    globalDispatch({
      networkError: error.message
    })
    return null
  }
  if (loading || topicCommentDataLoading) return <FullPageLoader />

  const topic = getObjectValue(data, 'topic[0]')
  const comments = topicCommentData.topic_comment
  console.log(topic)
  console.log(comments)

  return (
    <Formik
      initialValues={{
        comment: ''
      }}
      validationSchema={yup.object().shape({
        comment: yup
          .string()
        // .min(1, 'Enter Title at least 1 character')
        // .required('Required'),
      })}
      onSubmit={async (values, { setSubmitting, setStatus, touched }) => {
        console.log('content: ', values.comment)
        console.log('topicId:', id)
        console.log('userId:', user.id)
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
          <FlexWrapper>
            <TopSection>
              <Button text='Back' onClick={() => history.goBack()} />
            </TopSection>
            <DejavuCard>
              <Stat>
                <FaIcon icon={faUserCircle} />
                &nbsp;{`${topic.creator.first_name} ${topic.creator.last_name}`}
                &nbsp;
                <div className='text-center text-md-right'>
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
              <Stat>
                <HeaderText>{topic.name}</HeaderText>
              </Stat>
              <div className='text-center'>
                <DescriptionText>{topic.description}</DescriptionText>
              </div>
              <IconsDiv>
                <Stat>
                  <FaIcon icon={faComments} />
                  &nbsp;{`${topic.comments.length}`}
                </Stat>
                <div className='d-inline-flex p-2 col-example'>
                  <Stat>
                    <FaIcon icon={faThumbsUp} />
                    &nbsp;{`${topic.ratings && topic.ratings.filter(t => t.type === 'upvote').length}`}
                  </Stat>
                  &nbsp;
                  <Stat>
                    <FaIcon icon={faThumbsDown} />
                    &nbsp;{`${topic.ratings && topic.ratings.filter(t => t.type === 'downvote').length}`}
                  </Stat>
                </div>
              </IconsDiv>
            </DejavuCard>
            <DejavuCard>
              {
                comments.map(comment => {
                  return (
                    <Comment topicId={id} insertTopicComment={insertTopicComment} key={comment.id} user={user} comment={comment} insertTopicCommentRating={insertTopicCommentRating} />
                  )
                })
              }
              <div>
                <StyledInput
                  border='true'
                  type='text'
                  name='comment'
                  placeholder='Write a comment...'
                  value={values.comment}
                  onChange={(e) => {
                    setFieldValue('comment', e.target.value)
                  }}
                  invalid={errors.name && touched.name}
                />
                <Badge
                  onClick={handleSubmit}
                >
                  <BasicFontSize>submit</BasicFontSize>
                </Badge>
              </div>
            </DejavuCard>
          </FlexWrapper>
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
