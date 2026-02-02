'use client'

import { useConfiguratorStore } from '@/lib/configurator-store'
import { Check } from 'lucide-react'

const STEPS = [
  { number: 1, label: 'Model' },
  { number: 2, label: 'Dimensiuni' },
  { number: 3, label: 'Configurator' },
  { number: 4, label: 'Ofertă' },
]

export default function ProgressSteps() {
  const { currentStep, completedSteps } = useConfiguratorStore()

  const progressWidth = ((currentStep - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="relative max-w-3xl mx-auto mb-12">
      {/* Background line */}
      <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200" />

      {/* Progress line */}
      <div
        className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
        style={{ width: `${progressWidth}%` }}
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {STEPS.map((step) => {
          const isActive = step.number === currentStep
          const isCompleted = completedSteps.includes(step.number)

          return (
            <div key={step.number} className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 relative z-10 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                    : isActive
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 scale-110 ring-4 ring-amber-100'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <Check size={20} /> : step.number}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
