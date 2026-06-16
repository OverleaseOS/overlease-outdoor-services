import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const QuoteSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(1).max(20),
  service: z.string().trim().max(120).optional().nullable(),
  windowCount: z.string().trim().max(10).optional().nullable(),
  windowType: z.string().trim().max(60).optional().nullable(),
  message: z.string().trim().max(500).optional().nullable(),
})

export const Route = createFileRoute('/api/public/submit-quote')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed
        try {
          parsed = QuoteSchema.parse(await request.json())
        } catch {
          return Response.json({ error: 'Invalid submission' }, { status: 400 })
        }

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

        const detailParts = [
          parsed.service && `Service: ${parsed.service}`,
          parsed.windowCount && `Windows: ${parsed.windowCount}`,
          parsed.windowType && `Type: ${parsed.windowType}`,
          parsed.message && `Notes: ${parsed.message}`,
        ].filter(Boolean)

        const { data: inserted, error: insertError } = await supabaseAdmin
          .from('estimate_requests')
          .insert({
            name: parsed.name,
            phone: parsed.phone,
            service: parsed.service || null,
            details: detailParts.join(' | ') || null,
          })
          .select('id')
          .single()

        if (insertError) {
          console.error('estimate_requests insert failed', insertError)
          return Response.json({ error: 'Could not save request' }, { status: 500 })
        }

        // Enqueue the notification email. Don't block the user response on errors.
        try {
          const submittedAt = new Date().toLocaleString('en-US', {
            timeZone: 'America/Chicago',
            dateStyle: 'medium',
            timeStyle: 'short',
          })
          await supabaseAdmin.rpc('enqueue_email', {
            queue_name: 'transactional_emails',
            payload: {
              templateName: 'quote-notification',
              recipientEmail: 'info@overleaseoutdoorservices.com',
              idempotencyKey: `quote-${inserted.id}`,
              templateData: {
                name: parsed.name,
                phone: parsed.phone,
                service: parsed.service ?? undefined,
                windowCount: parsed.windowCount ?? undefined,
                windowType: parsed.windowType ?? undefined,
                message: parsed.message ?? undefined,
                submittedAt,
              },
            },
          })
        } catch (e) {
          console.error('enqueue_email failed', e)
        }


        return Response.json({ ok: true })
      },
    },
  },
})
