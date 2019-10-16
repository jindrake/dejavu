import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
// import { debounce } from 'lodash'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'
import uuid from 'uuid/v4'
import { useStateValue } from '../../libs'
import { StyledInput, FullPageLoader, CardTitle, CardDescription } from '../../components/'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

const FETCH_TOPIC = gql`
  query fetchTopic($query: topic_bool_exp, $orderBy: [topic_order_by!]) {
    topic(limit: 15, where: $query, order_by: $orderBy) {
      id
      name
      description
      created_at
      ratings {
        type
      }
    }
  }
`

export const INSERT_USER_ACTIVITY = gql`
  mutation insertUserActivity($userActivity: [user_activity_insert_input!]!) {
    insert_user_activity(objects: $userActivity) {
      affected_rows
    }
  }
`

const Search = ({ user, history, insertUserActivity }) => {
  const [, globalDispatch] = useStateValue()
  const [searchValue, setSearchValue] = useState('')
  const [searchByReliability] = useState(false)
  const [searchByConsistency] = useState(false)
  const [sortByDateAsc] = useState(false)
  const { loading, error, data, refetch } = useQuery(FETCH_TOPIC, {
    variables: {
      query: {
        name: {
          _ilike: '%'
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    },
    fetchPolicy: 'no-cache'
  })
  // const { loading, error, data, refetch } = useQuery(FETCH_TOPIC, {
  //   variables: {
  //     query: {
  //       name: {
  //         _ilike: searchValue + '%'
  //       }
  //     },
  //     orderBy: {
  //       created_at: sortByDateAsc ? 'asc' : 'desc'
  //     }
  //   }
  // })
  useEffect(() => {
    refetch({
      query: {
        name: {
          _ilike: searchValue + '%'
        }
      },
      orderBy: {
        created_at: sortByDateAsc ? 'asc' : 'desc'
      }
    })
  }, [refetch, searchValue, searchByReliability, searchByConsistency, sortByDateAsc])

  if (loading) return <FullPageLoader />
  if (error) {
    console.error('error@search:1')
    globalDispatch({
      networkError: error.message
    })
    return null
  }

  // useEffect(() => {
  //   refetch({
  //     variables: {
  //       query: {
  //         name: {
  //           _ilike: searchValue + '%'
  //         }
  //       },
  //       orderBy: {
  //         created_at: sortByDateAsc ? 'asc' : 'desc'
  //       }
  //     }
  //   })
  // }, [searchValue, searchByReliability, searchByConsistency, sortByDateAsc])

  // let debounceEvent = (...args) => {
  //   debounceEvent = debounce(...args)
  //   return (e) => {
  //     e.persist()
  //     return debounceEvent(e)
  //   }
  // }

  return (
    <MainDiv>
      <StyledInput
        type='text'
        name='search'
        id='search'
        placeholder='Search topic...'
        // onChange={debounceEvent((event) => {
        //   setSearchValue(event.target.value)
        // }, 500)}
        onChange={(event) => {
          setSearchValue(event.target.value)
        }}
      />
      <StyledDiv>
        <div>
          {data.topic.length === 0 ? (
            <StyledNoResultDiv>No results found.</StyledNoResultDiv>
          ) : (
            <div>
              {/* <SortingDiv>
                <InnerSortingDiv
                  onClick={() => {
                    console.log('consistency')
                    setSearchByConsistency(!searchByConsistency)
                  }}
                  clicked={searchByConsistency}
                >
                  Consistency
                </InnerSortingDiv>
                <InnerSortingDiv
                  onClick={() => {
                    console.log('reliability')
                    setSearchByReliability(!searchByReliability)
                  }}
                  clicked={searchByReliability}
                >
                  Reliability
                </InnerSortingDiv>
                <InnerSortingDiv
                  onClick={() => {
                    console.log('date')
                    setToSortByDateAsc(!sortByDateAsc)
                    refetch()
                  }}
                  clicked={sortByDateAsc}
                >
                  Date
                  <i clicked={sortByDateAsc} className={`material-icons`}>
                    {'unfold_more'}
                  </i>
                </InnerSortingDiv>
              </SortingDiv> */}
              {data.topic &&
                data.topic.map((topic) => {
                  const date = new Date(topic.created_at)
                  console.log(topic.ratings)
                  return (
                    <Wrapper
                      key={topic.id}
                      onClick={() => {
                        if (user) {
                          insertUserActivity({
                            variables: {
                              userActivity: {
                                id: uuid(),
                                activity_type: 'search',
                                user_id: user.id,
                                topic_id: topic.id
                              }
                            }
                          })
                            .then((res) => {
                              console.log(res)
                            })
                            .catch((err) => {
                              console.log(err.message)
                            })
                        }
                        history.push({
                          pathname: `topic/${topic.id}`
                        })
                      }}
                    >
                      <CardTitle>{topic.name}</CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                      <CardDescription>
                        <RatingIcon icon={faCalendarAlt} />
                        &nbsp;&nbsp;{`${date.toDateString()}`}
                      </CardDescription>
                      <RatingsDiv>
                        <CardDescription>
                          <RatingIcon icon={faThumbsUp} />
                          &nbsp;&nbsp;
                          {topic.ratings.length > 0
                            ? topic.ratings.filter((r) => r.type === 'upvote').length
                            : 0}
                          &nbsp;&nbsp;&nbsp;
                          <RatingIcon icon={faThumbsDown} />
                          &nbsp;&nbsp;
                          {topic.ratings.length > 0
                            ? topic.ratings.filter((r) => r.type === 'downvote').length
                            : 0}
                        </CardDescription>
                      </RatingsDiv>
                    </Wrapper>
                  )
                })}
            </div>
          )}
        </div>
      </StyledDiv>
    </MainDiv>
  )
}

const MainDiv = styled.div`
  height: 90vh;
  overflow-y: auto;
`

const StyledNoResultDiv = styled.div`
  /* font-family: Helvetica; */
  font-weight: bold;
  /* font-size: 3vh; */
  margin-top: 10px;
`

// const SortingDiv = styled.div`
//   display: flex;
//   flex-direction: row;
//   width: 100%;
//   justify-content: space-evenly;
//   margin-top: 10px;
// `
// const InnerSortingDiv = styled.div`
//   /* font-size: 2vh; */
//   /* font-family: Helvetica; */
//   font-weight: bold;
//   display: flex;

// `

const RatingsDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 10px;
`

// const Title = styled.div`
//   font-weight: 700;
//   max-height: 60%;
//   /* font-family: Helvetica; */
//   /* font-size: 3vh; */
//   padding-left: 10px;
//   margin: 2px;
// `

// const Description = styled.div`
//   opacity: 0.8;
//   line-height: 20px;
//   max-height: 60%;
//   /* font-family: Helvetica; */
//   /* font-size: 2vh; */
//   padding-left: 15px;
//   margin: 2px;
// `

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`

const Wrapper = styled.div`
  /* background: linear-gradient(45deg, #7851a9, #815abc, #8964cf, #916ee3, #9878f8); */
  /* background-color: #5eb2fb; */
  background-color: white;
  box-shadow: 0 4px 4px -2px gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
  padding: 1rem;
  height: 24vh;
  width: 100%;
  /* border-radius: 6px; */
  overflow-y: auto;
  /* box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2); */
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  animation-delay: ${({ n }) => n * 100 + 'ms'};
  z-index: -1;
  /* color: #ffffff; */
`

const RatingIcon = styled(FontAwesomeIcon)`

`
// const StyledInput = styled.input`
//   background-color: white;
//   width: 90vw;
//   height: 3vw;
//   font-size: 22px;
//   font-family: Helvetica;
//   font-weight: bold;
//   opacity: 1;
//   padding-left: 20px;
//   border-radius: 10px;
//   border:1px solid white;
//   margin: 10px;
// `

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(Search)
