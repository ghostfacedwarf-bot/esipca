'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Ceva nu a mers bine
        </h2>
        <p className="text-slate-600 mb-6">
          A apărut o eroare neașteptată. Vă rugăm să încercați din nou.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
        >
          Încercați din nou
        </button>
      </div>
    </div>
  )
}
