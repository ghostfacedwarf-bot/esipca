'use client'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export default function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  if (min >= max) return null

  const leftPercent = ((value[0] - min) / (max - min)) * 100
  const rightPercent = 100 - ((value[1] - min) / (max - min)) * 100

  return (
    <div>
      <div className="flex justify-between text-sm text-dark-600 mb-2">
        <span>{value[0].toFixed(2)} RON</span>
        <span>{value[1].toFixed(2)} RON</span>
      </div>
      <div className="relative h-6">
        {/* Track background */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-dark-200 rounded-full" />
        {/* Active range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-primary-500 rounded-full"
          style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={0.01}
          value={value[0]}
          onChange={(e) => {
            const newMin = Math.min(parseFloat(e.target.value), value[1] - 0.01)
            onChange([newMin, value[1]])
          }}
          className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
          aria-label="Pret minim"
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={0.01}
          value={value[1]}
          onChange={(e) => {
            const newMax = Math.max(parseFloat(e.target.value), value[0] + 0.01)
            onChange([value[0], newMax])
          }}
          className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
          aria-label="Pret maxim"
        />
      </div>
    </div>
  )
}
