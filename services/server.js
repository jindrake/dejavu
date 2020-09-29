require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Sentry = require('@sentry/node')
const postgraphile = require('postgraphile').default
const PgSimplifyInflectorPlugin = require('@graphile-contrib/pg-simplify-inflector')
const PostGraphileNestedMutations = require('postgraphile-plugin-nested-mutations')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.DEJAVU_FIREBASE_DATABASE_URL
})

const app = express()
Sentry.init({ dsn: process.env.SENTRY_ENDPOINT })

app.use(Sentry.Handlers.requestHandler())
app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.use(
  postgraphile(process.env.DATABASE_URL, 'public', {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    appendPlugins: [
      PgSimplifyInflectorPlugin,
      PostGraphileNestedMutations
    ],
    ownerConnectionString: process.env.DATABASE_OWNER_URL,
    pgSettings: async (req) => {
      console.log('>> auth:', req.headers.authorization)
      if (!req.headers.authorization) {
        return {
          role: 'dejavu_anonymous'
        }
      }
      const token = req.headers.authorization.split('Bearer ')[1]
      const decodedToken = await admin.auth().verifyIdToken(token)
      console.log('>> token:', token, decodedToken, decodedToken.dejavu_claims.user_id)
      return {
        role: 'dejavu_user',
        'jwt.claims.user_id': decodedToken.dejavu_claims.user_id
      }
    },
    graphileBuildOptions: {
      nestedMutationsSimpleFieldNames: true
    }
  })
)

app.listen(process.env.PORT, (error) => {
  if (error) throw error
  console.log(`dejavu services is listening on port: http://localhost:${process.env.PORT}/graphql`)
})

app.get('*', (req, res) => {
  res.json('pong')
})
