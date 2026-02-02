'use client'

import { useState } from 'react'
import { useConfiguratorStore, JUDETE } from '@/lib/configurator-store'
import { FileText, Check, Shield, Loader2, ArrowLeft } from 'lucide-react'
import ConfiguratorSummary from './ConfiguratorSummary'

export default function StepQuote() {
  const { contactForm, setContactField, prevStep, reset } = useConfiguratorStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const state = useConfiguratorStore.getState()

      const response = await fetch('/api/configurator-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configuration: {
            model: state.model,
            length: state.length,
            height: state.height,
            base: state.base,
            autoGates: state.autoGates,
            autoGatesConfig: state.autoGatesConfig,
            pedestrianGates: state.pedestrianGates,
            panels: state.panels,
            color: state.color,
            colorCode: state.colorCode,
            profileRange: state.profileRange,
            slatWidth: state.slatWidth,
            slatGap: state.slatGap,
          },
          contact: contactForm,
        }),
      })

      if (!response.ok) {
        throw new Error('Eroare la trimiterea cererii')
      }

      setIsSuccess(true)
    } catch (err) {
      setError('A apărut o eroare. Vă rugăm încercați din nou.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          Cererea a fost trimisă cu succes!
        </h3>
        <p className="text-slate-600 mb-8">
          Vă vom contacta în cel mai scurt timp cu oferta de preț.
        </p>
        <button
          onClick={() => {
            reset()
            setIsSuccess(false)
          }}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
        >
          Configurație Nouă
        </button>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <span className="text-amber-500">
          <FileText className="w-7 h-7" />
        </span>
        Ofertă de preț
      </h3>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Summary */}
        <div>
          <ConfiguratorSummary />
        </div>

        {/* Right: Form */}
        <div className="bg-slate-50 rounded-xl p-6">
          <p className="text-slate-600 text-sm mb-6">
            Pentru a obține oferta de preț este necesar să introduceți detaliile de mai jos
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nume *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.nume}
                  onChange={(e) => setContactField('nume', e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Prenume *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.prenume}
                  onChange={(e) => setContactField('prenume', e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Contact row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactField('email', e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Telefon *
                </label>
                <input
                  type="tel"
                  required
                  value={contactForm.telefon}
                  onChange={(e) => setContactField('telefon', e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* County */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Alegeți județul *
              </label>
              <select
                required
                value={contactForm.judet}
                onChange={(e) => setContactField('judet', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              >
                <option value="">Selectați județul</option>
                {JUDETE.map((judet) => (
                  <option key={judet} value={judet.toLowerCase()}>
                    {judet}
                  </option>
                ))}
              </select>
            </div>

            {/* Prefab option */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={contactForm.prefabricat}
                  onChange={(e) => setContactField('prefabricat', e.target.checked)}
                  className="mt-1 w-4 h-4 text-amber-500 focus:ring-amber-500 rounded"
                />
                <span className="text-sm text-blue-600">
                  Doriți ofertă de preț și pentru stâlpi și parapet din bolțari prefabricați?
                </span>
              </label>
            </div>

            {/* GDPR */}
            <p className="text-xs text-slate-500 flex items-start gap-1">
              <Shield size={14} className="flex-shrink-0 mt-0.5" />
              Datele d-voastră personale vor fi utilizate pentru procesarea cererii de ofertă
              conform politicii noastre de confidențialitate.
            </p>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
              >
                <ArrowLeft size={18} />
                Înapoi
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Se trimite...
                  </>
                ) : (
                  <>
                    📞 CERE OFERTĂ DE PREȚ
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
