import React from 'react'
import styled from 'styled-components'

const Body = styled.div`
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(45deg, #9C27B0, #1A237E, #9C27B0, #FF7043);
  background-size: 200% 200%;
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  animation: BorealisEffect 30s ease infinite;
  @keyframes BorealisEffect {
    0% {
      background-position: 0% 50%
    }
    50% {
      background-position: 100% 50%
    }
    100% {
      background-position: 0% 50%
    }
  }
  .material-icons {
    font-family: 'Material Icons Round';
    font-weight: normal;
    font-style: normal;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }
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
