import React from 'react'
import app from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}

// SOURCE TUTORIAL: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
class Firebase {
  constructor () {
    app.initializeApp(firebaseConfig)

    this.auth = app.auth()
    this.database = app.database
    this.doCreateUserWithEmailAndPassword = this.doCreateUserWithEmailAndPassword.bind(this)
    this.doSignInWithEmailAndPassword = this.doSignInWithEmailAndPassword.bind(this)
    this.doSignOut = this.doSignOut.bind(this)
    this.doPasswordReset = this.doPasswordReset.bind(this)
    this.doPasswordUpdate = this.doPasswordUpdate.bind(this)
  }

  doCreateUserWithEmailAndPassword (email, password) {
    return this.auth.createUserWithEmailAndPassword(email, password)
  }

  doSignInWithEmailAndPassword (email, password) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  doSignOut () {
    return this.auth.signOut()
  }

  doPasswordReset (email) {
    return this.auth.sendPasswordResetEmail(email)
  }

  doPasswordUpdate (password) {
    return this.auth.currentUser.updatePassword(password)
  }
}

const FirebaseContext = React.createContext(null)

export default Firebase

export { FirebaseContext }
