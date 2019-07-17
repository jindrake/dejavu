import React from 'react'

const Result = ({
  match: { params },
  user
}) => {
  console.log('USER RESULT PAGE:', user)
  console.log('Params result page', params)
  return (
    <div>
      This is result page
    </div>
  )
}

export default Result
