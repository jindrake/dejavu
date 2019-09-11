import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { useQuery } from '@apollo/react-hooks'
import { FETCH_TOPIC_PREVIEW, CREATE_SESSION } from './queries'
import { getObjectValue, useStateValue } from '../../libs'
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
  return (
    <Wrapper>
      <TopSection>
        <Button text='Back' onClick={() => history.goBack()} />
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
              <HeaderText className='flex-grow-1'>{`Title: ${topic.name}`}</HeaderText>
            </TitleDiv>
            <DescDiv>
              {`Description: ${topic.description}`}
            </DescDiv>
          </div>
          <Stat>{`${halfSubset.length} items`}</Stat>
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
        </StyledDiv>
        {/* <div>
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
          {/* <Stat>{`${halfSubset.length} items`}</Stat> */}
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
        </PaperBottom> */}
      </Paper>
      <BottomSection>
        {/* <Button text='Tackle with a friend' type='secondary' onClick={tackleAlone} /> */}
        <EditButton
          text='Edit'
          type='primary'
          onClick={() => {
            console.log('edit')
          }}
        />
        <Button
          text='Tackle'
          type='primary'
          onClick={() => {
            tackleAlone()
          }}
        />
      </BottomSection>
    </Wrapper>
  )
}

const EditButton = styled(Button)`
  margin-right: 5px;
`

const DescDiv = styled.div`
  font-size: 2.5vh;
  font-weight: 700;
  word-break: break-word;
  display: flex;
  flex-direction: row;
`

const TitleDiv = styled.div`
  font-weight: 700;
  display: flex;
  align-items: center;
  font-size: 5vh;
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
  align-self: center;
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
