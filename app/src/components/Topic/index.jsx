import React from 'react'
import styled from 'styled-components'
import { Button, Form, Input, FormGroup } from 'reactstrap'

export const PaperBody = styled.div`
  background: white;
  padding: 1vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-shadow: 0 4px 4px -2px gray;
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
`

export const PaperWrapper = styled.div`
  height: 100%;
  margin-bottom: 1vh;
  
  /* border-top-style: solid;
  border-top-
  border-top-width: 10px; */
  /* background: linear-gradient(#e8eaf6, #c5cae9); */
`

export const Loader = styled.div`
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

export const CurrentQuestionsSection = styled.div`
  padding: 5px;
  margin-bottom: 60px;
`

export const QuestionCard = styled.div`
  background-color: white;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  
`

export const CenterText = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  /* font-size: 2.5vh; */
`

export const StyledForm = styled(Form)`
  width: 100%;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 30px;
  overflow-y: auto;
  height: 100%;
`

export const RightText = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`

export const UnderlineInput = styled(Input)`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #ffffff;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-radius: 0;
  /* font-size: 14px; */
  
  &:focus {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #ffffff;
    -webkit-box-shadow: none;
    box-shadow: none;
    border-radius: 0;
    
  }
`

export const RemoveButton = styled(Button)`
  
`

export const ChoiceItem = styled(FormGroup)`
  display: flex;
`

export const Hint = styled.span`
  margin-left: 6px;
  /* font-size: 14px; */
`
