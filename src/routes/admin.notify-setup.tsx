import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/admin/notify-setup')({
  head: () => ({
    meta: [
      { title: 'Push Notification Setup | Overlease Outdoor Services' },
    ],
  }),
  component: NotifySetupPage,
})

function NotifySetupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'subscribed' | 'blocked' | 'error'>('idle')
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        const OneSignal = (window as any).OneSignal
        if (!OneSignal) {
          setError('OneSignal SDK not loaded yet. Please refresh.')
          return
        }

        await OneSignal.init({
          appId: '9c168275-dc83-4d1a-aac3-506b91443c30',
          allowLocalhostAsSecureOrigin: true,
          notifyButton: { enable: false },
          promptOptions: { slidedown: { prompts: [] } },
        })

        const permission = await OneSignal.Notifications.permission
        if (permission === 'granted') {
          const id = await OneSignal.User.PushSubscription.id
          setPlayerId(id)
          setStatus('subscribed')
        } else if (permission === 'denied') {
          setStatus('blocked')
        } else {
          setStatus('idle')
        }
      } catch (e) {
        console.error('OneSignal init error', e)
        setError('Failed to initialize OneSignal. Make sure your browser supports push notifications.')
        setStatus('error')
      }
    }

    // Wait for the SDK to load
    if ((window as any).OneSignal) {
      initOneSignal()
    } else {
      const interval = setInterval(() => {
        if ((window as any).OneSignal) {
          clearInterval(interval)
          initOneSignal()
        }
      }, 300)
      setTimeout(() => clearInterval(interval), 10000)
    }
  }, [])

  const handleSubscribe = async () => {
    setStatus('loading')
    try {
      const OneSignal = (window as any).OneSignal
      await OneSignal.Slidedown.promptPush({ force: true })

      // Poll for permission change
      const checkPermission = async () => {
        const permission = await OneSignal.Notifications.permission
        if (permission === 'granted') {
          const id = await OneSignal.User.PushSubscription.id
          setPlayerId(id)
          setStatus('subscribed')
          return true
        }
        return false
      }

      let attempts = 0
      const interval = setInterval(async () => {
        attempts++
        if (await checkPermission() || attempts > 20) {
          clearInterval(interval)
          if (attempts > 20 && !playerId) {
            setStatus('idle')
          }
        }
      }, 500)
    } catch (e) {
      console.error('Subscribe error', e)
      setStatus('error')
    }
  }

  const copyPlayerId = () => {
    if (playerId) {
      navigator.clipboard.writeText(playerId)
    }
  }

  useEffect(() => {
    // Dynamically inject OneSignal SDK script
    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
    script.defer = true
    document.head.appendChild(script)
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notification Setup</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Subscribe your phone so only you receive new estimate alerts.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {status === 'idle' && (
            <div className="space-y-4 text-center">
              <p className="text-foreground">Tap below to allow notifications on this device.</p>
              <button
                onClick={handleSubscribe}
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Enable Push Notifications
              </button>
            </div>
          )}

          {status === 'loading' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Waiting for permission...</p>
            </div>
          )}

          {status === 'blocked' && (
            <div className="space-y-4 text-center">
              <p className="text-foreground">Notifications are blocked.</p>
              <p className="text-sm text-muted-foreground">
                Go to your browser settings → Site settings → Notifications and allow this site.
              </p>
            </div>
          )}

          {status === 'subscribed' && playerId && (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">✅ Subscribed!</p>
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                  This device will receive estimate notifications.
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Your Player ID</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={playerId}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                  />
                  <button
                    onClick={copyPlayerId}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Copy this ID and send it to me so I can wire it into the server.
                </p>
              </div>
            </div>
          )}

          {status === 'error' && !error && (
            <div className="text-center text-sm text-muted-foreground">
              Something went wrong. Try refreshing the page.
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          This page is not linked anywhere on the public site. Only people with this URL can access it.
        </p>
      </div>
    </div>
  )
}
