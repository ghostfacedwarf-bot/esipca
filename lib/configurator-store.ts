import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GateConfig {
  type: 'batanta' | 'culisanta' | 'autoportanta'
  width: number
  integratedPedestrian: boolean
}

// Profile specifications based on esipcametalica.ro
export interface ProfileSpec {
  name: string
  widthMm: number
  widthCm: string
  piecesPerMeter: number
  grooves: string
}

export const PROFILE_SPECS: Record<string, ProfileSpec> = {
  // P1-P9: 9cm width, 10 buc/ml
  'P1-P9': { name: 'P1-P9', widthMm: 90, widthCm: '9 cm', piecesPerMeter: 10, grooves: '2 cute cu vârf semirotund' },
  // P10-P18: 11.5cm width, 8 buc/ml
  'P10-P18': { name: 'P10-P18', widthMm: 115, widthCm: '11.5 cm', piecesPerMeter: 8, grooves: '3 cute cu margini fălțuite' },
  // P19-P27: 10cm width, 9 buc/ml
  'P19-P27': { name: 'P19-P27', widthMm: 100, widthCm: '10 cm', piecesPerMeter: 9, grooves: '3 cute cu margini fălțuite' },
}

export type ProfileRange = 'P1-P9' | 'P10-P18' | 'P19-P27'

export interface ConfiguratorState {
  // Step 1: Model
  model: 'orizontal' | 'vertical' | ''

  // Step 2: Dimensions
  length: number
  height: number
  base: number

  // Step 3: Configuration
  autoGates: number
  autoGatesConfig: GateConfig[]
  pedestrianGates: number
  pedestrianGateWidth: number
  panels: number
  postDistance: number // Distance between posts in mm (for horizontal = slat length), user-editable

  // Step 4: Color
  color: string
  colorHex: string
  colorCode: string

  // Step 5: Slats
  profileRange: ProfileRange
  slatWidth: number
  slatGap: 'mica' | 'medie' | 'mare'
  doubleSided: boolean // Vopsit față/spate

  // Step 6: Contact
  contactForm: {
    nume: string
    prenume: string
    email: string
    telefon: string
    judet: string
    prefabricat: boolean
  }

  // Navigation
  currentStep: number
  completedSteps: number[]

  // UI State
  focusedField: 'length' | 'height' | 'base' | null
}

interface ConfiguratorActions {
  // Model
  setModel: (model: 'orizontal' | 'vertical') => void

  // Dimensions
  setLength: (length: number) => void
  setHeight: (height: number) => void
  setBase: (base: number) => void

  // Configuration
  setAutoGates: (count: number) => void
  updateGateConfig: (index: number, config: Partial<GateConfig>) => void
  setPedestrianGates: (count: number) => void
  setPedestrianGateWidth: (width: number) => void
  setPanels: (count: number) => void
  setPostDistance: (distance: number) => void

  // Color
  setColor: (color: string, hex: string, code: string) => void

  // Slats
  setProfileRange: (range: ProfileRange) => void
  setSlatWidth: (width: number) => void
  setSlatGap: (gap: 'mica' | 'medie' | 'mare') => void
  setDoubleSided: (value: boolean) => void

  // Contact
  setContactField: (field: keyof ConfiguratorState['contactForm'], value: string | boolean) => void

  // Navigation
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  reset: () => void

  // Calculations
  calculatePanels: () => { panels: number; referenceLength: number }
  calculatePanelLimits: () => { min: number; max: number }

  // UI
  setFocusedField: (field: 'length' | 'height' | 'base' | null) => void
}

const initialState: ConfiguratorState = {
  model: '',
  length: 20,
  height: 1.9,
  base: 0,
  autoGates: 1,
  autoGatesConfig: [{ type: 'batanta', width: 3500, integratedPedestrian: false }],
  pedestrianGates: 1,
  pedestrianGateWidth: 1000,
  panels: 7,
  postDistance: 2200, // Default 2.2m between posts
  color: '',
  colorHex: '',
  colorCode: '0',
  profileRange: 'P1-P9',
  slatWidth: 90, // Default for P1-P9
  slatGap: 'mica',
  doubleSided: false,
  contactForm: {
    nume: '',
    prenume: '',
    email: '',
    telefon: '',
    judet: '',
    prefabricat: false,
  },
  currentStep: 1,
  completedSteps: [],
  focusedField: null,
}

