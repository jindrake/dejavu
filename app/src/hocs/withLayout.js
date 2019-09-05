import React from 'react'
import styled from 'styled-components'

const Body = styled.div`
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(45deg, #9c27b0, #1a237e, #9c27b0, #ff7043);
  background-size: 200% 200%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  display: flex;
  animation: BorealisEffect 30s ease infinite;
  font-size: 3vh;
`

const Content = styled.div`
  width: 100%;
  /* margin-left: 2vh; */
  /* margin-right: 2vh; */
  margin: 2vh;
`

export default () => (WrappedComponent) => (props) => {
  return (
    <Body>
      {/* <div>Layout: Header</div> */}
      <Content>
        <WrappedComponent {...props} />

      </Content>
      {/* <div>Layout: Footer</div> */}
    </Body>
  )
}
