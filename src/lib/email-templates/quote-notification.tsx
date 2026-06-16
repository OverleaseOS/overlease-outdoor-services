import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  phone?: string
  service?: string
  windowCount?: string
  windowType?: string
  message?: string
  submittedAt?: string
}

const QuoteNotification = ({
  name = 'New customer',
  phone = '—',
  service,
  windowCount,
  windowType,
  message,
  submittedAt,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New quote request from {name} ({phone})</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New quote request</Heading>
        <Text style={subtle}>
          {submittedAt ? `Submitted ${submittedAt}` : 'Just submitted from your website'}
        </Text>

        <Section style={card}>
          <Row label="Name" value={name} />
          <Row label="Phone" value={phone} />
          {service ? <Row label="Service" value={service} /> : null}
          {windowCount ? <Row label="Windows" value={windowCount} /> : null}
          {windowType ? <Row label="Window type" value={windowType} /> : null}
        </Section>

        {message ? (
          <Section style={card}>
            <Text style={label}>Notes</Text>
            <Text style={body}>{message}</Text>
          </Section>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>
          Call them back as soon as possible to keep your reply-time promise.
        </Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label: l, value }: { label: string; value: string }) => (
  <Section style={{ marginBottom: '8px' }}>
    <Text style={label}>{l}</Text>
    <Text style={body}>{value}</Text>
  </Section>
)

export const template = {
  component: QuoteNotification,
  subject: (data: Record<string, any>) =>
    `New quote request — ${data?.name || 'Website visitor'}`,
  displayName: 'Quote request notification',
  to: 'info@overleaseoutdoorservices.com',
  previewData: {
    name: 'Jane Doe',
    phone: '(555) 123-4567',
    service: 'Window cleaning',
    windowCount: '12',
    windowType: 'Double-hung',
    message: 'Two-story home, back patio access.',
    submittedAt: new Date().toLocaleString(),
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const h1 = { fontSize: '22px', fontWeight: 700 as const, color: '#0f172a', margin: '0 0 4px' }
const subtle = { fontSize: '13px', color: '#64748b', margin: '0 0 20px' }
const card = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '16px 18px',
  marginBottom: '14px',
}
const label = { fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#64748b', margin: '0 0 2px' }
const body = { fontSize: '15px', color: '#0f172a', margin: 0, lineHeight: '22px' }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#475569', margin: 0 }
