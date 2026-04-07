import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyB-A54ObUWW9XBj_1x5fiw_hDjJJ4ibGgk",
  authDomain: "addeduttec.firebaseapp.com",
  projectId: "addeduttec",
  storageBucket: "addeduttec.firebasestorage.app",
  messagingSenderId: "471051841479",
  appId: "1:471051841479:web:7b77b1c5f4a887f404b3e2",
  measurementId: "G-RYYQNES4QC"
};

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "FsgW8eJlxptNKMgJ5dLFYzLkF5ZJuS13IVAfCEaLR24"
    })
    if (token) {
      console.log('FCM Token:', token)
      return token
    }
  } catch (error) {
    console.error('Error obteniendo token FCM:', error)
  }
}

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })
}

export { messaging }