'use client'

import { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'

declare global {
  interface Window {
    googleTranslateElementInit: () => void
    google: any
  }
}

const languages = [
  { code: 'ro', name: 'Română' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'hu', name: 'Magyar' },
  { code: 'pl', name: 'Polski' },
  { code: 'cs', name: 'Čeština' },
  { code: 'bg', name: 'Български' },
]

export default function GoogleTranslator() {
  const [isOpen, setIsOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Define callback function globally
    (window as any).googleTranslateElementInit = function () {
      try {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'ro',
            includedLanguages: 'ro,en,es,fr,de,it,hu,pl,cs,bg',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        )
        setLoaded(true)
      } catch (error) {
        console.error('Translation error:', error)
      }
    }

    // Load the script
    if (!window.google) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      document.body.appendChild(script)
    } else {
      ;(window as any).googleTranslateElementInit()
    }
  }, [])

  const handleLanguageSelect = (code: string) => {
    const element = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (element) {
      element.value = code
      // Create and dispatch change event
      const event = new Event('change', { bubbles: true })
      element.dispatchEvent(event)
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Google Translate Hidden Element */}
      <div id="google_translate_element" style={{ visibility: 'hidden', height: 0 }} />

      {/* Translator Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Translator"
        title="Traductor"
      >
        <Globe size={20} />
      </button>

      {/* Language Dropdown */}
      <div
        className={`fixed bottom-16 right-4 z-50 bg-white rounded-lg shadow-xl border border-primary-100 overflow-hidden transition-all ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ minWidth: '150px' }}
      >
        {/* Header */}
        <div className="bg-primary-600 text-white px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe size={14} />
            <span className="font-semibold text-sm">Limbă</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-primary-100 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Language List */}
        <div className="divide-y divide-dark-100">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className="w-full text-left px-3 py-2.5 text-sm text-dark-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
