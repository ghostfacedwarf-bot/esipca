'use client'

import { useConfiguratorStore, PROFILE_SPECS } from '@/lib/configurator-store'
import { Info } from 'lucide-react'

// Price per linear meter based on profile
const PRICE_PER_METER: Record<string, number> = {
  'P1-P9': 2.68,
  'P10-P18': 3.18,
  'P19-P27': 2.78,
}

export default function ConfiguratorSummary() {
  const state = useConfiguratorStore()

  // Calculate total linear meters and price
  const calculateTotal = () => {
    const profileSpec = PROFILE_SPECS[state.profileRange]
    const fenceHeight = Math.max(0, state.height - state.base)
    let pricePerMeter = PRICE_PER_METER[state.profileRange]
    const gapMm = state.slatGap === 'mica' ? 10 : state.slatGap === 'medie' ? 20 : 30

    // Double-sided painting surcharge
    const luciosProfiles = ['P6', 'P7', 'P11', 'P15', 'P16', 'P24', 'P25']
    const isLucios = luciosProfiles.includes(state.color)
    const doubleSidedSurcharge = state.doubleSided ? (isLucios ? 0.10 : 0.30) : 0
    pricePerMeter += doubleSidedSurcharge

    if (state.model === 'orizontal') {
      const rows = Math.ceil((fenceHeight * 1000) / (profileSpec.widthMm + gapMm))
      const totalMeters = rows * state.length
      return {
        totalMeters: Math.round(totalMeters * 100) / 100,
        totalPrice: Math.round(totalMeters * pricePerMeter * 100) / 100,
        doubleSidedSurcharge,
      }
    } else {
      const slatsPerMeter = profileSpec.piecesPerMeter
      const totalSlats = Math.ceil(state.length * slatsPerMeter)
      const totalMeters = totalSlats * fenceHeight
      return {
        totalMeters: Math.round(totalMeters * 100) / 100,
        totalPrice: Math.round(totalMeters * pricePerMeter * 100) / 100,
        doubleSidedSurcharge,
      }
    }
  }

  const totals = calculateTotal()

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg flex items-start gap-2">
        <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <span className="text-sm text-blue-700">
          Prețurile sunt orientative. Oferta finală se stabilește după măsurători.
        </span>
      </div>

      {/* Summary Grid */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-4">Rezumat Configurație</h4>

        <div className="space-y-2 text-sm">
          <SummaryItem label="Model" value={state.model === 'orizontal' ? 'Orizontal' : 'Vertical'} />
          <SummaryItem label="Lungime totală" value={`${state.length} m`} />
          <SummaryItem label="Înălțime" value={`${state.height.toFixed(2)} m`} />
          <SummaryItem label="Soclu" value={`${state.base.toFixed(2)} m`} />


          {state.color && (
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Culoare</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border border-slate-300"
                  style={{ backgroundColor: state.colorHex }}
                />
                <span className="font-medium text-slate-800">{state.color}</span>
              </div>
            </div>
          )}

          <SummaryItem label="Profil șipcă" value={`${state.profileRange} (${PROFILE_SPECS[state.profileRange].widthCm})`} />
          <SummaryItem label="Lungime șipcă" value={`${state.model === 'orizontal' ? (state.postDistance / 1000).toFixed(2) : (state.height - state.base).toFixed(2)} m`} />
          {state.doubleSided && (
            <SummaryItem label="Vopsit față/spate" value={`+${totals.doubleSidedSurcharge.toFixed(2)} RON/ml`} />
          )}

          <div className="pt-2 mt-2 border-t border-slate-200 space-y-2">
            <SummaryItem label="Total metri liniari" value={`${totals.totalMeters} m`} />
            <div className="flex items-center justify-between py-2 bg-amber-50 rounded-lg px-3 -mx-1">
              <span className="text-amber-800 font-medium">TOTAL ESTIMAT:</span>
              <span className="text-xl font-bold text-amber-600">{totals.totalPrice.toFixed(2)} RON</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-slate-600">{label}</span>
      <span className={`font-medium ${highlight ? 'text-amber-600 text-base' : 'text-slate-800'}`}>{value}</span>
    </div>
  )
}
