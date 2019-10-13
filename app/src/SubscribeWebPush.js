
/* eslint-disable */
const publicVapidKey = 'BE3QnyJpVNXIo3IUyNDZB5L4swp-xYvUscEZpAL7mYbfd_Lh1fWO-ejRRfmZiNijRGlBFeGWFSQIBi5l1M6HbHU'

export const registerSubscriber = async (userId) => {
  // Register Service Worker
  // console.log('Registering service worker...')
  const register = await navigator.serviceWorker.register('/worker.js', {
    scope: '/'
  })

  console.log(register)
  // console.log('Service Worker Registered...')

  // Register Push
  // console.log('Registering Push...')
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  })

  // console.log(subscription)
  // console.log('Push Registered...')

  // Send Push Notification
  // console.log('Sending Push...')
  await fetch('http://localhost:4000/subscribe', {
    method: 'POST',
    body: JSON.stringify({ subscription, userId }),
    headers: {
      'content-type': 'application/json'
    }
  })
  // console.log('Push Sent...')
}

export const sendRequest = async (message, redirectUrl, recieverId) => {
  // Send Push Notification
  console.log('Sending Notification...')
  await fetch('http://localhost:4000/send-notif', {
    method: 'POST',
    body: JSON.stringify({ message, redirectUrl, recieverId }),
    headers: {
      'content-type': 'application/json'
    }
  })
  // console.log('Request Sent...Wating for serve to return notification...')
}

// Register SW, Register Push, Send Push
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
