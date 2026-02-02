'use client'

import { useConfiguratorStore } from '@/lib/configurator-store'
import { Ruler } from 'lucide-react'

export default function StepDimensions() {
  const { length, height, base, postDistance, setLength, setHeight, setBase, setPostDistance, setFocusedField } = useConfiguratorStore()

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <span className="text-amber-500">
          <Ruler className="w-7 h-7" />
        </span>
        Dimensiunile gardului
      </h3>

      <div className="space-y-8">
        {/* Length Slider */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-slate-700 font-medium">
              Lungimea totală a gardului (inclusiv stâlpii)
            </label>
            <span className="text-lg font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
              {length.toFixed(2)} metri
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="250"
            step="1"
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value))}
            onFocus={() => setFocusedField('length')}
            onMouseDown={() => setFocusedField('length')}
            onBlur={() => setFocusedField(null)}
            onMouseUp={() => setFocusedField(null)}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500
                       [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-orange-500
                       [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-amber-500/30
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-amber-400 [&::-moz-range-thumb]:to-orange-500
                       [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1m</span>
            <span>50m</span>
            <span>100m</span>
            <span>150m</span>
            <span>200m</span>
            <span>250m</span>
          </div>
        </div>

        {/* Height Slider */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-slate-700 font-medium">
              Înălțimea totală a gardului (inclusiv soclul)
            </label>
            <span className="text-lg font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
              {height.toFixed(2)} metri
            </span>
          </div>
          <input
            type="range"
            min="0.7"
            max="3.5"
            step="0.05"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value))}
            onFocus={() => setFocusedField('height')}
            onMouseDown={() => setFocusedField('height')}
            onBlur={() => setFocusedField(null)}
            onMouseUp={() => setFocusedField(null)}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500
                       [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-orange-500
                       [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-amber-500/30
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-amber-400 [&::-moz-range-thumb]:to-orange-500
                       [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0.7m</span>
            <span>1.4m</span>
            <span>2.1m</span>
            <span>2.8m</span>
            <span>3.5m</span>
          </div>
        </div>

        {/* Base/Soclu Slider */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-slate-700 font-medium">
              Înălțimea soclului (parapet)
            </label>
            <span className="text-lg font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
              {base.toFixed(2)} metri
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1.8"
            step="0.05"
            value={base}
            onChange={(e) => setBase(parseFloat(e.target.value))}
            onFocus={() => setFocusedField('base')}
            onMouseDown={() => setFocusedField('base')}
            onBlur={() => setFocusedField(null)}
            onMouseUp={() => setFocusedField(null)}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500
                       [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-orange-500
                       [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-amber-500/30
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-amber-400 [&::-moz-range-thumb]:to-orange-500
                       [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0m</span>
            <span>0.6m</span>
            <span>1.2m</span>
            <span>1.8m</span>
          </div>
        </div>

        {/* Post Distance Slider (Slat Length) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-slate-700 font-medium">
              Distanța dintre stâlpi (lungime șipcă)
            </label>
            <span className="text-lg font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
              {(postDistance / 1000).toFixed(2)} metri
            </span>
          </div>
          <input
            type="range"
            min="500"
            max="3000"
            step="50"
            value={postDistance}
            onChange={(e) => setPostDistance(parseFloat(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500
                       [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-orange-500
                       [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-amber-500/30
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-amber-400 [&::-moz-range-thumb]:to-orange-500
                       [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0.5m</span>
            <span>1m</span>
            <span>1.5m</span>
            <span>2m</span>
            <span>2.5m</span>
            <span>3m</span>
          </div>
        </div>
      </div>
    </div>
  )
}
