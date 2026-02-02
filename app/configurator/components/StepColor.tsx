'use client'

import { useState, useRef, useEffect } from 'react'
import { useConfiguratorStore, PROFILE_SPECS, ProfileRange } from '@/lib/configurator-store'
import { Layers, Check, ChevronDown } from 'lucide-react'
import Image from 'next/image'

// Individual slat profiles with real product names and images from database
const SLAT_PROFILES: Record<ProfileRange, { id: string; name: string; fullName: string; image: string }[]> = {
  'P1-P9': [
    { id: 'P1', name: 'P1', fullName: 'Șipcă Metalică P1 - 7024 MAT', image: '/images/products/Sipca Metalica P1 7024 MAT.jpg' },
    { id: 'P2', name: 'P2', fullName: 'Șipcă Metalică P2 - Zincat (AL ZN)', image: '/images/products/Sipca Metalica P2 Zincat.jpg' },
    { id: 'P3', name: 'P3', fullName: 'Șipcă Metalică P3 - 8017 MAT', image: '/images/products/Sipca Metalica P3 8017 MAT.jpg' },
    { id: 'P4', name: 'P4', fullName: 'Șipcă Metalică P4 - Stejar (3D)', image: '/images/products/Sipca Metalica P4 Stejar.jpg' },
    { id: 'P5', name: 'P5', fullName: 'Șipcă Metalică P5 - 8019 MAT', image: '/images/products/Sipca Metalica P5 8019 MAT.jpg' },
    { id: 'P6', name: 'P6', fullName: 'Șipcă Metalică P6 - 3011 LUCIOS', image: '/images/products/Sipca Metalica P6 3011 LUCIOS.jpg' },
    { id: 'P7', name: 'P7', fullName: 'Șipcă Metalică P7 - 8017 LUCIOS', image: '/images/products/Sipca Metalica P7 8017 LUCIOS.jpg' },
    { id: 'P8', name: 'P8', fullName: 'Șipcă Metalică P8 - 8004 MAT', image: '/images/products/Sipca Metalica P8 8004 MAT.jpg' },
    { id: 'P9', name: 'P9', fullName: 'Șipcă Metalică P9 - 9005 MAT', image: '/images/products/Sipca Metalica P9 9005 MAT.jpg' },
  ],
  'P10-P18': [
    { id: 'P10', name: 'P10', fullName: 'Șipcă Metalică P10 - 7024 MAT', image: '/images/products/Sipca Metalica P10 7024 MAT.jpg' },
    { id: 'P11', name: 'P11', fullName: 'Șipcă Metalică P11 - 5010 LUCIOS', image: '/images/products/Sipca Metalica P11 5010 LUCIOS.jpg' },
    { id: 'P12', name: 'P12', fullName: 'Șipcă Metalică P12 - 8017 MAT', image: '/images/products/Sipca Metalica P12 8017 MAT.jpg' },
    { id: 'P13', name: 'P13', fullName: 'Șipcă Metalică P13 - Stejar (3D)', image: '/images/products/Sipca Metalica P13 Stejar.jpg' },
    { id: 'P14', name: 'P14', fullName: 'Șipcă Metalică P14 - 8019 MAT', image: '/images/products/Sipca Metalica P14 8019 MAT.jpg' },
    { id: 'P15', name: 'P15', fullName: 'Șipcă Metalică P15 - 3011 LUCIOS', image: '/images/products/Sipca Metalica P15 3011 LUCIOS.jpg' },
    { id: 'P16', name: 'P16', fullName: 'Șipcă Metalică P16 - 8017 LUCIOS', image: '/images/products/Sipca Metalica P16 8017 LUCIOS.jpg' },
    { id: 'P17', name: 'P17', fullName: 'Șipcă Metalică P17 - 8004 MAT', image: '/images/products/Sipca Metalica P17 8004 MAT.jpg' },
    { id: 'P18', name: 'P18', fullName: 'Șipcă Metalică P18 - 9005 MAT', image: '/images/products/Sipca Metalica P18 9005 MAT.jpg' },
  ],
  'P19-P27': [
    { id: 'P19', name: 'P19', fullName: 'Șipcă Metalică P19 - 7024 MAT', image: '/images/products/Sipca Metalica P19 7024 MAT.jpg' },
    { id: 'P20', name: 'P20', fullName: 'Șipcă Metalică P20 - Zincat (AL ZN)', image: '/images/products/Sipca Metalica P20 Zincat.jpg' },
    { id: 'P21', name: 'P21', fullName: 'Șipcă Metalică P21 - 8017 MAT', image: '/images/products/Sipca Metalica P21 8017 MAT.jpg' },
    { id: 'P22', name: 'P22', fullName: 'Șipcă Metalică P22 - Stejar (3D)', image: '/images/products/Sipca Metalica P22 Stejar.jpg' },
    { id: 'P23', name: 'P23', fullName: 'Șipcă Metalică P23 - 8019 MAT', image: '/images/products/Sipca Metalica P23 8019 MAT.jpg' },
    { id: 'P24', name: 'P24', fullName: 'Șipcă Metalică P24 - 3011 LUCIOS', image: '/images/products/Sipca Metalica P24 3011 LUCIOS.jpg' },
    { id: 'P25', name: 'P25', fullName: 'Șipcă Metalică P25 - 8017 LUCIOS', image: '/images/products/Sipca Metalica P25 8017 LUCIOS.jpg' },
    { id: 'P26', name: 'P26', fullName: 'Șipcă Metalică P26 - 8004 MAT', image: '/images/products/Sipca Metalica P26 8004 MAT.jpg' },
    { id: 'P27', name: 'P27', fullName: 'Șipcă Metalică P27 - 9005 MAT', image: '/images/products/Sipca Metalica P27 9005 MAT.jpg' },
  ],
}

