import React, { useState } from 'react'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { Badge } from 'reactstrap'
import { useSubscription } from '@apollo/react-hooks'
import { graphql } from '@apollo/react-hoc'
import compose from 'recompose/compose'
import { useStateValue } from '../../libs'
import { Formik } from 'formik'
import * as yup from 'yup'
import uuid from 'uuid/v4'

import {
  FETCH_COMMENT_REPLY,
  DELETE_COMMENT_RATING
} from './queries'
import {
  FaIcon,
  Stat,
  StyledInput,
  CommentDiv,
  BasicFontSize,
  UserNameText,
  ReplyDiv,
  FullPageLoader
} from '../../components'

const Comment = ({ comment, topicId, insertTopicCommentRating, deleteCommentRating, insertTopicComment, user }) => {
  const [clickedReply, setclickedReply] = useState(false)
  const [, globalDispatch] = useStateValue()
  const { data, loading, error } = useSubscription(FETCH_COMMENT_REPLY, {
    variables: {
      parentId: comment.id
    }
  })

  console.log('DATA:', data)
  const replies = data && data.topic_comment
  console.log(replies)
  if (error) {
    console.error('error@topic:2')
    globalDispatch({
      networkError: error.message
    })
    return null
  }
  if (loading) return <FullPageLoader />

  console.log('Comment', comment)
  return (
    <Formik
      initialValues={{
        reply: ''
      }}
      validationSchema={yup.object().shape({
        reply: yup
          .string()
        // .min(1, 'Enter Title at least 1 character')
        // .required('Required'),
      })}
      onSubmit={async (values, { setSubmitting, setStatus, touched }) => {
        console.log('reply: ', values)
        console.log('parentId', comment.id)
        console.log('id:', uuid())
        console.log('userId:', user.id)
        try {
          await insertTopicComment({
            variables: {
              commentObject: {
                parent_comment_id: comment.id,
                content: values.reply,
                topic_id: topicId,
                id: uuid(),
                user_id: user.id
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
      {
        ({
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
            <CommentDiv key={comment.id}>
              <div>
                <UserNameText>{`${comment.user.first_name} ${comment.user.last_name}`}</UserNameText>
                {comment.content}
              </div>
              <div className='d-inline-flex p-2 col-example'>
                <Stat>
                  <div
                    onClick={async () => {
                      console.log('ahshs')
                      // console.log('ratings:', comment.topic_comment_ratings)
                      const userIdRatings = comment.topic_comment_ratings.map(cr => cr.user_id)
                      console.log('IDS', userIdRatings)
                      try {
                        if (userIdRatings.includes(user.id)) {
                          console.log('DELETE!')
                          await deleteCommentRating({
                            variables: {
                              topicCommentId: comment.id,
                              userId: user.id
                            }
                          })
                        } else {
                          await insertTopicCommentRating({
                            variables: {
                              commentRatingObject: {
                                topic_comment_id: comment.id,
                                rating: 'upvote',
                                user_id: user.id
                              }
                            }
                          })
                        }
                      } catch (error) {
                        console.log(error)
                        globalDispatch({
                          networkError: error.message
                        })
                      }
                    }}
                  >
                    <FaIcon icon={faThumbsUp} />
                  </div>
                  {`${comment.topic_comment_ratings && comment.topic_comment_ratings.filter(t => t.rating === 'upvote').length}`}
                  {/* &nbsp;{`${12}`} */}
                </Stat>
              &nbsp;
                <Stat>
                  <div
                    onClick={async () => {
                      const userIdRatings = comment.topic_comment_ratings.map(cr => cr.user_id)
                      console.log('IDS', userIdRatings)
                      console.log('click')
                      try {
                        if (userIdRatings.includes(user.id)) {
                          console.log('DELETE!')
                          await deleteCommentRating({
                            variables: {
                              topicCommentId: comment.id,
                              userId: user.id
                            }
                          })
                        } else {
                          await insertTopicCommentRating({
                            variables: {
                              commentRatingObject: {
                                topic_comment_id: comment.id,
                                rating: 'downvote',
                                user_id: user.id
                              }
                            }
                          })
                        }
                      } catch (error) {
                        console.log(error)
                        globalDispatch({
                          networkError: error.message
                        })
                      }
                    }}
                  >
                    <FaIcon icon={faThumbsDown} />
                  </div>
                  {`${comment.topic_comment_ratings && comment.topic_comment_ratings.filter(t => t.rating === 'downvote').length}`}
                  {/* &nbsp;{`${2}`} */}
                </Stat>
              &nbsp;
              &nbsp;
                <div
                  onClick={() => {
                    console.log('reply')
                    setclickedReply(true)
                  }}
                >
                Reply
                </div>
              </div>
              {
                replies && replies.map(r => (
                  <div key={r.id}>
                    <ReplyDiv>
                      <UserNameText>{`${comment.user.first_name} ${comment.user.last_name}`}</UserNameText>
                      <div className='pl-10'>
                        {r.content}
                      </div>
                    </ReplyDiv>
                    <div className='d-inline-flex pl-3 col-example'>
                      <Stat>
                        <div
                          onClick={async () => {
                            const userIdRatings = r.topic_comment_ratings.map(cr => cr.user_id)
                            console.log('IDS', userIdRatings)
                            console.log('ahshs')
                            try {
                              if (userIdRatings.includes(user.id)) {
                                console.log('DELETE!')
                                await deleteCommentRating({
                                  variables: {
                                    topicCommentId: r.id,
                                    userId: user.id
                                  }
                                })
                              } else {
                                await insertTopicCommentRating({
                                  variables: {
                                    commentRatingObject: {
                                      topic_comment_id: r.id,
                                      rating: 'upvote',
                                      user_id: user.id
                                    }
                                  }
                                })
                              }
                            } catch (error) {
                              console.log(error)
                              globalDispatch({
                                networkError: error.message
                              })
                            }
                          }}
                        >
                          <FaIcon icon={faThumbsUp} />
                        </div>
                        {`${r.topic_comment_ratings && r.topic_comment_ratings.filter(t => t.rating === 'upvote').length}`}
                      </Stat>
                    &nbsp;
                      <Stat>
                        <div
                          onClick={async () => {
                            const userIdRatings = r.topic_comment_ratings.map(cr => cr.user_id)
                            console.log('IDS', userIdRatings)
                            console.log('ahshs')
                            try {
                              if (userIdRatings.includes(user.id)) {
                                console.log('DELETE!')
                                await deleteCommentRating({
                                  variables: {
                                    topicCommentId: r.id,
                                    userId: user.id
                                  }
                                })
                              } else {
                                await insertTopicCommentRating({
                                  variables: {
                                    commentRatingObject: {
                                      topic_comment_id: r.id,
                                      rating: 'downvote',
                                      user_id: user.id
                                    }
                                  }
                                })
                              }
                            } catch (error) {
                              console.log(error)
                              globalDispatch({
                                networkError: error.message
                              })
                            }
                          }}
                        >
                          <FaIcon icon={faThumbsDown} />
                        </div>
                        {`${r.topic_comment_ratings && r.topic_comment_ratings.filter(t => t.rating === 'downvote').length}`}
                      </Stat>
                    </div>
                  </div>
                ))
              }
              {
                clickedReply && (
                  <div>
                    <StyledInput
                      type='text'
                      name='reply'
                      placeholder='Write a reply...'
                      // value={values.reply}
                      onChange={(e) => {
                        setFieldValue('reply', e.target.value)
                      }}
                      // invalid={errors.name && touched.name}
                    />
                    <Badge
                      onClick={handleSubmit}
                    >
                      <BasicFontSize>reply</BasicFontSize>
                    </Badge>
                  </div>
                )
              }
            </CommentDiv>
          )
        }
      }
    </Formik>
  )
}

export default compose(
  graphql(DELETE_COMMENT_RATING, { name: 'deleteCommentRating' })
)(Comment)
