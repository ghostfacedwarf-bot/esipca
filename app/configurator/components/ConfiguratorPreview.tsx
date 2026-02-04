'use client'

import { useEffect, useState } from 'react'
import { useConfiguratorStore, PROFILE_SPECS } from '@/lib/configurator-store'
import { useRegionStore } from '@/lib/store'
import Image from 'next/image'

// Fallback prices (used while loading from API)
const DEFAULT_PRICES: Record<string, number> = {
  'P1-P9': 5.36,
  'P10-P18': 6.36,
  'P19-P27': 5.56,
}

interface ImageManifest {
  images: Array<{ pattern: string; filename: string }>
}

export default function ConfiguratorPreview() {
  const {
    model,
    length,
    height,
    base,
    postDistance,
    colorHex,
    colorCode,
    color,
    profileRange,
    slatGap,
    doubleSided,
    currentStep,
  } = useConfiguratorStore()

  const region = useRegionStore((s) => s.region)
  const [manifest, setManifest] = useState<ImageManifest | null>(null)
  const [imageSrc, setImageSrc] = useState('/images/fence-previews/gard_horizontal_1.e705ca8f.png')
  const [prices, setPrices] = useState<Record<string, number>>(DEFAULT_PRICES)

  // EU prices are double Romania prices
  const getRegionalPrice = (price: number) => region === 'EU' ? price * 2 : price

  // Load manifest and prices
  useEffect(() => {
    fetch('/images/fence-previews/images-manifest.json')
      .then((res) => res.json())
      .then((data) => setManifest(data))
      .catch((err) => console.error('Failed to load manifest:', err))

    fetch('/api/configurator/prices')
      .then(res => res.json())
      .then(data => {
        if (data.prices) {
          setPrices(data.prices)
        }
      })
      .catch(err => console.error('Failed to load prices:', err))
  }, [])

  // Find image from manifest
  const findImage = (pattern: string): string => {
    if (!manifest) return ''

    const match = manifest.images.find((img) => img.pattern === pattern)
    if (match) return `/images/fence-previews/${match.filename}`

    return ''
  }

  // Set image based on model and color
  useEffect(() => {
    if (!model || !manifest) return

    const modelPrefix = model === 'orizontal' ? 'horizontal' : 'vertical'
    const color = colorCode || '0'

    // Try patterns in order of specificity
    const patterns = [
      `${modelPrefix}_1_1_${color}`,
      `${modelPrefix}_1_1_0`,
      `gard_${modelPrefix}_1`,
    ]

    for (const pattern of patterns) {
      const img = findImage(pattern)
      if (img) {
        setImageSrc(img)
        return
      }
    }

    // Ultimate fallback
    setImageSrc(model === 'orizontal'
      ? '/images/fence-previews/gard_horizontal_1.e705ca8f.png'
      : '/images/fence-previews/gard_vertical_1.ca7b8d4d.png'
    )
  }, [model, colorCode, manifest])

  // Calculate price estimate
  const calculatePrice = () => {
    if (!model) return { slats: 0, totalMeters: 0, pricePerMeter: 0, doubleSidedSurcharge: 0, totalPrice: 0, region }

    const profileSpec = PROFILE_SPECS[profileRange]
    const fenceHeight = Math.max(0, height - base)
    let basePricePerMeter = prices[profileRange] || DEFAULT_PRICES[profileRange]

    // Double-sided painting surcharge
    // LUCIOS profiles: P6, P7, P11, P15, P16, P24, P25
    const luciosProfiles = ['P6', 'P7', 'P11', 'P15', 'P16', 'P24', 'P25']
    const isLucios = luciosProfiles.includes(color)
    const doubleSidedSurcharge = doubleSided ? (isLucios ? 0.10 : 0.30) : 0
    basePricePerMeter += doubleSidedSurcharge

    // Apply regional pricing (EU = 2x Romania)
    const pricePerMeter = getRegionalPrice(basePricePerMeter)

    // Gap in mm
    const gapMm = slatGap === 'mica' ? 10 : slatGap === 'medie' ? 20 : 30

    if (model === 'orizontal') {
      // Horizontal: rows of slats across the height
      const rows = Math.ceil((fenceHeight * 1000) / (profileSpec.widthMm + gapMm))
      const totalMeters = rows * length
      return {
        slats: rows,
        totalMeters: Math.round(totalMeters * 100) / 100,
        pricePerMeter: Math.round(pricePerMeter * 100) / 100,
        doubleSidedSurcharge: getRegionalPrice(doubleSidedSurcharge),
        totalPrice: Math.round(totalMeters * pricePerMeter * 100) / 100,
        region,
      }
    } else {
      // Vertical: slats along the length
      const slatsPerMeter = profileSpec.piecesPerMeter
      const totalSlats = Math.ceil(length * slatsPerMeter)
      const totalMeters = totalSlats * fenceHeight
      return {
        slats: totalSlats,
        totalMeters: Math.round(totalMeters * 100) / 100,
        pricePerMeter: Math.round(pricePerMeter * 100) / 100,
        doubleSidedSurcharge: getRegionalPrice(doubleSidedSurcharge),
        totalPrice: Math.round(totalMeters * pricePerMeter * 100) / 100,
        region,
      }
    }
  }

  const priceCalc = calculatePrice()

  if (!model) {
    return (
      <div className="text-center py-12 text-slate-400">
        <div className="text-5xl mb-4">🏗️</div>
        <p>Selectați un model pentru a vedea previzualizarea</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      <div className="relative bg-gradient-to-b from-sky-100 to-amber-50 rounded-xl overflow-hidden" style={{ minHeight: '200px' }}>
        <Image
          src={imageSrc}
          alt="Previzualizare gard"
          width={500}
          height={300}
          className="w-full h-auto object-contain"
          onError={() => {
            setImageSrc(model === 'orizontal'
              ? '/images/fence-previews/gard_horizontal_1.e705ca8f.png'
              : '/images/fence-previews/gard_vertical_1.ca7b8d4d.png'
            )
          }}
        />

        {/* Color overlay indicator */}
        {colorHex && (
          <div className="absolute top-2 right-2 flex items-center gap-2 bg-white/90 rounded-full px-3 py-1 text-sm">
            <div
              className="w-4 h-4 rounded-full border border-slate-300"
              style={{ backgroundColor: colorHex }}
            />
            <span className="text-slate-700">RAL {colorCode}</span>
          </div>
        )}
      </div>

      {/* Dimensions Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">Lungime</div>
          <div className="text-lg font-bold text-slate-800">{length} m</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">Înălțime</div>
          <div className="text-lg font-bold text-slate-800">{height.toFixed(2)} m</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">Soclu</div>
          <div className="text-lg font-bold text-slate-800">{base.toFixed(2)} m</div>
        </div>
      </div>

      {/* Calculation Summary - Material Needed (only in step 3) */}
      {currentStep === 3 && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-3">Calcul Necesar Șipci — {profileRange}</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Lățime șipcă:</span>
                <span className="font-bold text-green-900">{PROFILE_SPECS[profileRange].widthCm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Buc/metru liniar:</span>
                <span className="font-bold text-green-900">{PROFILE_SPECS[profileRange].piecesPerMeter} buc/ml</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">
                  {model === 'orizontal' ? 'Nr. rânduri:' : 'Nr. șipci:'}
                </span>
                <span className="font-bold text-green-900">{priceCalc.slats} buc</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Lungime șipcă:</span>
                <span className="font-bold text-green-900">{model === 'orizontal' ? (postDistance / 1000).toFixed(2) : (height - base).toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Total m liniari:</span>
                <span className="font-bold text-green-900">{priceCalc.totalMeters} m</span>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">* Calculul este orientativ. Cantitatea finală se stabilește la măsurători.</p>
          </div>

          {/* Price Estimate */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-amber-800 mb-3">Estimare Preț Șipci</h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-700">Profil:</span>
                <span className="font-medium text-amber-900">{profileRange} ({PROFILE_SPECS[profileRange].widthCm})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">
                  {model === 'orizontal' ? 'Rânduri șipci:' : 'Număr șipci:'}
                </span>
                <span className="font-medium text-amber-900">{priceCalc.slats} buc</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Total metri liniari:</span>
                <span className="font-medium text-amber-900">{priceCalc.totalMeters} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Preț/metru:</span>
                <span className="font-medium text-amber-900">{priceCalc.pricePerMeter.toFixed(2)} RON</span>
              </div>
              {doubleSided && priceCalc.doubleSidedSurcharge > 0 && (
                <div className="flex justify-between text-blue-700">
                  <span>incl. vopsit față/spate:</span>
                  <span className="font-medium">+{priceCalc.doubleSidedSurcharge.toFixed(2)} RON/ml</span>
                </div>
              )}

              <div className="border-t border-amber-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-amber-800 font-medium">TOTAL ESTIMAT:</span>
                    <span className="text-xs ml-2 px-2 py-0.5 bg-amber-200 rounded-full">
                      {region === 'EU' ? '🇪🇺 Europa' : '🇷🇴 Romania'}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-amber-600">{priceCalc.totalPrice.toFixed(2)} RON</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-amber-600 mt-3">
              * Prețul este orientativ și nu include stâlpi, porți sau montaj.
            </p>
          </div>
        </>
      )}

      {/* Model Badge */}
      <div className="text-center">
        <span className="inline-block bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
          Model {model === 'orizontal' ? 'ORIZONTAL' : 'VERTICAL'}
        </span>
      </div>
    </div>
  )
}
