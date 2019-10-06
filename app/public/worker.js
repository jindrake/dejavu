
/* eslint-disable */
self.addEventListener('notificationclick', event => {
  console.log('hala bira')
  console.log(event)
  console.log(event.notification)
  console.log(event.notification.data)
  clients.openWindow(`${event.notification.data.url ? event.notification.data.url : '/'}`)
  event.notification.close()
})

self.addEventListener('push', event => {
  const data = event.data.json()
  console.log('Push Received...')
  console.log('DATA101:', data)
  // self.registration.showNotification(data.title, {
  //   body: 'Notified by dejavu.Works',
  // })

  // event.waitUntil(
  self.registration.showNotification(data.title, {
    body: 'Notified by dejavu.Works',
    // icon: "/images/logo@2x.png",
    // tag:  "push-notification-tag",
    data: {
      url: data.url
    }
  })
  // )
})

// not working
