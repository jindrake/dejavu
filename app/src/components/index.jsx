import React from 'react'
import styled from 'styled-components'
import { Input, CustomInput } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-regular-svg-icons'

export * from './Button'
export * from './Alert'

export const StyledInput = styled(Input)`
  margin-top: 6px;
  font-size: 2vh;
  height: 5vh;
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
  font-size: 2vh;
  height: 10px;
  padding-top: 5px;
`

export const Pill = styled.div`
  width: 100%;
  border-radius: 1vh;
  border: 1px solid violet;
  padding: 1vh;
  background: linear-gradient(#e8eaf6, #c5cae9);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  color: #1a237e;
  margin-bottom: 1vh;
`

export const SubText = styled.div`
  font-size: 12px;
`

export const OverlayLoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
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

export const HeaderText = styled.div`
  font-size: 4vh;
`

export const OverlayLoader = () => (
  <OverlayLoaderContainer>
    <ContentCenter>
      <Title>
        <Loader />
      </Title>
    </ContentCenter>
  </OverlayLoaderContainer>
)

export const Stat = styled.div`
  opacity: 0.8;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  margin-bottom: 2px;
  text-overflow: ellipsis;
  font-size: ${(props) => (props.size ? props.size : null)} i {
    margin-right: 6px;
  }
`

export const Icon = ({ name }) => <i className={`material-icons`}>{name}</i>

export const Placeholder = () => (
  <PlaceholderWrapper>
    <ContentCenter>
      <PlaceholderIcon icon={faFile} />
    </ContentCenter>
    No topics yet
  </PlaceholderWrapper>
)

const PlaceholderIcon = styled(FontAwesomeIcon)`
  font-size: 60px;
`

const PlaceholderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  text-align: center;
`

export const Close = styled.div`
  position: absolute;
  font-size: 20px;
  color: #e8eaf6;
  opacity: 0.5;
  right: 0;
  top: 0;
`
