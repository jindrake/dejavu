import React from 'react'
import withLayout from '../hocs/withLayout'
import withData from '../hocs/withData'
import withFirebase from '../hocs/withFirebase'

import { compose, Query } from 'react-apollo'
import gql from 'graphql-tag'

const test = gql`
  {
    enum_topic_tag {
      topic_tag
    }
  }
`

const Home = ({ extraPropsFromHOC }) => {
  return (
    <div>
      This is home
      {/* <SampleCard>Awesome Developer{extraPropsFromHOC}</SampleCard> */}
      <Query query={test}>
        {(data, error, loading) => {
          if (error) console.error(error)
          if (loading) console.log('loading')
          console.log('data is:', data)
          return <div>Hey</div>
        }}
      </Query>
    </div>
  )
}
// export default Home

export default compose(
  withData(),
  withLayout(),
  withFirebase()
)(Home)
