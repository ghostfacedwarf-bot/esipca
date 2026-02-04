'use client'

import { useState, useEffect } from 'react'
import { useConfiguratorStore, PROFILE_SPECS } from '@/lib/configurator-store'
import { useRegionStore } from '@/lib/store'
import { Info } from 'lucide-react'

// Fallback prices (used while loading from API)
const DEFAULT_PRICES: Record<string, number> = {
  'P1-P9': 5.36,
  'P10-P18': 6.36,
  'P19-P27': 5.56,
}

export default function ConfiguratorSummary() {
  const state = useConfiguratorStore()
  const region = useRegionStore((s) => s.region)
  const [prices, setPrices] = useState<Record<string, number>>(DEFAULT_PRICES)

  // Fetch prices from database on mount
  useEffect(() => {
    fetch('/api/configurator/prices')
      .then(res => res.json())
      .then(data => {
        if (data.prices) {
          setPrices(data.prices)
        }
      })
      .catch(err => console.error('Failed to load prices:', err))
  }, [])

  // EU prices are double Romania prices
  const getRegionalPrice = (price: number) => region === 'EU' ? price * 2 : price

  // Calculate total linear meters and price
  const calculateTotal = () => {
    const profileSpec = PROFILE_SPECS[state.profileRange]
    const fenceHeight = Math.max(0, state.height - state.base)
    let basePricePerMeter = prices[state.profileRange] || DEFAULT_PRICES[state.profileRange]
    const gapMm = state.slatGap === 'mica' ? 10 : state.slatGap === 'medie' ? 20 : 30

    // Double-sided painting surcharge (MAT: +0.30, LUCIOS: +0.10)
    // Using MAT surcharge as default since most profiles are MAT
    // Actual price confirmed in final quote based on specific profile selected
    const doubleSidedSurcharge = state.doubleSided ? 0.30 : 0
    basePricePerMeter += doubleSidedSurcharge

    // Apply regional pricing (EU = 2x Romania)
    const pricePerMeter = getRegionalPrice(basePricePerMeter)

    if (state.model === 'orizontal') {
      const rows = Math.ceil((fenceHeight * 1000) / (profileSpec.widthMm + gapMm))
      const totalMeters = rows * state.length
      return {
        totalMeters: Math.round(totalMeters * 100) / 100,
        totalPrice: Math.round(totalMeters * pricePerMeter * 100) / 100,
        doubleSidedSurcharge: getRegionalPrice(doubleSidedSurcharge),
        pricePerMeter,
      }
    } else {
      const slatsPerMeter = profileSpec.piecesPerMeter
      const totalSlats = Math.ceil(state.length * slatsPerMeter)
      const totalMeters = totalSlats * fenceHeight
      return {
        totalMeters: Math.round(totalMeters * 100) / 100,
        totalPrice: Math.round(totalMeters * pricePerMeter * 100) / 100,
        doubleSidedSurcharge: getRegionalPrice(doubleSidedSurcharge),
        pricePerMeter,
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
            <SummaryItem label="Preț/ml" value={`${totals.pricePerMeter.toFixed(2)} RON`} />
            <div className="flex items-center justify-between py-2 bg-amber-50 rounded-lg px-3 -mx-1">
              <div>
                <span className="text-amber-800 font-medium">TOTAL ESTIMAT:</span>
                <span className="text-xs ml-2 px-2 py-0.5 bg-amber-200 rounded-full">
                  {region === 'EU' ? '🇪🇺 Europa' : '🇷🇴 Romania'}
                </span>
              </div>
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
