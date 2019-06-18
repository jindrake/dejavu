import React from 'react'
import styled from 'styled-components'

const Body = styled.div`
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(#283593, #5c6bc0);
  position: absolute;
  width: 100%;
  height: 100%;
`

export default () => (WrappedComponent) => (props) => {
  return (
    <Body>
      {/* <div>Layout: Header</div> */}
      <WrappedComponent {...props} />
      {/* <div>Layout: Footer</div> */}
    </Body>
  )
}
