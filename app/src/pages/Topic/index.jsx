import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'
import { FETCH_TOPIC_PREVIEW, CREATE_SESSION } from './queries'
import { getObjectValue, useStateValue, shuffleArray } from '../../libs'
import { HeaderText, Stat, Button, FullPageLoader } from '../../components'
import { Paper } from '../../components/Topic'
import Icon from '../../components/Icon'
import { Badge } from 'reactstrap'

const Topic = ({
  history,
  match: {
    params: { id }
  },
  user,
  createSession
}) => {
  const [, globalDispatch] = useStateValue()
  const { data, loading, error } = useQuery(FETCH_TOPIC_PREVIEW, {
    variables: {
      topicId: id
    }
  })

  const tackleAlone = async () => {
    try {
      const { data } = await createSession({
        variables: {
          userIds: [user.id],
          topicId: id
        }
      })
      console.log('Session id:', data.create_session)
      history.push('/session/' + data.create_session)
    } catch (error) {
      globalDispatch({
        networkError: error.message
      })
    }
  }

  if (error) {
    globalDispatch({
      networkError: error.message
    })
    return null
  }
  if (loading) return <FullPageLoader />
  const topic = getObjectValue(data, 'topic[0]')
  const unshuffledQuestionIds = topic.questions.map((q) => q.question_id)
  const halfSubset = shuffleArray(unshuffledQuestionIds).splice(
    0,
    Math.ceil(unshuffledQuestionIds.length / 2)
  )
  console.log(unshuffledQuestionIds, halfSubset)
  return (
    <Wrapper>
      <TopSection>
        <Button text='Back' onClick={() => history.goBack()} />
      </TopSection>
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
  graphql(CREATE_SESSION, { name: 'createSession' })
)(Topic)
