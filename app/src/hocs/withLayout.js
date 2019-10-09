import React from 'react'
import styled from 'styled-components'

const Body = styled.div`
  margin: 0;
  font-family: 'Arimo', 'Open Sans'
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(45deg, #01796f, #008875, #009779, #18a67b, #30b57b, #42c07d, #52ca7f, #63d580, #71de86, #7ee88c, #8bf192, #98fb98);
  background-size: 200% 200%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  display: flex;
  animation: BorealisEffect 30s ease infinite;
  font-size: 3vh;
  color: #c5cae9 !important;
`

const Wrapper = styled.div`
  width: 100%;
  margin: 2vh;
`

export default () => (WrappedComponent) => (props) => {
  return (
    <Body>
      <Wrapper>
        <WrappedComponent {...props} />
      </Wrapper>
    </Body>
  )
}
