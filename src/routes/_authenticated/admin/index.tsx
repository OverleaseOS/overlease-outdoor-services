import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/_authenticated/admin/')({
  head: () => ({ meta: [{ title: 'Estimate Requests | Admin' }] }),
  component: EstimatesPage,
})

type EstimateRow = {
  id: string
  created_at: string
  name: string
  phone: string
  address: string | null
  service: string | null
  details: string | null
}


function EstimatesPage() {
  const [rows, setRows] = useState<EstimateRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data, error } = await supabase
        .from('estimate_requests')
        .select('id, created_at, name, phone, address, service, details')
        .order('created_at', { ascending: false })
        .limit(200)

      if (!active) return
      if (error) setError(error.message)
      else setRows((data as EstimateRow[]) ?? [])
    })()
    return () => { active = false }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Estimate Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">All submissions from the contact form.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {rows === null ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No estimate requests yet.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="font-semibold text-foreground">{r.name}</div>
                  <a href={`tel:${r.phone}`} className="text-sm text-primary hover:underline">{r.phone}</a>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
              {r.address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-primary hover:underline"
                >
                  {r.address}
                </a>
              )}
              {r.service && (
                <div className="mt-2 text-sm"><span className="text-muted-foreground">Service: </span><span className="text-foreground">{r.service}</span></div>
              )}
              {r.details && (
                <div className="mt-1 text-sm"><span className="text-muted-foreground">Details: </span><span className="text-foreground">{r.details}</span></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
