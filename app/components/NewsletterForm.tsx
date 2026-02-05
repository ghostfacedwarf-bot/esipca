'use client'

import { useState } from 'react'
import { Mail, CheckCircle, Loader2 } from 'lucide-react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setMessage('Introdu o adresă de email')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setMessage(data.message || 'Eroare la abonare')
        return
      }

      setStatus('success')
      setMessage(data.message)
      setEmail('')

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    } catch (error) {
      setStatus('error')
      setMessage('Eroare de conexiune. Încearcă din nou.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-green-600 font-semibold text-lg">{message}</p>
        <p className="text-dark-500 text-sm mt-2">Vei primi în curând noutăți de la noi.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') {
                setStatus('idle')
                setMessage('')
              }
            }}
            placeholder="Introdu-ți emailul..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-dark-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-dark-900"
            disabled={status === 'loading'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn btn-primary whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Se abonează...
            </>
          ) : (
            'Abonează-te'
          )}
        </button>
      </div>

      {status === 'error' && message && (
        <p className="text-red-600 text-sm text-center">{message}</p>
      )}
    </form>
  )
}
