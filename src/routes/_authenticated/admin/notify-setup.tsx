import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/_authenticated/admin/notify-setup')({
  head: () => ({ meta: [{ title: 'Push Notifications | Admin' }] }),
  component: NotifySetupPage,
})

const ONESIGNAL_APP_ID = '9c168275-dc83-4d1a-aac3-506b91443c30'

function NotifySetupPage() {
  const [status, setStatus] = useState<'loading' | 'idle' | 'subscribed' | 'blocked' | 'error'>('loading')
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const w = window as any

    const refresh = () => {
      const OneSignal = w.OneSignal
      if (!OneSignal?.User?.PushSubscription) return
      const id = OneSignal.User.PushSubscription.id
      const optedIn = OneSignal.User.PushSubscription.optedIn
      if (id && optedIn) {
        setPlayerId(id)
        setStatus('subscribed')
      } else if (OneSignal.Notifications?.permissionNative === 'denied') {
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

    if (!document.querySelector('script[data-onesignal-sdk]')) {
      const script = document.createElement('script')
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
      script.defer = true
      script.setAttribute('data-onesignal-sdk', 'true')
      document.head.appendChild(script)
    }
  }, [])

  // Save Player ID to DB so the server knows to notify this device
  useEffect(() => {
    if (!playerId || saved) return
    ;(async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return
      const { error } = await supabase
        .from('admin_push_subscriptions')
        .upsert(
          { user_id: userData.user.id, player_id: playerId },
          { onConflict: 'player_id' },
        )
      if (error) {
        console.error('Failed to save player_id', error)
        setError('Subscribed in browser, but failed to register with server: ' + error.message)
      } else {
        setSaved(true)
      }
    })()
  }, [playerId, saved])

  const handleSubscribe = async () => {
    const OneSignal = (window as any).OneSignal
    if (!OneSignal) return
    try {
      await OneSignal.User.PushSubscription.optIn()
    } catch (e: any) {
      console.error('Subscribe error', e)
      setError(e?.message || 'Failed to subscribe.')
      setStatus('error')
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Push Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Subscribe this device to receive new estimate alerts. Repeat on any phone you want notified.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
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
            <p className="text-foreground">Tap below to enable notifications on this device.</p>
            <button
              onClick={handleSubscribe}
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
          <div className="space-y-3">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="text-sm font-medium text-green-700">✅ Subscribed</p>
              <p className="mt-1 text-xs text-green-600">
                {saved ? 'This device will receive estimate alerts.' : 'Registering with server...'}
              </p>
            </div>
            <div className="rounded-md bg-muted p-3 text-center">
              <p className="text-xs text-muted-foreground">Device ID</p>
              <p className="mt-1 break-all font-mono text-xs text-foreground">{playerId}</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center text-sm text-muted-foreground">
            Something went wrong. Check the browser console and try refreshing.
          </div>
        )}
      </div>
    </div>
  )
}
