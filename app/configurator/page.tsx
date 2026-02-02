'use client'

import { useState, useEffect } from 'react'
import { useConfiguratorStore } from '@/lib/configurator-store'
import StepModel from './components/StepModel'
import StepDimensions from './components/StepDimensions'
import StepColor from './components/StepColor'
import StepQuote from './components/StepQuote'
import ConfiguratorPreview from './components/ConfiguratorPreview'
import ProgressSteps from './components/ProgressSteps'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function ConfiguratorPage() {
  const [mounted, setMounted] = useState(false)
  const { currentStep, nextStep, prevStep, model, reset } = useConfiguratorStore()

  useEffect(() => {
    reset()
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-96 mx-auto mb-8"></div>
            <div className="h-96 bg-slate-200 rounded"></div>
          </div>
        </div>
      </main>
    )
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!model
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepModel />
      case 2:
        return <StepDimensions />
      case 3:
        return <StepColor />
      case 4:
        return <StepQuote />
      default:
        return <StepModel />
    }
  }

  const showPreview = currentStep < 4

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2">
            Configurator Garduri
          </h1>
          <p className="text-slate-600 text-lg">
            Personalizează-ți gardul în funcție de nevoile tale
          </p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps />

        {/* Content */}
        <div className={`flex gap-6 ${showPreview ? '' : 'justify-center'}`}>
          {/* Main Panel */}
          <div
            className={`bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-slate-200 relative overflow-hidden ${
              showPreview ? 'w-[420px] flex-shrink-0' : 'w-full max-w-5xl'
            }`}
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>

            {/* Step Content */}
            <div className="animate-fade-in">{renderStep()}</div>

            {/* Navigation */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={prevStep}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    currentStep > 1
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'invisible'
                  }`}
                >
                  <ArrowLeft size={20} />
                  Înapoi
                </button>

                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    canProceed()
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continuă
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="flex-1 min-w-[500px] bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-slate-200 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Previzualizare
              </h3>
              <ConfiguratorPreview />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
