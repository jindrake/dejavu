import React, { createRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Swipeable } from 'react-touch'
import { withRouter } from 'react-router-dom'
import { Title, Icon } from '../../components'

const steps = [
  {
    title: 'Welcome',
    content: 'Dejavu is a community of study buddies sharing the fun of learning.'
  },
  {
    title: 'Share',
    content: 'Share your materials to the community, earn points to access analytics.'
  },
  {
    title: 'Learn',
    content: 'Tackle different materials and learn them solo or with friends!'
  },
  {
    title: 'Ready?',
    content: "Let's go!"
  }
]

const Welcome = ({ history }) => {
  const refs = []
  const [step, setStep] = useState(0)

  useEffect(() => {
    refs[step] &&
      refs[step].current.scrollIntoView({
        behavior: 'smooth',
        inline: 'start'
      })
  })

  return (
    <Swipeable
      onSwipeLeft={() => {
        step < steps.length - 1 ? setStep(step + 1) : history.push('/')
      }}
      onSwipeRight={() => setStep(step > 0 ? step - 1 : step)}
    >
      <Wrapper>
        <Belt>
          {steps.map(({ title, content }) => {
            const ref = createRef()
            refs.push(ref)
            return (
              <Section ref={ref} key={title}>
                <Title>{title}</Title>
                <Content>{content}</Content>
              </Section>
            )
          })}
        </Belt>
        <Icons>
          {steps.map((item, index) => {
            return (
              <Icon
                key={index}
                name={step + '' === index + '' ? 'radio_button_checked' : 'radio_button_unchecked'}
              />
            )
          })}
        </Icons>
      </Wrapper>
    </Swipeable>
  )
}

const Icons = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 25%;
  align-items: flex-end;
  display: flex;
  justify-content: center;
  i {
    margin: 2px;
  }
`

const Content = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
`

const Section = styled.div`
  padding: 40px;
  min-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  justify-items: center;
  position: relative;
  overflow: auto;
`

const Belt = styled.div`
  width: 100%;
  position: relative;
  height: 100%;
  overflow: hidden;
  display: flex;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`

export default withRouter(Welcome)
