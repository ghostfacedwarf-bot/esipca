import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-6xl font-bold text-amber-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Pagină negăsită
        </h2>
        <p className="text-slate-600 mb-6">
          Pagina pe care o căutați nu există sau a fost mutată.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
        >
          Înapoi la pagina principală
        </Link>
      </div>
    </div>
  )
}
