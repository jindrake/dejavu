
/* eslint-disable */
const publicVapidKey = 'BE3QnyJpVNXIo3IUyNDZB5L4swp-xYvUscEZpAL7mYbfd_Lh1fWO-ejRRfmZiNijRGlBFeGWFSQIBi5l1M6HbHU'

export const registerSubscriber = async (userId) => {
  // Register Service Worker
  // 
  const register = await navigator.serviceWorker.register('/worker.js', {
    scope: '/'
  })

  
  // 

  // Register Push
  // 
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  })

  // 
  // 

  // Send Push Notification
  // 
  await fetch('http://localhost:4000/subscribe', {
    method: 'POST',
    body: JSON.stringify({ subscription, userId }),
    headers: {
      'content-type': 'application/json'
    }
  })
  // 
}

export const sendRequest = async (message, redirectUrl, recieverId) => {
  // Send Push Notification
  
  await fetch('http://localhost:4000/send-notif', {
    method: 'POST',
    body: JSON.stringify({ message, redirectUrl, recieverId }),
    headers: {
      'content-type': 'application/json'
    }
  })
  // 
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