const WIDTH_CATEGORIES = [
  {
    range: 'P1-P9' as ProfileRange,
    label: 'Lățime 9 cm',
    description: '10 bucăți per metru liniar',
    highlight: 'Popular',
  },
  {
    range: 'P10-P18' as ProfileRange,
    label: 'Lățime 11.5 cm',
    description: '8 bucăți per metru liniar',
    highlight: 'Lat',
  },
  {
    range: 'P19-P27' as ProfileRange,
    label: 'Lățime 10 cm',
    description: '9 bucăți per metru liniar',
    highlight: 'Mediu',
  },
]

export default function StepColor() {
  const {
    profileRange,
    color,
    doubleSided,
    setProfileRange,
    setColor,
    setDoubleSided,
  } = useConfiguratorStore()

  const [openDropdown, setOpenDropdown] = useState<ProfileRange | null>(null)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        if (!dropdownRefs.current[openDropdown]?.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  const selectedSlatId = color || 'P1'

  // Find selected slat details
  const getSelectedSlat = () => {
    for (const profiles of Object.values(SLAT_PROFILES)) {
      const found = profiles.find(p => p.id === selectedSlatId)
      if (found) return found
    }
    return SLAT_PROFILES['P1-P9'][0]
  }

  const selectedSlat = getSelectedSlat()

  const handleSelectWidth = (range: ProfileRange) => {
    setProfileRange(range)
    // Select first profile from this range if current selection is from different range
    const currentSlat = SLAT_PROFILES[range].find(p => p.id === selectedSlatId)
    if (!currentSlat) {
      const firstProfile = SLAT_PROFILES[range][0]
      setColor(firstProfile.id, '', firstProfile.id)
    }
    setOpenDropdown(range)
  }

  const handleSelectProfile = (profile: { id: string; name: string; fullName: string }) => {
    setColor(profile.id, '', profile.id)
    setOpenDropdown(null)
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <span className="text-amber-500">
          <Layers className="w-7 h-7" />
        </span>
        Alegeți modelul de șipcă
      </h3>

      {/* Width Category Selection - Vertical Stack */}
      <div className="flex flex-col gap-4 mb-8">
        {WIDTH_CATEGORIES.map((category) => {
          const spec = PROFILE_SPECS[category.range]
          const isSelected = profileRange === category.range
          const profiles = SLAT_PROFILES[category.range]
          const selectedInCategory = profiles.find(p => p.id === selectedSlatId)

          return (
            <div
              key={category.range}
              ref={(el) => { dropdownRefs.current[category.range] = el }}
              className="relative"
            >
              {/* Width Card */}
              <button
                onClick={() => handleSelectWidth(category.range)}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 shadow-lg ring-2 ring-amber-200'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md bg-white'
                }`}
              >
                {/* Badge */}
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${
                  isSelected ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {category.highlight}
                </span>

                {/* Check mark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white">
                    <Check size={14} />
                  </div>
                )}

                {/* Width info */}
                <div className={`text-2xl font-bold mb-1 ${isSelected ? 'text-amber-700' : 'text-slate-700'}`}>
                  {category.label}
                </div>
                <div className="text-sm text-slate-600 mb-3">
                  {category.description}
                </div>

                {/* Specs */}
                <div className={`text-xs ${isSelected ? 'text-amber-600' : 'text-slate-500'}`}>
                  {spec.widthMm}mm • {spec.grooves}
                </div>

                {/* Selected profile dropdown trigger */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-amber-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Profile image placeholder */}
                        <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                          <Image
                            src={selectedInCategory?.image || selectedSlat.image}
                            alt={selectedInCategory?.fullName || selectedSlat.fullName}
                            width={48}
                            height={48}
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.parentElement!.innerHTML = `<span class="text-sm font-bold text-slate-500">${selectedInCategory?.name || selectedSlat.name}</span>`
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-amber-800">
                            {selectedInCategory?.fullName || selectedSlat.fullName}
                          </div>
                          <div className="text-xs text-amber-600">Click pentru a schimba</div>
                        </div>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-amber-500 transition-transform ${openDropdown === category.range ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                )}
              </button>

              {/* Dropdown */}
              {openDropdown === category.range && (
                <div className="absolute z-20 w-full mt-2 bg-white border-2 border-amber-400 rounded-xl shadow-xl max-h-80 overflow-y-auto">
                  {profiles.map((profile) => {
                    const isProfileSelected = selectedSlatId === profile.id

                    return (
                      <button
                        key={profile.id}
                        onClick={() => handleSelectProfile(profile)}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-amber-50 transition-colors ${
                          isProfileSelected ? 'bg-amber-100' : ''
                        } ${profile.id === profiles[0].id ? 'rounded-t-xl' : ''} ${
                          profile.id === profiles[profiles.length - 1].id ? 'rounded-b-xl' : ''
                        }`}
                      >
                        {/* Profile image */}
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          <Image
                            src={profile.image}
                            alt={profile.fullName}
                            width={40}
                            height={40}
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.parentElement!.innerHTML = `<span class="text-xs font-bold text-slate-500">${profile.name}</span>`
                            }}
                          />
                        </div>

                        {/* Profile info */}
                        <div className="flex-1 text-left">
                          <div className={`font-medium ${isProfileSelected ? 'text-amber-700' : 'text-slate-700'}`}>
                            {profile.fullName}
                          </div>
                        </div>

                        {/* Check */}
                        {isProfileSelected && (
                          <Check size={18} className="text-amber-500" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected Profile Preview */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
            <Image
              src={selectedSlat.image}
              alt={selectedSlat.fullName}
              width={80}
              height={80}
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.parentElement!.innerHTML = `<span class="text-2xl font-bold text-slate-400">${selectedSlat.name}</span>`
              }}
            />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-800">{selectedSlat.fullName}</div>
            <div className="text-sm text-slate-600">
              Lățime: <strong>{PROFILE_SPECS[profileRange].widthMm}mm</strong> ({PROFILE_SPECS[profileRange].widthCm})
            </div>
            <div className="text-sm text-amber-600 font-medium">
              {PROFILE_SPECS[profileRange].piecesPerMeter} bucăți per metru liniar
            </div>
          </div>
        </div>
      </div>

      {/* Double-sided painting option */}
      {(() => {
        const isZincat = selectedSlat.fullName.toLowerCase().includes('zincat')
        const isStejar = selectedSlat.fullName.toLowerCase().includes('stejar')
        const isEligible = !isZincat && !isStejar
        const isLucios = selectedSlat.fullName.toLowerCase().includes('lucios')
        const surcharge = isLucios ? 0.10 : 0.30
        const finishType = isLucios ? 'lucios' : 'mat'

        if (!isEligible) {
          // Reset doubleSided if product becomes ineligible
          if (doubleSided) setDoubleSided(false)
          return null
        }

        return (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={doubleSided}
                onChange={(e) => setDoubleSided(e.target.checked)}
                className="mt-1 w-5 h-5 text-amber-500 focus:ring-amber-500 rounded border-slate-300"
              />
              <div>
                <div className="font-medium text-slate-800">
                  Vopsit {finishType} față / {finishType} spate
                </div>
                <div className="text-sm text-blue-600 font-semibold">
                  +{surcharge.toFixed(2)} RON/ml
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Șipca va fi vopsită pe ambele părți pentru un aspect uniform
                </div>
              </div>
            </label>
          </div>
        )
      })()}

    </div>
  )
}
