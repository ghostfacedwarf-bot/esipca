'use client'

import { useConfiguratorStore } from '@/lib/configurator-store'
import { Check } from 'lucide-react'
import Image from 'next/image'

export default function StepModel() {
  const { model, setModel } = useConfiguratorStore()

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <span className="text-amber-500">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </span>
        Alegeți modelul gardului
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Horizontal Model */}
        <button
          onClick={() => setModel('orizontal')}
          className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-center group ${
            model === 'orizontal'
              ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg'
              : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md hover:-translate-y-1'
          }`}
        >
          {/* Top accent */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-transform origin-left ${
              model === 'orizontal'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 scale-x-100'
                : 'bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100'
            }`}
          />

          {/* Check mark */}
          {model === 'orizontal' && (
            <div className="absolute top-3 right-3 w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white z-10">
              <Check size={16} />
            </div>
          )}

          {/* Image Preview */}
          <div className="mb-3 relative h-28 overflow-hidden rounded-lg">
            <Image
              src="/images/orizontal_panou.png"
              alt="Model Orizontal"
              fill
              className={`object-cover transition-transform duration-300 ${
                model === 'orizontal' ? 'scale-105' : 'group-hover:scale-105'
              }`}
            />
          </div>

          <span className={`font-semibold text-lg ${model === 'orizontal' ? 'text-amber-700' : 'text-slate-700'}`}>
            Model Orizontal
          </span>
          <p className="text-xs text-slate-500 mt-1">Lamele dispuse pe orizontală</p>
        </button>

        {/* Vertical Model */}
        <button
          onClick={() => setModel('vertical')}
          className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-center group ${
            model === 'vertical'
              ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg'
              : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md hover:-translate-y-1'
          }`}
        >
          {/* Top accent */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-transform origin-left ${
              model === 'vertical'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 scale-x-100'
                : 'bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100'
            }`}
          />

          {/* Check mark */}
          {model === 'vertical' && (
            <div className="absolute top-3 right-3 w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white z-10">
              <Check size={16} />
            </div>
          )}

          {/* Image Preview */}
          <div className="mb-3 relative h-28 overflow-hidden rounded-lg">
            <Image
              src="/images/vertical_panou.png"
              alt="Model Vertical"
              fill
              className={`object-cover transition-transform duration-300 ${
                model === 'vertical' ? 'scale-105' : 'group-hover:scale-105'
              }`}
            />
          </div>

          <span className={`font-semibold text-lg ${model === 'vertical' ? 'text-amber-700' : 'text-slate-700'}`}>
            Model Vertical
          </span>
          <p className="text-xs text-slate-500 mt-1">Lamele dispuse pe verticală</p>
        </button>
      </div>

      {/* Info text */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Selectați modelul dorit pentru a continua configurarea gardului
      </p>
    </div>
  )
}
