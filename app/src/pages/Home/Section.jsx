import React from 'react'
import styled from 'styled-components'

const Section = ({ title, topics }) => (
  <Wrapper><Title>{title}</Title></Wrapper>
)

const Title = styled.div`
  color: #C5CAE9;
  font-size: 12px;
`

const Wrapper = styled.div`
  display: flex;
  margin-top: 20px;
  height: 40%;
`

export default Section
