export async function subscribeToPushNotifications() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js')
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY_HERE'
      })
      
      // Send the subscription object to your server
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      })
      
      console.log('Push notification subscription successful')
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
    }
  }
}

