import React from 'react'
import { SampleCard } from '../components/home'
import withLayout from '../hocs/withLayout'

const Home = ({ extraPropsFromHOC }) => {
  return (
    <div className='border border-primary mx-auto bg-warning'>
      Hey
      <SampleCard>
        Awesome Developer
        {extraPropsFromHOC}
      </SampleCard>
    </div>
  )
}
// export default Home

export default withLayout()(Home)
