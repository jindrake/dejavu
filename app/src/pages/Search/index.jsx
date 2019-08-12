import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { debounce } from 'lodash'
import gql from 'graphql-tag'
import { Query, compose, graphql } from 'react-apollo'
import styled from 'styled-components'
import uuid from 'uuid/v4'

import Icon from '../../components/Icon'

const FETCH_TOPIC = gql`
  query fetchTopic($name: String) {
    topic(limit: 15, where: { name: { _ilike: $name } }) {
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
  const [searchValue, setSearchValue] = useState('')

  let debounceEvent = (...args) => {
    debounceEvent = debounce(...args)
    return (e) => {
      e.persist()
      return debounceEvent(e)
    }
  }

  const handleChange = (e) => {
    const searchValue = e.target.value
    setSearchValue(searchValue)
  }

  return (
    <MainDiv>
      <StyledInput
        type='text'
        name='search'
        id='search'
        placeholder='Search topic...'
        onChange={debounceEvent(handleChange, 500)}
      />
      <StyledDiv>
        <Query query={FETCH_TOPIC} variables={{ name: `%${searchValue}%` }}>
          {({ data, error, loading }) => {
            if (error) {
              console.log(error)
              return <div>Error: {JSON.stringify(error)}</div>
            }
            if (loading) return <div>Loading Symbol...</div>
            console.log('DATA:', data)
            return (
              <div>
                {
                  data.topic.length === 0
                    ? (
                      <StyledNoResultDiv>
                        No results found.
                      </StyledNoResultDiv>
                    )
                    : (
                      <div>
                        <SortingDiv>
                          <InnerSortingDiv>Consistency</InnerSortingDiv>
                          <InnerSortingDiv>Reliability</InnerSortingDiv>
                          <InnerSortingDiv>
                          Date
                            <StyledIcon className={`material-icons`}>{'unfold_more'}</StyledIcon>
                          </InnerSortingDiv>
                        </SortingDiv>
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
                                <Title>
                                  {topic.name}
                                </Title>
                                <Description>
                                  {
                                    topic.description
                                  }
                                </Description>
                                <Description>
                                  <Icon name='date_range' />
                                  &nbsp;&nbsp;{`${date.toDateString()}`}
                                </Description>
                                <RatingsDiv>
                                  <Description>
                                    <Icon name='thumb_up' />
                                    &nbsp;&nbsp;{topic.ratings.length > 0 ? topic.ratings.filter((r) => r.type === 'upvote').length : 0}

                                  </Description>
                                  <Description>
                                    <Icon name='thumb_down' />
                                    &nbsp;&nbsp;{topic.ratings.length > 0 ? topic.ratings.filter((r) => r.type === 'downvote').length : 0}
                                  </Description>
                                </RatingsDiv>
                              </Wrapper>
                            )
                          })}
                      </div>
                    )
                }
              </div>
            )
          }}
        </Query>
      </StyledDiv>
    </MainDiv>
  )
}

const MainDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledNoResultDiv = styled.div`
  font-family: Helvetica;
  font-weight: bold;
  color: #1a237e;
  font-size: 3vh;
`

const StyledIcon = styled.i`
  font-size: 2.5vh;
  color: white;
`

const SortingDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
`
const InnerSortingDiv = styled.div`
  font-size: 2vh;
  color: white;
  font-family: Helvetica;
  font-weight: bold;
  align-items: center;
  display: flex;
`

const RatingsDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 10px;
`

const Title = styled.div`
  color: #1a237e;
  font-weight: 700;
  max-height: 60%;
  font-family: Helvetica;
  font-size: 3vh;
  padding-left: 10px;
  margin: 2px;
`
const Description = styled.div`
  color: #1a237e;
  opacity: 0.8;
  line-height: 20px;
  max-height: 60%;
  font-family: Helvetica;
  font-size: 2vh;
  padding-left: 15px;
  margin: 2px;
`

const StyledDiv = styled.div`
  height: 79%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`
const Wrapper = styled.div`
  background: linear-gradient(#e8eaf6, #c5cae9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
  height: 25vh;
  width: 80vw;
  border-radius: 6px;
  overflow-y: auto;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  animation-delay: ${({ n }) => n * 100 + 'ms'};
  z-index: -1;
`

const StyledInput = styled.input`
  background-color: white;
  width: 95%;
  height: 8%;
  font-size: 22px;
  font-family: Helvetica;
  font-weight: bold;
  opacity: 1;
  padding-left: 20px;
  border-radius: 10px;
  border:1px solid white;
  margin: 10px;
`

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(Search)
