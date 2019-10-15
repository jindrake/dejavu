import React from 'react'
import styled from 'styled-components'
import { Input, CustomInput } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-regular-svg-icons'

export * from './Button'
export * from './Alert'

export const FaIcon = ({ icon }) => <FontAwesomeIcon icon={icon} style={{ width: '1em' }} />

export const CommentDiv = styled.div`
  ${''}
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
  /* font-size: 2vh; */
`

export const BasicFontSize = styled.div`
  /* font-size: 1.5vh; */
  padding: 1px;
`

export const ReplyDiv = styled.div`
  margin-right: 10px;
  margin-left: 10px;
  /* font-size: 2vh; */
  border-radius: 5px;
  ${''}
  padding: 5px;
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
  /* font-size: medium; */
  background-color: white;
  padding: 20px;
  margin: 5px;
  border-radius: 5px;
`

export const IconsDiv = styled.div`
  margin-right: 10px;
  align-self: flex-start;
  display: flex;
  ${''}
  align-items: center;
`

export const TopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between;
`

export const StyledInput = styled(Input)`
  /* border: ${props => props.border ? '1px solid grey' : 'none'}; */
  margin-top: 6px;
  /* font-size: 2vh; */
  /* height: 5vh; */
  width: 100%;
  /* padding-left: 12px;
  padding-right: 12px;
  border-radius: 6px; */
  outline: none;
  ${''}
  border: ${props => props.border ? '1px solid grey' : 'none !important'};

  outline: 0;
  background-color: transparent !important;
  ${''}
  border-bottom: 1px solid black !important;
  /* :focus {
    background: #353434;
  } */
`

export const DejavuCard = styled.div`
  /* font-size: medium; */
  background-color: white;
  padding: 20px;
  margin: 5px;
  box-shadow: 0 4px 4px -2px gray;
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
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
  /* font-size: 12px; */
  height: 100%;
  width: 100%;
`

export const Title = styled.div`
  /* font-size: 24px; */
  margin-bottom: 20px;
  line-height: 24px;
  font-weight: 700;
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
  color: #412a7a;
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
  /* font-size: 15px; */
  left: 1vh;
  right: 2vh;
  z-index: 2;
  background: white;
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
  /* font-size: 2vh; */
  height: 10px;
  padding-top: 5px;
  color: #015249;
`

export const Pill = styled.div`
  width: 100%;
  border-radius: 1vh;
  border: 1px solid violet;
  padding: 1vh;
  background: linear-gradient(#353434, #c5cae9);
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  margin-bottom: 1vh;
`

export const SubText = styled.div`
  /* font-size: 12px; */
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

export const PageLabel = styled.div`
  font-size: 3vh;
`

export const DescriptionText = styled.div`
  /* font-size: 2vh; */
`
export const UserNameText = styled.div`
  /* font-size: 2vh; */
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
  /* font-size: 2vh; */
  text-overflow: ellipsis;
  /* font-size: ${(props) => (props.size ? props.size : null)} i {
    margin-right: 6px;
  } */
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
  /* font-size: 60px; */
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
  /* font-size: 20px; */
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
  display: flex;
`

export const Belt = styled.div`
  position: absolute;
  top: 6px;
  display: flex;
`

export const Author = styled.div`
  /* font-size: 2vh; */
  opacity: 0.8;
  display: flex;
  @media screen and (min-width: 800px) {
    margin-bottom: 20px;
  }
`

export const HomeCardWrapper = styled.div`
  /* background: linear-gradient(white, #5EB2FB); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #5EB2FB;
  /* color: #1a237e; */
  color: white;
  width: 50vw;
  height: 23vh;
  /* @media screen and (min-width: 800px) {
    height: 30vw;
  } */
  padding-left: 20px;
  margin-left: 20px;
  &:first-child {
    margin-left: 40px;
  }
  &:last-child {
    margin-right: 40px;
  }
  /* border-radius: 6px; */
  box-shadow: 0 4px 2px -2px gray;
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  animation-delay: ${({ n }) => n * 100 + 'ms'};
`

// export const Header = styled.div`
//   /* font-family: 'Open Sans'; */
//   /* font-weight: 800;
//   font-size: 3vh;
//   color: #412a7a; */
// `

// export const SectionTitle = styled.div`
//   /* font-family: 'Open Sans'; */
//   /* font-weight: 600;
//   font-size: 2.25vh;
//   color: #412a7a; */
// `

export const CardTitle = styled.div`
  font-weight: 800;
  font-size: 2.75vh;
`

export const CardDescription = styled.div`
  font-weight: 600;
  font-size: 2vh;
`

// export const Label = styled.div`
/* font-family: 'Open Sans'; */
/* font-weight: 600;
  font-size: 2.15vh; */
/* color: #412a7a; */
// `
