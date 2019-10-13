require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Sentry = require('@sentry/node')
const webPush = require('web-push')
const path = require('path')
const gql = require('graphql-tag')

const port = 4000
const app = express()
// const userRouter = require('./user')
const apolloServer = require('./apollo')
const graphql = require('./apollo/graphql')

// Set static path

const publicVapidKey =
  'BE3QnyJpVNXIo3IUyNDZB5L4swp-xYvUscEZpAL7mYbfd_Lh1fWO-ejRRfmZiNijRGlBFeGWFSQIBi5l1M6HbHU'
const privateVapidKey = 'AmRbTGPEJDVDbtzIGQlZ1D0ZWUIfXLGp0RgR2Fp7plE'

// webPush.setVapidDetails('mailto: test@gmail.com', publicVapidKey, privateVapidKey)
// console.log('ENV:', process.env)

apolloServer.applyMiddleware({
  app
})
Sentry.init({ dsn: process.env.SENTRY_ENDPOINT })

// console.log('Dir name:', __dirname)

app.use(express.static(path.join(__dirname, '../app/public')))
app.use(Sentry.Handlers.requestHandler())
app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.use(Sentry.Handlers.errorHandler())

app.listen(port, (error) => {
  if (error) throw error
  console.log(`dejavu services is listening on port: http://localhost:${port}/graphql`)
})

// Subcribe Route
app.post('/subscribe', async (req, res) => {
  const { subscription, userId } = req.body
  const subs = JSON.stringify(subscription)

  try {
    await graphql.mutate(
      gql`
        mutation($userId: uuid, $subscription: String) {
          insert_notification_subscription(
            objects: { user_id: $userId, subscription: $subscription }
            on_conflict: { constraint: notification_subscription_pkey, update_columns: [] }
          ) {
            affected_rows
          }
        }
      `,
      {
        userId: userId,
        subscription: subs
      }
    )

    // const payload = JSON.stringify({ title: 'You allowed notification for Dejavu.works' })
    // if (addSubscriber) {
    //   // Send 201
    //   res.status(201).json({
    //     'content-type': 'application/json'

    //   })

    //   webPush.sendNotification(
    //     subscription,
    //     payload, {
    //       vapidDetails: {
    //         subject: 'mailto: test@gmail.com',
    //         publicKey: publicVapidKey,
    //         privateKey: privateVapidKey
    //       } }
    //   )
    //     .catch((err) => console.log('ERROR:', err))
    // }
  } catch (err) {}
})

// Send Request Route
app.post('/send-notif', async (req, res) => {
  const { message, redirectUrl, recieverId } = req.body
  // console.log('message!', message)
  // console.log('redirectUrl:', redirectUrl)

  try {
    const getSubscriber = await graphql.query(
      gql`
        query($recieverId: uuid) {
          notification_subscription(where: { user_id: { _eq: $recieverId } }) {
            user_id
            subscription
          }
        }
      `,
      {
        recieverId: recieverId
      }
    )
    // eslint-disable-next-line
    const { notification_subscription } = getSubscriber.data
    // Create message
    const objPayload = JSON.stringify({
      title: message,
      url: redirectUrl
    })

    if (getSubscriber.data) {
      // Send 201
      res.status(201).json({
        'content-type': 'application/json'
      })

      notification_subscription.map((notif) => {
        // const { user_id } = notif
        const subDetails = notif.subscription
        const objSubscription = JSON.parse(subDetails)
        // console.log(user_id)
        // console.log(objSubscription)
        webPush
          .sendNotification(objSubscription, objPayload, {
            vapidDetails: {
              subject: 'mailto: angellou101999@gmail.com',
              publicKey: publicVapidKey,
              privateKey: privateVapidKey
            }
          })
          .catch((err) => console.log('ERROR:', err))
      })
      console.log('NOTIF-SENT!')
    }
  } catch (err) {
    console.log(err)
  }
})

app.get('*', (req, res) => {
  res.json('pong')
})
