import React from 'react'
import styled from 'styled-components'

const Body = styled.div`
  margin: 0;
  font-family: 'Montserrat', 'Open Sans';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: white;
  background-size: 200% 200%;
  position: absolute;
  overflow: hidden;
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
