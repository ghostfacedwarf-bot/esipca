'use client'

import { useEffect, useRef } from 'react'
import { useConfiguratorStore, PROFILE_SPECS, ProfileRange } from '@/lib/configurator-store'
import { SlidersHorizontal, Info, Calculator } from 'lucide-react'

const SLAT_GAPS = [
  { value: 'mica', label: 'Mică', rangeMin: 8, rangeMax: 15, avgGap: 10 },
  { value: 'medie', label: 'Medie', rangeMin: 15, rangeMax: 25, avgGap: 20 },
  { value: 'mare', label: 'Mare', rangeMin: 25, rangeMax: 35, avgGap: 30 },
] as const

const PROFILE_OPTIONS: { value: ProfileRange; profiles: string }[] = [
  { value: 'P1-P9', profiles: 'P1, P2, P3, P4, P5, P6, P7, P8, P9' },
  { value: 'P10-P18', profiles: 'P10, P11, P12, P13, P14, P15, P16, P17, P18' },
  { value: 'P19-P27', profiles: 'P19, P20, P21, P22, P23, P24, P25, P26, P27' },
]

export default function StepSlats() {
  const {
    model,
    length,
    height,
    base,
    profileRange,
    slatGap,
    colorHex,
    setProfileRange,
    setSlatGap,
    autoGates,
    autoGatesConfig,
    pedestrianGates,
  } = useConfiguratorStore()

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Get current profile specs
  const currentProfile = PROFILE_SPECS[profileRange]
  const slatWidthMm = currentProfile.widthMm

  // Get current gap size in mm
  const currentGap = SLAT_GAPS.find(g => g.value === slatGap) || SLAT_GAPS[0]
  const gapMm = currentGap.avgGap

  // Calculate fence area (excluding gates)
  const calculateFenceArea = () => {
    // Calculate total gate width
    let gateWidth = 0
    autoGatesConfig.forEach(gate => {
      gateWidth += gate.width / 1000 // Convert mm to m
    })
    gateWidth += pedestrianGates * 1 // Pedestrian gates are 1m each

    // Available fence length (excluding gates)
    const fenceLength = Math.max(0, length - gateWidth)

    // Fence height (above base)
    const fenceHeight = Math.max(0, height - base)

    return { fenceLength, fenceHeight }
  }

  const { fenceLength, fenceHeight } = calculateFenceArea()

  // Calculate number of slats needed
  const calculateSlats = () => {
    if (model === 'vertical') {
      // Vertical slats: calculate how many slats fit along the fence length
      const slatsPerMeter = 1000 / (slatWidthMm + gapMm)
      const totalSlats = Math.ceil(fenceLength * slatsPerMeter)
      const slatHeightM = fenceHeight // Each slat is the full fence height
      const totalMeters = totalSlats * slatHeightM

      return {
        totalSlats,
        slatHeight: fenceHeight,
        totalMeters: Math.ceil(totalMeters * 100) / 100,
        slatsPerMeter: Math.round(slatsPerMeter * 10) / 10,
      }
    } else {
      // Horizontal slats: calculate how many rows fit in the fence height
      const rows = Math.ceil((fenceHeight * 1000) / (slatWidthMm + gapMm))
      const totalMeters = rows * fenceLength

      return {
        totalSlats: rows, // Number of horizontal rows
        slatHeight: fenceLength, // Each slat spans the fence length
        totalMeters: Math.ceil(totalMeters * 100) / 100,
        slatsPerMeter: null, // Not applicable for horizontal
      }
    }
  }

  const slatCalculation = calculateSlats()

  // Draw slat visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const canvasHeight = canvas.height

    // Clear with sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    gradient.addColorStop(0, '#e0f2fe')
    gradient.addColorStop(1, '#fef3c7')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, canvasHeight)

    // Draw ground
    ctx.fillStyle = '#78350f'
    ctx.fillRect(0, canvasHeight - 20, width, 20)

    // Slat color
    const slatColor = colorHex || '#64748b'

    // Calculate visual proportions
    const padding = 40
    const fenceWidth = width - padding * 2
    const fenceVisualHeight = canvasHeight - 60 - padding

    // Draw fence frame (posts)
    ctx.fillStyle = '#374151'
    ctx.fillRect(padding - 8, padding, 8, fenceVisualHeight + 20) // Left post
    ctx.fillRect(width - padding, padding, 8, fenceVisualHeight + 20) // Right post

    // Calculate slat dimensions for visualization
    // Scale slat width based on profile (wider profiles = visually wider slats)
    const baseVisualWidth = 6
    const visualSlatWidthFactor = slatWidthMm / 90 // Scale relative to 90mm
    const visualSlatWidth = model === 'vertical' ? Math.round(baseVisualWidth * visualSlatWidthFactor) : fenceWidth
    const visualSlatHeight = model === 'vertical' ? fenceVisualHeight : Math.round(baseVisualWidth * visualSlatWidthFactor)
    const visualGap = Math.max(2, gapMm / 5)

    ctx.fillStyle = slatColor

    if (model === 'vertical') {
      // Vertical slats
      const step = visualSlatWidth + visualGap
      const count = Math.floor(fenceWidth / step)
      const startX = padding + (fenceWidth - count * step + visualGap) / 2

      for (let i = 0; i < count; i++) {
        const x = startX + i * step
        // Draw slat with slight 3D effect
        ctx.fillStyle = slatColor
        ctx.fillRect(x, padding, visualSlatWidth, fenceVisualHeight)
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.fillRect(x, padding, 2, fenceVisualHeight)
      }
    } else {
      // Horizontal slats
      const step = visualSlatHeight + visualGap
      const count = Math.floor(fenceVisualHeight / step)
      const startY = padding + (fenceVisualHeight - count * step + visualGap) / 2

      for (let i = 0; i < count; i++) {
        const y = startY + i * step
        // Draw slat with slight 3D effect
        ctx.fillStyle = slatColor
        ctx.fillRect(padding, y, fenceWidth, visualSlatHeight)
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.fillRect(padding, y, fenceWidth, 2)
      }
    }

    // Draw base/soclu
    if (base > 0) {
      const baseHeight = (base / height) * fenceVisualHeight
      ctx.fillStyle = '#9ca3af'
      ctx.fillRect(padding - 8, height - 20 - baseHeight, fenceWidth + 16, baseHeight)
      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 1
      ctx.strokeRect(padding - 8, height - 20 - baseHeight, fenceWidth + 16, baseHeight)
    }

  }, [model, slatGap, colorHex, height, base, gapMm, slatWidthMm])

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <span className="text-amber-500">
          <SlidersHorizontal className="w-7 h-7" />
        </span>
        Dispunerea lamelelor
      </h3>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Options */}
        <div className="space-y-6">
          {/* Profile Selector */}
          <div>
            <label className="text-slate-700 font-medium mb-3 block">
              Tipul profilului (lățime lamelă)
            </label>
            <div className="space-y-2">
              {PROFILE_OPTIONS.map((option) => {
                const spec = PROFILE_SPECS[option.value]
                const isSelected = profileRange === option.value

                return (
                  <button
                    key={option.value}
                    onClick={() => setProfileRange(option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className={`font-semibold ${isSelected ? 'text-amber-700' : 'text-slate-700'}`}>
                          {option.value} — Lățime {spec.widthCm}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {spec.piecesPerMeter} buc/metru liniar • {spec.grooves}
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${isSelected ? 'text-amber-600' : 'text-slate-400'}`}>
                        {spec.widthMm}mm
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Profile: {option.profiles}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <h4 className="font-semibold text-amber-800 mb-2">Specificații {profileRange}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-amber-700">Lățime lamelă:</div>
              <div className="font-bold text-amber-900">{slatWidthMm} mm ({currentProfile.widthCm})</div>
              <div className="text-amber-700">Buc/metru liniar:</div>
              <div className="font-bold text-amber-900">{currentProfile.piecesPerMeter} buc/ml</div>
              <div className="text-amber-700">Grosime tablă:</div>
              <div className="font-bold text-amber-900">0.45 mm</div>
              <div className="text-amber-700">Material:</div>
              <div className="font-bold text-amber-900">Tablă zincată DX51</div>
              <div className="text-amber-700">Model:</div>
              <div className="font-bold text-amber-900">{currentProfile.grooves}</div>
            </div>
          </div>

          {/* Slat Gap */}
          <div>
            <label className="text-slate-700 font-medium mb-3 block">
              Distanța dintre lamele
            </label>
            <div className="flex gap-3">
              {SLAT_GAPS.map((option) => {
                const isSelected = slatGap === option.value

                return (
                  <button
                    key={option.value}
                    onClick={() => setSlatGap(option.value)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`font-semibold ${isSelected ? 'text-amber-700' : 'text-slate-700'}`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-slate-500">({option.rangeMin}-{option.rangeMax} mm)</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Calculation Results */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <Calculator size={18} />
              Calcul Necesar Material
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Suprafață gard:</span>
                <span className="font-bold text-green-900">
                  {(fenceLength * fenceHeight).toFixed(2)} m²
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">
                  {model === 'vertical' ? 'Număr lamele verticale:' : 'Număr rânduri orizontale:'}
                </span>
                <span className="font-bold text-green-900">
                  {slatCalculation.totalSlats} buc
                </span>
              </div>
              {model === 'vertical' && slatCalculation.slatsPerMeter && (
                <div className="flex justify-between">
                  <span className="text-green-700">Lamele per metru liniar:</span>
                  <span className="font-bold text-green-900">
                    ~{slatCalculation.slatsPerMeter} buc/m
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-green-700">
                  {model === 'vertical' ? 'Înălțime per lamelă:' : 'Lungime per lamelă:'}
                </span>
                <span className="font-bold text-green-900">
                  {slatCalculation.slatHeight.toFixed(2)} m
                </span>
              </div>
              <div className="border-t border-green-300 pt-2 mt-2">
                <div className="flex justify-between text-base">
                  <span className="text-green-800 font-medium">Total metri liniari:</span>
                  <span className="font-bold text-green-900 text-lg">
                    {slatCalculation.totalMeters} m
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-600 flex items-start gap-2">
              <Info size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                Distanța efectivă dintre lamele se stabilește împreună cu clientul în momentul măsurătorilor.
                Calculul este orientativ și nu include pierderile de material.
              </span>
            </p>
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full max-w-md rounded-lg shadow-inner"
            style={{ maxHeight: '300px' }}
          />
          <p className="text-xs text-slate-500 mt-2 text-center">
            Previzualizare orientativă - Model {model === 'vertical' ? 'Vertical' : 'Orizontal'}
          </p>
        </div>
      </div>
    </div>
  )
}
