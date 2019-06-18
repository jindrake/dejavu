import { FirebaseContext } from '../libs/firebase'
import React from 'react'

export default () => (WrappedComponent) => (props) => {
  return (
    <FirebaseContext.Consumer>
      {(firebase) => {
        return (
          <>
            <WrappedComponent firebase={firebase} {...props} />
          </>
        )
      }}
    </FirebaseContext.Consumer>
  )
}
