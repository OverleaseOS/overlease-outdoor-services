import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/admin/notify-setup')({
  head: () => ({
    meta: [{ title: 'Push Notification Setup | Overlease Outdoor Services' }],
  }),
  component: NotifySetupPage,
})

const ONESIGNAL_APP_ID = '9c168275-dc83-4d1a-aac3-506b91443c30'

function NotifySetupPage() {
  const [status, setStatus] = useState<'loading' | 'idle' | 'subscribed' | 'blocked' | 'error'>('loading')
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const w = window as any

    const refresh = () => {
      const OneSignal = w.OneSignal
      if (!OneSignal?.User?.PushSubscription) return
      const id = OneSignal.User.PushSubscription.id
      const optedIn = OneSignal.User.PushSubscription.optedIn
      const perm = OneSignal.Notifications?.permission

      if (id && optedIn) {
        setPlayerId(id)
        setStatus('subscribed')
      } else if (perm === false && OneSignal.Notifications?.permissionNative === 'denied') {
        setStatus('blocked')
      } else {
        setStatus('idle')
      }
    }

    w.OneSignalDeferred = w.OneSignalDeferred || []
    w.OneSignalDeferred.push(async (OneSignal: any) => {
      try {
        if (!OneSignal.__inited) {
          await OneSignal.init({
            appId: ONESIGNAL_APP_ID,
            allowLocalhostAsSecureOrigin: true,
            notifyButton: { enable: false },
            promptOptions: { slidedown: { prompts: [] } },
          })
          OneSignal.__inited = true
        }
        OneSignal.User.PushSubscription.addEventListener('change', refresh)
        refresh()
      } catch (e: any) {
        console.error('OneSignal init error', e)
        setError(e?.message || 'Failed to initialize OneSignal.')
        setStatus('error')
      }
    })

    // Inject SDK if not already present
    if (!document.querySelector('script[data-onesignal-sdk]')) {
      const script = document.createElement('script')
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
      script.defer = true
      script.setAttribute('data-onesignal-sdk', 'true')
      document.head.appendChild(script)
    }
  }, [])

  const handleSubscribe = async () => {
    const OneSignal = (window as any).OneSignal
    if (!OneSignal) return
    try {
      // Opt user in — this triggers the native browser permission prompt
      await OneSignal.User.PushSubscription.optIn()
      // Refresh after a tick
      setTimeout(() => {
        const id = OneSignal.User.PushSubscription.id
        const optedIn = OneSignal.User.PushSubscription.optedIn
        if (id && optedIn) {
          setPlayerId(id)
          setStatus('subscribed')
        }
      }, 500)
    } catch (e: any) {
      console.error('Subscribe error', e)
      setError(e?.message || 'Failed to subscribe.')
      setStatus('error')
    }
  }

  const copyPlayerId = () => {
    if (playerId) navigator.clipboard.writeText(playerId)
  }

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
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {status === 'loading' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Loading OneSignal...</p>
            </div>
          )}

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

          {status === 'blocked' && (
            <div className="space-y-2 text-center">
              <p className="text-foreground">Notifications are blocked in your browser.</p>
              <p className="text-sm text-muted-foreground">
                Open browser settings → Site settings → Notifications and allow this site, then reload.
              </p>
            </div>
          )}

          {status === 'subscribed' && playerId && (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-sm font-medium text-green-700">✅ Subscribed!</p>
                <p className="mt-1 text-xs text-green-600">This device will receive estimate alerts.</p>
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
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Copy this ID and paste it in the chat so I can wire it into the server.
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center text-sm text-muted-foreground">
              Something went wrong. Check the browser console and try refreshing.
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          This page isn't linked from the public site. Only people with this URL can access it.
        </p>
      </div>
    </div>
  )
}
