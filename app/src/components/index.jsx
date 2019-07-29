import React from 'react'
import styled from 'styled-components'
import { Input, CustomInput } from 'reactstrap'

export const StyledInput = styled(Input)`
  margin-top: 6px;
  font-size: 14px;
  height: 36px;
  width: 100%;
  color: #1a237e;
  padding-left: 12px;
  padding-right: 12px;
  /* background: linear-gradient(#e8eaf6, #c5cae9); */
  border-radius: 6px;
  border: none;
  outline: none;
  :focus {
    background: #e8eaf6;
  }
`

export const FormWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  left: 40px;
  right: 40px;
`

export const LoaderContainer = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  color: #e8eaf6;
  font-size: 12px;
  height: 100%;
  width: 100%;
`

export const Title = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
  line-height: 24px;
  font-weight: 700;
  color: #e8eaf6;
`

export const ContentRight = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`

export const ContentCenter = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

export const ContentAround = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`

export const Notification = styled.div`
  position: fixed;
  text-align: center;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  transition: display 2s;
  z-index: 2;
`

export const ContentBetween = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

export const StyledCheckbox = styled(CustomInput)`
font-size: 14px;
color: white;
height: 10px;
padding-top: 5px;
`

export const SubText = styled.div`
  font-size: 12px;
`

export const OverlayLoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.2);
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 2;
`

export const Loader = () => <img src={require('../assets/loader.svg')} alt='loading' />

export const FullPageLoader = () => (
  <LoaderContainer>
    <ContentCenter>
      <Title>
        <Loader />
      </Title>
    </ContentCenter>
  </LoaderContainer>
)

export const OverlayLoader = () => (
  <OverlayLoaderContainer>
    <ContentCenter>
      <Title>
        <Loader />
      </Title>
    </ContentCenter>
  </OverlayLoaderContainer>
)
