import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/unsubscribe')({
  head: () => ({
    meta: [
      { title: 'Unsubscribe — Overlease Outdoor Services' },
      { name: 'description', content: 'Unsubscribe from emails sent by Overlease Outdoor Services.' },
      { name: 'robots', content: 'noindex, nofollow' },
      { property: 'og:title', content: 'Unsubscribe — Overlease Outdoor Services' },
      { property: 'og:description', content: 'Manage your email preferences with Overlease Outdoor Services.' },
      { property: 'og:url', content: 'https://overleaseoutdoorservices.com/unsubscribe' },
    ],
    links: [{ rel: 'canonical', href: 'https://overleaseoutdoorservices.com/unsubscribe' }],
  }),
  component: UnsubscribePage,
})

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; email: string }
  | { kind: 'already' }
  | { kind: 'invalid' }
  | { kind: 'submitting' }
  | { kind: 'done' }
  | { kind: 'error' }

function UnsubscribePage() {
  const [state, setState] = useState<State>({ kind: 'loading' })
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token')
    if (!t) {
      setState({ kind: 'invalid' })
      return
    }
    setToken(t)
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}))
        if (r.ok && data?.email) setState({ kind: 'ready', email: data.email })
        else if (data?.alreadyUsed || data?.already_used) setState({ kind: 'already' })
        else setState({ kind: 'invalid' })
      })
      .catch(() => setState({ kind: 'error' }))
  }, [])

  const confirm = async () => {
    if (!token) return
    setState({ kind: 'submitting' })
    try {
      const r = await fetch('/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (r.ok) setState({ kind: 'done' })
      else setState({ kind: 'error' })
    } catch {
      setState({ kind: 'error' })
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Email preferences</h1>

        {state.kind === 'loading' && (
          <p className="mt-3 text-sm text-muted-foreground">Checking your link…</p>
        )}

        {state.kind === 'ready' && (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              Unsubscribe <span className="font-medium text-foreground">{state.email}</span> from
              Overlease Outdoor Services emails?
            </p>
            <Button onClick={confirm} className="mt-6 w-full">Confirm unsubscribe</Button>
          </>
        )}

        {state.kind === 'submitting' && (
          <p className="mt-3 text-sm text-muted-foreground">Processing…</p>
        )}

        {state.kind === 'done' && (
          <p className="mt-3 text-sm text-foreground">You've been unsubscribed. Sorry to see you go.</p>
        )}

        {state.kind === 'already' && (
          <p className="mt-3 text-sm text-muted-foreground">This address is already unsubscribed.</p>
        )}

        {state.kind === 'invalid' && (
          <p className="mt-3 text-sm text-muted-foreground">This unsubscribe link is invalid or has expired.</p>
        )}

        {state.kind === 'error' && (
          <p className="mt-3 text-sm text-destructive">Something went wrong. Please try again later.</p>
        )}
      </div>
    </main>
  )
}
