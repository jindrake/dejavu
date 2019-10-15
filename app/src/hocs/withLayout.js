import React from 'react'
import styled from 'styled-components'

const Body = styled.div`
  margin: 0;
  font-family: 'Proximanova regular';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-size: 200% 200%;
  background-color: #F9F9F9;
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  font-size: 3vh !important;
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
