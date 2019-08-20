import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { compose, graphql, Query } from 'react-apollo'
import uuid from 'uuid/v4'
import { FETCH_TOPIC_PREVIEW, INSERT_USER_ACTIVITY } from './queries'
import { getObjectValue, useStateValue, shuffleArray } from '../../libs'
import { OverlayLoader, HeaderText, Stat, Button } from '../../components'
import { Paper } from '../../components/Topic'
import Icon from '../../components/Icon'
import { Badge } from 'reactstrap'

const Topic = ({
  history,
  match: {
    params: { id }
  },
  user,
  insertUserActivity
}) => {
  const [, globalDispatch] = useStateValue()
  const tackleAlone = (questionIds) => {
    console.log(questionIds)
    const topicSessionId = uuid()
    insertUserActivity({
      variables: {
        userActivity: {
          id: uuid(),
          activity_type: 'take',
          user_id: user.id,
          topic_id: id,
          topic_session_id: topicSessionId
        }
      }
    })
      .then((res) => {
        history.push({
          pathname: `/topic/${id}/questions/${questionIds[0]}/topicSession/${topicSessionId}`,
          state: { questionIds }
        })
      })
      .catch((error) => {
        globalDispatch({
          networkError: error.message
        })
      })
  }

  return (
    <Wrapper>
      <TopSection>
        <Button text='Back' onClick={() => history.goBack()} />
      </TopSection>
      <Query query={FETCH_TOPIC_PREVIEW} variables={{ topicId: id }}>
        {({ data, error, loading }) => {
          if (error) {
            globalDispatch({
              networkError: error.message
            })
            return null
          }
          if (loading) return <OverlayLoader />
          const topic = getObjectValue(data, 'topic[0]')
          console.log('topic:', topic)
          const unshuffledQuestionIds = topic.questions.map((q) => q.question_id)
          const halfSubset = shuffleArray(unshuffledQuestionIds).splice(
            0,
            Math.ceil(unshuffledQuestionIds.length / 2)
          )
          return (
            <>
              <Paper>
                <div>
                  <div>
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
                  <HeaderText className='flex-grow-1'>{topic.name}</HeaderText>
                  <Stat>{topic.description}</Stat>
                  <Stat>{`${halfSubset.length} items`}</Stat>
                </div>
                <PaperBottom>
                  <div>
                    <Stat>
                      <Icon name='account_circle' />
                      &nbsp;{`${topic.creator.first_name} ${topic.creator.last_name}`}
                    </Stat>
                    <Stat>
                      <Icon name='account_circle' />
                      &nbsp;&nbsp;{`${topic.creator.email}`}
                    </Stat>
                    <Stat size='4vmin'>
                      created on: &nbsp;{new Date(topic.created_at).toISOString().split('T')[0]}
                    </Stat>
                  </div>
                </PaperBottom>
              </Paper>
              <BottomSection>
                {/* <Button text='Tackle with a friend' type='secondary' onClick={tackleAlone} /> */}
                <Button
                  text='Tackle'
                  type='primary'
                  onClick={() => {
                    tackleAlone(halfSubset)
                  }}
                />
              </BottomSection>
            </>
          )
        }}
      </Query>
    </Wrapper>
  )
}

const PaperBottom = styled.div`
  flex-grow: 2;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const TopSection = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
`

const BottomSection = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
  justify-content: flex-end;
`

export default compose(
  withRouter,
  graphql(INSERT_USER_ACTIVITY, { name: 'insertUserActivity' })
)(Topic)
