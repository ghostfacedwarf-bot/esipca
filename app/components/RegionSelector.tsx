'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useRegionStore, Region } from '@/lib/store'

// Romania flag component
function RomaniaFlag({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-label="Romania">
      <rect x="0" y="0" width="10" height="20" fill="#002B7F" />
      <rect x="10" y="0" width="10" height="20" fill="#FCD116" />
      <rect x="20" y="0" width="10" height="20" fill="#CE1126" />
    </svg>
  )
}

// EU flag component
function EUFlag({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-label="Europa">
      <rect width="30" height="20" fill="#003399" />
      <g fill="#FFCC00">
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180)
          const cx = 15 + 6 * Math.cos(angle)
          const cy = 10 + 6 * Math.sin(angle)
          return (
            <polygon
              key={i}
              points={`${cx},${cy - 1.5} ${cx + 0.5},${cy - 0.5} ${cx + 1.5},${cy - 0.5} ${cx + 0.7},${cy + 0.3} ${cx + 1},${cy + 1.5} ${cx},${cy + 0.8} ${cx - 1},${cy + 1.5} ${cx - 0.7},${cy + 0.3} ${cx - 1.5},${cy - 0.5} ${cx - 0.5},${cy - 0.5}`}
            />
          )
        })}
      </g>
    </svg>
  )
}

const regions: { code: Region; label: string; Flag: React.FC<{ className?: string }> }[] = [
  { code: 'RO', label: 'Romania', Flag: RomaniaFlag },
  { code: 'EU', label: 'Europa', Flag: EUFlag },
]

export default function RegionSelector() {
  const { region, setRegion, isLoading } = useRegionStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentRegion = regions.find((r) => r.code === region) || regions[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (code: Region) => {
    setRegion(code)
    setIsOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 text-sm text-dark-400">
        <span className="animate-pulse">...</span>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 text-sm text-dark-700 md:text-white hover:text-primary-600 md:hover:text-accent-400 transition-colors rounded"
        aria-label="Selecteaza regiunea"
        aria-expanded={isOpen}
      >
        <currentRegion.Flag className="w-6 h-4 rounded-sm shadow-sm" />
        <span className="hidden sm:inline">{currentRegion.label}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-dark-200 rounded-lg shadow-lg z-50 min-w-[140px] overflow-hidden">
          {regions.map((r) => (
            <button
              key={r.code}
              onClick={() => handleSelect(r.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                r.code === region
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-dark-700 hover:bg-dark-50'
              }`}
            >
              <r.Flag className="w-6 h-4 rounded-sm shadow-sm" />
              <span>{r.label}</span>
              {r.code === region && (
                <span className="ml-auto text-primary-600">✓</span>
              )}
            </button>
          ))}
          <div className="px-3 py-2 text-xs text-dark-500 border-t border-dark-100 bg-dark-50">
            Preturi in RON
          </div>
        </div>
      )}
    </div>
  )
}
