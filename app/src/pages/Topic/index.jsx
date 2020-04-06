import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'
import {
  faComments,
  faEnvelope,
  faUserCircle,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import { FETCH_FULL_TOPIC, CREATE_SESSION } from './queries'
import { getObjectValue, useStateValue, shuffleArray } from '../../libs'
import { HeaderText, Stat, FullPageLoader, FaIcon, TopSection } from '../../components'
import { Paper } from '../../components/Topic'
import { Badge, Button } from 'reactstrap'

const Topic = ({
  history,
  match: {
    params: { id }
  },
  user,
  createSession
}) => {
  const [, globalDispatch] = useStateValue()
  const { data, loading, error } = useQuery(FETCH_FULL_TOPIC, {
    variables: {
      topicId: id
    }
  })

  const tackleAlone = async () => {
    try {
      const { data } = await createSession({
        variables: {
          userId: user.id,
          topicId: id,
          type: 'solo'
        }
      })

      history.push('/session/' + data.create_session)
    } catch (error) {
      console.error('error@topic:1')
      globalDispatch({
        networkError: error.message
      })
    }
  }

  const tackleWithAFriend = async () => {
    try {
      const { data } = await createSession({
        variables: {
          userId: user.id,
          topicId: id,
          type: 'duo'
        }
      })

      history.push('/session/' + data.create_session + '/lobby')
    } catch (error) {
      console.error('error@topic:2')
      globalDispatch({
        networkError: error.message
      })
    }
  }

  if (error) {
    console.error('error@topic:2')
    globalDispatch({
      networkError: error.message
    })
    return null
  }
  if (loading) return <FullPageLoader />
  const topic = getObjectValue(data, 'topic[0]')

  const creatorId = topic.creator.id

  const unshuffledQuestionIds = topic.questions.map((q) => q.question_id)
  const halfSubset = shuffleArray(unshuffledQuestionIds).splice(
    0,
    Math.ceil(unshuffledQuestionIds.length / 2)
  )

  return (
    <Wrapper>
      <TopSection>
        <div onClick={() => history.goBack()}>
          <FaIcon icon={faArrowLeft} />
        </div>
        {user.id === creatorId && (
          <EditButton
            color='primary'
            onClick={() => {
              history.push({
                pathname: `/topic/${topic.id}/edit`,
                state: { topicId: topic.id }
              })
            }}
          >
            Edit Topic
          </EditButton>
        )}
      </TopSection>
      <Paper>
        <FieldDiv>
          {topic.target_fields && topic.target_fields.length
            ? topic.target_fields.map((field, index) => {
              return (
                <Badge color='secondary' key={index}>
                  {field.field}
                </Badge>
              )
            })
            : null}
        </FieldDiv>
        <StyledDiv>
          <div>
            <TitleDiv>
              <HeaderText className='flex-grow-1 dejavu-large-text'>{`${topic.name}`}</HeaderText>
            </TitleDiv>
            <DescDiv className='dejavu-small-text'>{`${topic.description}`}</DescDiv>
          </div>
          <Stat>{`${halfSubset.length} items`}</Stat>
          <div className='dejavu-small-text'>
            <Stat>
              <FaIcon icon={faUserCircle} />
              &nbsp;{`${topic.creator.first_name} ${topic.creator.last_name}`}
            </Stat>
            <Stat>
              <FaIcon icon={faEnvelope} />
              &nbsp;{`${topic.creator.email}`}
            </Stat>
            <Stat>
              <div
                onClick={() => {
                  history.push('/topic/' + topic.id + '/discussions')
                }}
              >
                <FaIcon icon={faComments} />
                &nbsp;{`${topic.comments.length}`}
              </div>
            </Stat>
            <Stat size='4vmin'>
              created {moment(new Date(topic.created_at)).fromNow()}
            </Stat>
          </div>
          <div>
            <Button
              className='float-right'
              color='link'
              onClick={() => history.push('/topic/' + topic.id + '/discussions')}
            >
              View Discussion
            </Button>
          </div>
        </StyledDiv>
      </Paper>
      <BottomSection>
        <Button
          color='primary'
          onClick={() => {
            tackleWithAFriend()
          }}
        >
          Tackle with a friend
        </Button>
        <Button
          color='primary'
          onClick={() => {
            tackleAlone()
          }}
        >
          Tackle
        </Button>
      </BottomSection>
    </Wrapper>
  )
}

const EditButton = styled(Button)`
  margin-right: 5px;
`

const DescDiv = styled.div`
  word-break: break-word;
  display: flex;
  flex-direction: row;
`

const TitleDiv = styled.div`
  font-weight: 700;
  display: flex;
  align-items: center;
  word-break: break-word;
`

const StyledDiv = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-left: 10px;
`

const FieldDiv = styled.div`
  align-self: flex-start;
`

// const PaperBottom = styled.div`
//   flex-grow: 2;
//   justify-content: flex-end;
//   display: flex;
//   flex-direction: column;
// `

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const BottomSection = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
  justify-content: space-between;
`

export default compose(
  withRouter,
  graphql(CREATE_SESSION, { name: 'createSession' })
)(Topic)
