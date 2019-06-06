import React from 'react'

export default (
  // {
  //   youCanPassPropsWhenYouCallTheHoc
  // }
) => WrappedComponent => () => {
  return (
    <div>
      <div>Layout: Header</div>
      <WrappedComponent extraPropsFromHOC={'Hello World'} />
      <div>Layout: Footer</div>
    </div>
  )
}
