import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import React from 'react'
import { render } from '@react-email/render'
import { TEMPLATES } from '@/lib/email-templates/registry'

const QuoteSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(1).max(20),
  address: z.string().trim().min(1).max(200),
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
            address: parsed.address || null,
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

          const templateData = {
            name: parsed.name,
            phone: parsed.phone,
            address: parsed.address,
            service: parsed.service ?? undefined,
            windowCount: parsed.windowCount ?? undefined,
            windowType: parsed.windowType ?? undefined,
            message: parsed.message ?? undefined,
            submittedAt,
          }

          const template = TEMPLATES['quote-notification']
          const subject = typeof template.subject === 'function'
            ? template.subject(templateData)
            : template.subject

          const html = await render(React.createElement(template.component, templateData), { pretty: false })
          const text = await render(React.createElement(template.component, templateData), { plainText: true })

          const recipient = (template.to || 'info@overleaseoutdoorservices.com').toLowerCase()

          // Get or create an unsubscribe token for the recipient (required by sender API)
          let unsubscribeToken: string | undefined
          const { data: existingToken } = await supabaseAdmin
            .from('email_unsubscribe_tokens')
            .select('token, used_at')
            .eq('email', recipient)
            .maybeSingle()

          if (existingToken && !existingToken.used_at) {
            unsubscribeToken = existingToken.token
          } else if (!existingToken) {
            const bytes = new Uint8Array(32)
            crypto.getRandomValues(bytes)
            const newToken = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
            await supabaseAdmin
              .from('email_unsubscribe_tokens')
              .upsert({ token: newToken, email: recipient }, { onConflict: 'email', ignoreDuplicates: true })
            const { data: storedToken } = await supabaseAdmin
              .from('email_unsubscribe_tokens')
              .select('token')
              .eq('email', recipient)
              .maybeSingle()
            unsubscribeToken = storedToken?.token
          }

          if (!unsubscribeToken) {
            console.error('Could not resolve unsubscribe token for quote notification')
          } else {
            const messageId = `quote-${inserted.id}`
            await supabaseAdmin.from('email_send_log').insert({
              message_id: messageId,
              template_name: 'quote-notification',
              recipient_email: recipient,
              status: 'pending',
            })

            await supabaseAdmin.rpc('enqueue_email', {
              queue_name: 'transactional_emails',
              payload: {
                to: recipient,
                from: 'Overlease Outdoor Services <notifications@notify.overleaseoutdoorservices.com>',
                sender_domain: 'notify.overleaseoutdoorservices.com',
                subject,
                html,
                text,
                purpose: 'transactional',
                label: 'quote-notification',
                idempotency_key: `quote-${inserted.id}`,
                message_id: messageId,
                unsubscribe_token: unsubscribeToken,
                queued_at: new Date().toISOString(),
              },
            })
          }
        } catch (e) {
          console.error('enqueue_email failed', e)
        }

        return Response.json({ ok: true })
      },
    },
  },
})
