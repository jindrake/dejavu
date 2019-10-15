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
import moment from 'moment'

import {
  FETCH_COMMENT_REPLY,
  DELETE_COMMENT_RATING
} from './queries'
import {
  FaIcon,
  Stat,
  StyledInput,
  // CommentDiv,
  // BasicFontSize,
  // UserNameText,
  ReplyDiv,
  FullPageLoader
} from '../../components'

const Comment = ({ comment, topicId, insertTopicCommentRating, deleteCommentRating, insertTopicComment, user }) => {
  const [clickedReply, setclickedReply] = useState(false)
  const [showedReplies, setshowedReplies] = useState(false)
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
          // setclickedReply(false)
          setshowedReplies(true)
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
            <div key={comment.id} className='mb-2 p-2'>
              <div>
                <div className='d-flex text-center justify-content-evenly dejavu-small-text mt-1'>
                  <div className='font-weight-bold'>{`${comment.user.first_name} ${comment.user.last_name}`}</div>
                  &nbsp;<div className='text-primary'>{moment(new Date(comment.created_at)).fromNow()}</div>
                </div>
                <div className='dejavu-small-text pl-2'>{comment.content}</div>
              </div>
              <div className='d-flex text-center justify-content-end dejavu-small-text border-bottom border-primary'>
                <Stat>
                  <div
                    onClick={async () => {
                      console.log('ahshs')
                      // console.log('ratings:', comment.topic_comment_ratings)
                      // const userIdRatings = comment.topic_comment_ratings.map(cr => cr.user_id)
                      // console.log('IDS', userIdRatings)
                      console.log('ggg', comment.topic_comment_ratings)
                      const filterRating = comment.topic_comment_ratings.filter(trating => trating.user_id === user.id)
                      console.log('xxxxxx', filterRating)
                      try {
                        if (filterRating.length > 0 && filterRating[0].rating === 'downvote') {
                          console.log('DELETE!')
                          await deleteCommentRating({
                            variables: {
                              topicCommentId: comment.id,
                              userId: user.id
                            }
                          })
                            .then(async () => {
                              await insertTopicCommentRating({
                                variables: {
                                  commentRatingObject: {
                                    topic_comment_id: comment.id,
                                    rating: 'upvote',
                                    user_id: user.id
                                  }
                                }
                              })
                            })
                        } else if (filterRating.length > 0 && filterRating[0].rating === 'upvote') {
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
                    {/* <div className='dejavu-small-text'> */}
                    <FaIcon icon={faThumbsUp} />
                    {/* </div> */}
                  </div>
                  &nbsp;{`${comment.topic_comment_ratings && comment.topic_comment_ratings.filter(t => t.rating === 'upvote').length}`}
                  {/* &nbsp;{`${12}`} */}
                </Stat>
                &nbsp;
                &nbsp;
                <Stat>
                  <div
                    onClick={async () => {
                      // const userIdRatings = comment.topic_comment_ratings.map(cr => cr.user_id)
                      // console.log('IDS', userIdRatings)
                      // console.log('click')
                      console.log('ggg', comment.topic_comment_ratings)
                      const filterRating = comment.topic_comment_ratings.filter(trating => trating.user_id === user.id)
                      console.log('xxxxxx', filterRating)
                      try {
                        if (filterRating.length > 0 && filterRating[0].rating === 'upvote') {
                          console.log('DELETE!')
                          await deleteCommentRating({
                            variables: {
                              topicCommentId: comment.id,
                              userId: user.id
                            }
                          })
                            .then(async () => {
                              await insertTopicCommentRating({
                                variables: {
                                  commentRatingObject: {
                                    topic_comment_id: comment.id,
                                    rating: 'downvote',
                                    user_id: user.id
                                  }
                                }
                              })
                            })
                        } else if (filterRating.length > 0 && filterRating[0].rating === 'downvote') {
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
                  &nbsp;{`${comment.topic_comment_ratings && comment.topic_comment_ratings.filter(t => t.rating === 'downvote').length}`}
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
              {/* <div className='dejavu-small-text font-weight-bold text-secondary'>Hide replies</div>
              <div className='dejavu-small-text font-weight-bold text-secondary'>Hide replies</div> */}
              {
                replies.length > 0 && (
                  <div>
                    {
                      showedReplies
                        ? <div
                          onClick={() => {
                            setshowedReplies(false)
                            setclickedReply(false)
                          }}
                          className='dejavu-small-text font-weight-bold text-secondary'
                        >
                        Hide replies
                        </div>
                        : <div
                          onClick={() => {
                            setshowedReplies(true)
                            setclickedReply(true)
                          }}
                          className='dejavu-small-text font-weight-bold text-secondary'
                        >
                        Show replies
                        </div>
                    }
                  </div>
                )
              }
              {
                showedReplies && replies.map(r => (
                  <div key={r.id} className='p-1'>
                    <ReplyDiv>
                      {/* <div className='dejavu-small-text'>{`${comment.user.first_name} ${comment.user.last_name}`}</div> */}
                      <div className='d-flex text-center justify-content-evenly dejavu-small-text'>
                        <div className='dejavu-small-text'>{`${r.user.first_name} ${r.user.last_name}`}</div>
                        &nbsp;<div className='text-primary'>{moment(new Date(r.created_at)).fromNow()}</div>
                      </div>
                      <div className='pl-2 dejavu-small-text'>
                        {r.content}
                      </div>
                      <div className='d-flex text-center justify-content-end dejavu-small-text'>
                        <Stat>
                          <div
                            onClick={async () => {
                            // const userIdRatings = r.topic_comment_ratings.map(cr => cr.user_id)
                            // console.log('IDS', userIdRatings)
                            // console.log('ahshs')

                              console.log('ggg', r.topic_comment_ratings)
                              const filterRating = r.topic_comment_ratings.filter(trating => trating.user_id === user.id)
                              console.log('xxxxxx', filterRating)
                              try {
                                if (filterRating.length > 0 && filterRating[0].rating === 'downvote') {
                                  console.log('DELETE!')
                                  await deleteCommentRating({
                                    variables: {
                                      topicCommentId: r.id,
                                      userId: user.id
                                    }
                                  })
                                    .then(async () => {
                                      await insertTopicCommentRating({
                                        variables: {
                                          commentRatingObject: {
                                            topic_comment_id: r.id,
                                            rating: 'upvote',
                                            user_id: user.id
                                          }
                                        }
                                      })
                                    })
                                } else if (filterRating.length > 0 && filterRating[0].rating === 'upvote') {
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
                            // const userIdRatings = r.topic_comment_ratings.map(cr => cr.user_id)
                            // console.log('IDS', userIdRatings)
                            // console.log('ahshs')

                              console.log('ggg', r.topic_comment_ratings)
                              const filterRating = r.topic_comment_ratings.filter(trating => trating.user_id === user.id)
                              console.log('xxxxxx', filterRating)
                              try {
                                if (filterRating.length > 0 && filterRating[0].rating === 'upvote') {
                                  console.log('DELETE!')
                                  await deleteCommentRating({
                                    variables: {
                                      topicCommentId: r.id,
                                      userId: user.id
                                    }
                                  })
                                    .then(async () => {
                                      await insertTopicCommentRating({
                                        variables: {
                                          commentRatingObject: {
                                            topic_comment_id: r.id,
                                            rating: 'downvote',
                                            user_id: user.id
                                          }
                                        }
                                      })
                                    })
                                } else if (filterRating.length > 0 && filterRating[0].rating === 'downvote') {
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
                    </ReplyDiv>
                  </div>
                ))
              }
              {
                clickedReply && (
                  <div className='mt-1 ml-3 mr-3'>
                    <StyledInput
                      border='true'
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
                      <div>reply</div>
                    </Badge>
                  </div>
                )
              }
            </div>
          )
        }
      }
    </Formik>
  )
}

export default compose(
  graphql(DELETE_COMMENT_RATING, { name: 'deleteCommentRating' })
)(Comment)
