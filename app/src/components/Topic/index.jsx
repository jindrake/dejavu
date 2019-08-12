import React from 'react'
import styled from 'styled-components'

const PaperBody = styled.div`
  background: linear-gradient(#e8eaf6, #c5cae9);
  padding: 1vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  border-radius: 1vh;
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  overflow-y: scroll;
`

const PaperWrapper = styled.div`
  height: 100%;
  margin-bottom: 1vh;
  overflow-y: scroll;

  /* border-top-style: solid;
  border-top-color: red;
  border-top-width: 10px; */
  /* background: linear-gradient(#e8eaf6, #c5cae9); */
`

const Loader = styled.div`
  /* background-color: red; */
  width: ${(props) => (props.percent ? `${props.percent}%` : null)};
  /* width: 100%; */
  position: fixed;
  top: 0px;
  height: 10px;
  left: 0px;
  border-top-left-radius: 1vh;
  /* text-shadow: 2px 2px red; */
  background-color: #ff7043;
  /* background: ${(props) =>
    props.percent > 50
      ? `linear-gradient(45deg, red, orange, green, yellowgreen)`
      : `linear-gradient(45deg, red, orange)`}; */
  /* background: linear-gradient(45deg, #ff7043, orange, green, yellowgreen); */
  /* background:  */
  transition: width 1s
`

export const Paper = ({ children, loadingPercentage }) => (
  <PaperWrapper>
    {/* <div>
      loading
    </div> */}
    <PaperBody>
      {loadingPercentage ? <Loader percent={loadingPercentage} /> : null}
      {children}
    </PaperBody>
  </PaperWrapper>
)
