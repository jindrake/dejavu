import React from 'react'
import styled from 'styled-components'
import { Input, CustomInput } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-regular-svg-icons'

export * from './Button'
export * from './Alert'

export const FaIcon = ({ icon }) => <FontAwesomeIcon icon={icon} style={{ width: '1em' }} />

export const CommentDiv = styled.div`
  background: #d9dae0;
  padding: 10px;
  border-radius: 5px;
  color: black;
  margin-bottom: 5px;
  font-size: 2vh;
`

export const BasicFontSize = styled.div`
  font-size: 1.5vh;
  padding: 1px;
`

export const ReplyDiv = styled.div`
  margin-right: 15px;
  margin-left: 15px;
  font-size: 2vh;
  border-radius: 5px;
  ${''}
  padding: 2px;
  margin-bottom: 2px;
  background: #eaebed;
  ${''}
`

export const FlexWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow-y: scroll;
`

export const TopicWrapper = styled.div`
  color: #1a237e;
  font-size: medium;
  background-color: white;
  padding: 20px;
  margin: 5px;
  border-radius: 5px;
`

export const IconsDiv = styled.div`
  margin-right: 10px;
  align-self: flex-end;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const TopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between;
`

export const StyledInput = styled(Input)`
  border: ${props => props.border ? '1px solid grey' : 'none'};
  margin-top: 6px;
  font-size: 2vh;
  height: 5vh;
  width: 100%;
  color: #1a237e;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 6px;
  outline: none;
  /* :focus {
    background: #353434;
  } */
`

export const DejavuCard = styled.div`
  color: #1a237e;
  font-size: medium;
  background-color: white;
  padding: 20px;
  margin: 5px;
  border-radius: 5px;
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
  color: #353434;
  font-size: 12px;
  height: 100%;
  width: 100%;
`

export const Title = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
  line-height: 24px;
  font-weight: 700;
  color: #353434;
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
  width: 97%;
  display: flex;
  text-align: center;
  padding-left: 2vh;
  padding-right: 2vh;
  flex-direction: column;
  justify-content: center;
  font-size: 15px;
  left: 1vh;
  right: 2vh;
  z-index: 2;
  background: white;
  color:  #9c27b0;
  top: 1vh;
  border-radius: 2vh;
  height: 8%;
  box-shadow: 0 0 5px #353434;
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
  background: linear-gradient(#353434, #c5cae9);
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
  font-size: 3vh;
`
export const DescriptionText = styled.div`
  font-size: 2vh;
`
export const UserNameText = styled.div`
  font-size: 2vh;
  color: grey;
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
  font-size: 2vh;
  text-overflow: ellipsis;
  font-size: ${(props) => (props.size ? props.size : null)} i {
    margin-right: 6px;
  }
`

export const Icon = ({ name }) => <i className={`material-icons`}>{name}</i>

export const Placeholder = ({ text = 'No topics yet' }) => (
  <PlaceholderWrapper>
    <ContentCenter>
      <PlaceholderIcon icon={faFile} />
    </ContentCenter>
    {text}
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
  padding-left: 10%;
  padding-right: 10%;
`

export const Close = styled.div`
  position: absolute;
  font-size: 20px;
  color: #353434;
  opacity: 0.5;
  right: 0;
  top: 0;
`
export const TopicsContainer = styled.div`
  position: relative;
  overflow-x: scroll;
  height: 100%;
  margin-left: -40px;
  margin-right: -40px;
  ${''}
  display: flex;
`

export const Belt = styled.div`
  position: absolute;
  top: 6px;
  display: flex;
  ${''}
`
export const Author = styled.div`
  color: #1a237e;
  font-size: 2vh;
  opacity: 0.8;
  display: flex;
  @media screen and (min-width: 800px) {
    margin-bottom: 20px;
  }
`

export const CardWrapper = styled.div`
  background: linear-gradient(#353434, #c5cae9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #1a237e;
  width: 50vw;
  height: 23vh;
  @media screen and (min-width: 800px) {
    height: 30vw;
  }
  padding-left: 20px;
  margin-left: 20px;
  &:first-child {
    margin-left: 40px;
  }
  &:last-child {
    margin-right: 40px;
  }
  border-radius: 6px;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  animation-delay: ${({ n }) => n * 100 + 'ms'};
`
