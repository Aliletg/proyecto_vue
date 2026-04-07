importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyB-A54ObUWW9XBj_1x5fiw_hDjJJ4ibGgk",
  authDomain: "addeduttec.firebaseapp.com",
  projectId: "addeduttec",
  storageBucket: "addeduttec.firebasestorage.app",
  messagingSenderId: "471051841479",
  appId: "1:471051841479:web:7b77b1c5f4a887f404b3e2"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('Notificación en background:', payload)
  const { title, body } = payload.notification
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico'
  })
})

