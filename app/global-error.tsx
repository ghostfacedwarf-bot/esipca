'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f1f5f9',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>
              Eroare critică
            </h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              A apărut o eroare critică. Vă rugăm să reîncărcați pagina.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Reîncărcați
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