export const useConfiguratorStore = create<ConfiguratorState & ConfiguratorActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setModel: (model) => {
        set({ model })
        // Reset integrated pedestrian for vertical model
        if (model === 'vertical') {
          const newConfig = get().autoGatesConfig.map((g) => ({
            ...g,
            integratedPedestrian: false,
          }))
          set({ autoGatesConfig: newConfig })
        }
      },

      setLength: (length) => {
        set({ length })
        // Recalculate panels
        const { panels } = get().calculatePanels()
        set({ panels })
      },

      setHeight: (height) => {
        // Only update height, base is independent
        set({ height })
      },

      setBase: (base) => set({ base }),

      setAutoGates: (count) => {
        const currentConfig = get().autoGatesConfig
        const newConfig: GateConfig[] = []

        for (let i = 0; i < count; i++) {
          newConfig.push(
            currentConfig[i] || {
              type: 'batanta',
              width: 3500,
              integratedPedestrian: false,
            }
          )
        }

        set({ autoGates: count, autoGatesConfig: newConfig })
        // Recalculate panels
        const { panels } = get().calculatePanels()
        set({ panels })
      },

      updateGateConfig: (index, config) => {
        const newConfig = [...get().autoGatesConfig]
        newConfig[index] = { ...newConfig[index], ...config }
        set({ autoGatesConfig: newConfig })
      },

      setPedestrianGates: (count) => {
        set({ pedestrianGates: count })
        // Recalculate panels
        const { panels } = get().calculatePanels()
        set({ panels })
      },

      setPedestrianGateWidth: (width) => set({ pedestrianGateWidth: width }),

      setPanels: (count) => set({ panels: count }),

      setPostDistance: (distance) => set({ postDistance: distance }),

      setColor: (color, hex, code) => set({ color, colorHex: hex, colorCode: code }),

      setProfileRange: (range) => {
        const spec = PROFILE_SPECS[range]
        set({ profileRange: range, slatWidth: spec.widthMm })
      },

      setSlatWidth: (width) => {
        set({ slatWidth: width })
        // If width >= 80 and gap is 'mare', change to 'medie'
        if (width >= 80 && get().slatGap === 'mare') {
          set({ slatGap: 'medie' })
        }
      },

      setSlatGap: (gap) => set({ slatGap: gap }),

      setDoubleSided: (value) => set({ doubleSided: value }),

      setContactField: (field, value) => {
        set({
          contactForm: {
            ...get().contactForm,
            [field]: value,
          },
        })
      },

      nextStep: () => {
        const { currentStep, completedSteps } = get()
        if (currentStep < 4) {
          set({
            currentStep: currentStep + 1,
            completedSteps: completedSteps.includes(currentStep)
              ? completedSteps
              : [...completedSteps, currentStep],
          })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 })
        }
      },

      goToStep: (step) => {
        if (step >= 1 && step <= 4) {
          set({ currentStep: step })
        }
      },

      reset: () => set(initialState),

      calculatePanels: () => {
        const state = get()
        const { length, autoGates, pedestrianGates, autoGatesConfig } = state

        // Calculate total gate width
        let totalGateWidth = pedestrianGates * 1.0 // 1m each

        autoGatesConfig.forEach((gate) => {
          totalGateWidth += gate.width / 1000
        })

        const availableSpace = length - totalGateWidth
        const totalGates = autoGates + pedestrianGates

        if (availableSpace <= 0.5 && totalGates > 0) {
          return { panels: 0, referenceLength: 0 }
        }

        // Calculate recommended panels
        let recommendedPanels: number
        if (autoGates === 0) {
          recommendedPanels = Math.round(length / 2.222)
        } else {
          if (length === 15) recommendedPanels = 5
          else if (length === 20) recommendedPanels = 7
          else if (length === 25) recommendedPanels = 9
          else if (length <= 5) recommendedPanels = Math.max(1, Math.floor(length / 3))
          else recommendedPanels = Math.round(length / 2.857)
        }

        // Reduce panels based on gates
        if (autoGates > 1) {
          if (pedestrianGates > 0) {
            recommendedPanels -= autoGates
          } else {
            recommendedPanels -= autoGates - 1
          }
        }

        recommendedPanels = Math.max(0, recommendedPanels)

        // Calculate reference length
        const lengthMm = length * 1000
        const referenceLength = Math.round(lengthMm / (recommendedPanels + totalGates * 2.1))

        return { panels: recommendedPanels, referenceLength }
      },

      calculatePanelLimits: () => {
        return { min: 1, max: 26 }
      },

      setFocusedField: (field) => set({ focusedField: field }),
    }),
    {
      name: 'fence-configurator',
      partialize: (state) => ({
        model: state.model,
        length: state.length,
        height: state.height,
        base: state.base,
        autoGates: state.autoGates,
        autoGatesConfig: state.autoGatesConfig,
        pedestrianGates: state.pedestrianGates,
        pedestrianGateWidth: state.pedestrianGateWidth,
        panels: state.panels,
        postDistance: state.postDistance,
        color: state.color,
        colorHex: state.colorHex,
        colorCode: state.colorCode,
        profileRange: state.profileRange,
        slatWidth: state.slatWidth,
        slatGap: state.slatGap,
      }),
    }
  )
)

// RAL Colors
export const RAL_COLORS = [
  { name: 'RAL 7042', hex: '#C0C2C4', code: '7042' },
  { name: 'RAL 7005', hex: '#8D8F91', code: '7005' },
  { name: 'RAL 7016', hex: '#474B4E', code: '7016' },
  { name: 'RAL 9005', hex: '#1E1E20', code: '9005' },
  { name: 'RAL 9006', hex: '#BABDBC', code: '9006' },
  { name: 'RAL 9016', hex: '#F4F4F0', code: '9016' },
  { name: 'RAL 3016', hex: '#842923', code: '3016' },
  { name: 'RAL 3009', hex: '#8E402A', code: '3009' },
  { name: 'RAL 8003', hex: '#59351F', code: '8003' },
  { name: 'RAL 8004', hex: '#6C3B2A', code: '8004' },
  { name: 'RAL 8011', hex: '#734235', code: '8011' },
  { name: 'RAL 8017', hex: '#3E3B32', code: '8017' },
  { name: 'RAL 8019', hex: '#211F20', code: '8019' },
  { name: 'RAL 8023', hex: '#A65E2E', code: '8023' },
  { name: 'RAL 5010', hex: '#0047AB', code: '5010' },
  { name: 'RAL 5012', hex: '#1E3A8A', code: '5012' },
  { name: 'RAL 6000', hex: '#237447', code: '6000' },
  { name: 'RAL 6005', hex: '#2D572C', code: '6005' },
]

// Județe România
export const JUDETE = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
  'Brașov', 'Brăila', 'București', 'Buzău', 'Caraș-Severin', 'Călărași',
  'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj',
  'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea'
]
