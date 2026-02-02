'use client'

import { useConfiguratorStore } from '@/lib/configurator-store'
import { Settings, Plus, Minus, Info } from 'lucide-react'

export default function StepConfiguration() {
  const {
    model,
    autoGates,
    autoGatesConfig,
    pedestrianGates,
    pedestrianGateWidth,
    postDistance,
    setAutoGates,
    updateGateConfig,
    setPedestrianGates,
    setPedestrianGateWidth,
    setPostDistance,
  } = useConfiguratorStore()

  const handleQuantityChange = (
    current: number,
    change: number,
    min: number,
    max: number,
    setter: (value: number) => void
  ) => {
    const newValue = Math.max(min, Math.min(max, current + change))
    setter(newValue)
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <span className="text-amber-500">
          <Settings className="w-7 h-7" />
        </span>
        Configurația gardului
      </h3>

      <div className="space-y-6">
        {/* Auto Gates */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-slate-700">Porți auto</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(autoGates, -1, 0, 3, setAutoGates)}
                className="w-10 h-10 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="w-12 text-center text-lg font-bold">{autoGates}</span>
              <button
                onClick={() => handleQuantityChange(autoGates, 1, 0, 3, setAutoGates)}
                className="w-10 h-10 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {autoGates > 0 && (
            <div className="space-y-3">
              {autoGatesConfig.map((gate, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-sm text-slate-600 font-medium">
                    Poartă {index + 1}:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={gate.width}
                      onChange={(e) => updateGateConfig(index, { width: parseInt(e.target.value) || 3500 })}
                      min={2000}
                      max={7000}
                      step={100}
                      className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center"
                    />
                    <span className="text-sm text-slate-500">mm</span>
                  </div>
                  <span className="text-xs text-slate-400">({(gate.width / 1000).toFixed(1)}m)</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pedestrian Gates */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-slate-700">Porți pietonale</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(pedestrianGates, -1, 0, 3, setPedestrianGates)}
                className="w-10 h-10 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="w-12 text-center text-lg font-bold">{pedestrianGates}</span>
              <button
                onClick={() => handleQuantityChange(pedestrianGates, 1, 0, 3, setPedestrianGates)}
                className="w-10 h-10 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {pedestrianGates > 0 && (
            <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-sm text-slate-600 font-medium">Lățime:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={pedestrianGateWidth}
                  onChange={(e) => setPedestrianGateWidth(parseInt(e.target.value) || 1000)}
                  min={800}
                  max={1500}
                  step={50}
                  className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center"
                />
                <span className="text-sm text-slate-500">mm</span>
              </div>
              <span className="text-xs text-slate-400">({(pedestrianGateWidth / 1000).toFixed(1)}m)</span>
            </div>
          )}
        </div>

        {/* Distance Between Posts - Only for horizontal model */}
        {model === 'orizontal' && (
          <div className="p-4 rounded-xl border-2 bg-amber-50 border-amber-300">
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Info size={18} className="text-amber-500" />
              Distanța dintre stâlpi
              <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full">
                = Lungimea șipcii
              </span>
            </h4>

            <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-sm text-slate-600 font-medium">Distanță:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={postDistance}
                  onChange={(e) => setPostDistance(parseInt(e.target.value) || 2200)}
                  min={1500}
                  max={3000}
                  step={50}
                  className="w-28 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center"
                />
                <span className="text-sm text-slate-500">mm</span>
              </div>
              <span className="text-xs text-slate-400">({(postDistance / 1000).toFixed(2)}m)</span>
            </div>

            <p className="mt-3 text-sm text-amber-700">
              Pentru modelul orizontal, șipcile se taie la lungimea de <strong>{postDistance} mm</strong> pentru a încăpea între stâlpi.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
