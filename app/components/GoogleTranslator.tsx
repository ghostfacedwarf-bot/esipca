'use client'

import { useEffect, useState, useCallback } from 'react'
import { Globe, X, Languages, Check } from 'lucide-react'

// Flag SVG Components
const FlagRO = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 20" className={className}>
    <rect x="0" y="0" width="10" height="20" fill="#002B7F" />
    <rect x="10" y="0" width="10" height="20" fill="#FCD116" />
    <rect x="20" y="0" width="10" height="20" fill="#CE1126" />
  </svg>
)

const FlagGB = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 20" className={className}>
    <rect width="30" height="20" fill="#012169" />
    <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" strokeWidth="4" />
    <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="2" />
    <path d="M15,0 V20 M0,10 H30" stroke="#fff" strokeWidth="6" />
    <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="4" />
  </svg>
)

const FlagDE = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 20" className={className}>
    <rect y="0" width="30" height="6.67" fill="#000" />
    <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
    <rect y="13.33" width="30" height="6.67" fill="#FFCC00" />
  </svg>
)

const FlagFR = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 20" className={className}>
    <rect x="0" width="10" height="20" fill="#002395" />
    <rect x="10" width="10" height="20" fill="#fff" />
    <rect x="20" width="10" height="20" fill="#ED2939" />
  </svg>
)

const FlagES = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 20" className={className}>
    <rect width="30" height="20" fill="#AA151B" />
    <rect y="5" width="30" height="10" fill="#F1BF00" />
  </svg>
)

const FlagIT = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 20" className={className}>
    <rect x="0" width="10" height="20" fill="#009246" />
    <rect x="10" width="10" height="20" fill="#fff" />
    <rect x="20" width="10" height="20" fill="#CE2B37" />
  </svg>
)

const FlagHU = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 20" className={className}>
    <rect y="0" width="30" height="6.67" fill="#CE2939" />
    <rect y="6.67" width="30" height="6.67" fill="#fff" />
    <rect y="13.33" width="30" height="6.67" fill="#477050" />
  </svg>
)

const FlagPL = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 20" className={className}>
    <rect y="0" width="30" height="10" fill="#fff" />
    <rect y="10" width="30" height="10" fill="#DC143C" />
  </svg>
)

const FlagBG = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 20" className={className}>
    <rect y="0" width="30" height="6.67" fill="#fff" />
    <rect y="6.67" width="30" height="6.67" fill="#00966E" />
    <rect y="13.33" width="30" height="6.67" fill="#D62612" />
  </svg>
)

const FlagNL = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 20" className={className}>
    <rect y="0" width="30" height="6.67" fill="#AE1C28" />
    <rect y="6.67" width="30" height="6.67" fill="#fff" />
    <rect y="13.33" width="30" height="6.67" fill="#21468B" />
  </svg>
)

const FlagPT = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 20" className={className}>
    <rect width="12" height="20" fill="#006600" />
    <rect x="12" width="18" height="20" fill="#FF0000" />
    <circle cx="12" cy="10" r="4" fill="#FFCC00" />
  </svg>
)

const FlagRU = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 20" className={className}>
    <rect y="0" width="30" height="6.67" fill="#fff" />
    <rect y="6.67" width="30" height="6.67" fill="#0039A6" />
    <rect y="13.33" width="30" height="6.67" fill="#D52B1E" />
  </svg>
)

const languages: { code: string; name: string; Flag: React.FC<{ className?: string }> }[] = [
  { code: 'ro', name: 'Română', Flag: FlagRO },
  { code: 'en', name: 'English', Flag: FlagGB },
  { code: 'de', name: 'Deutsch', Flag: FlagDE },
  { code: 'fr', name: 'Français', Flag: FlagFR },
  { code: 'es', name: 'Español', Flag: FlagES },
  { code: 'it', name: 'Italiano', Flag: FlagIT },
  { code: 'hu', name: 'Magyar', Flag: FlagHU },
  { code: 'pl', name: 'Polski', Flag: FlagPL },
  { code: 'bg', name: 'Български', Flag: FlagBG },
  { code: 'nl', name: 'Nederlands', Flag: FlagNL },
  { code: 'pt', name: 'Português', Flag: FlagPT },
  { code: 'ru', name: 'Русский', Flag: FlagRU },
]

export default function GoogleTranslator() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('ro')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load Google Translate script
  useEffect(() => {
    // Create hidden container for Google Translate
    let container = document.getElementById('google_translate_element')
    if (!container) {
      container = document.createElement('div')
      container.id = 'google_translate_element'
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '-9999px'
      document.body.appendChild(container)
    }

    // Define callback
    (window as any).googleTranslateElementInit = function () {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'ro',
          includedLanguages: languages.map(l => l.code).join(','),
          autoDisplay: false,
        },
        'google_translate_element'
      )
      setIsLoaded(true)
    }

    // Load script
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement('script')
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    } else if ((window as any).google?.translate) {
      setIsLoaded(true)
    }
  }, [])

  // Handle language selection
  const selectLanguage = useCallback((langCode: string) => {
    // Find the Google Translate select element
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (select) {
      select.value = langCode
      select.dispatchEvent(new Event('change', { bubbles: true }))
      setCurrentLang(langCode)
    }
    setIsOpen(false)
  }, [])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClick = (e: MouseEvent) => {
      const container = document.getElementById('translate-floating-container')
      if (container && !container.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isOpen])

  // Get current language info
  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0]

  return (
    <>
      <style jsx global>{`
        #translate-floating-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        #translate-toggle-btn {
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 20px rgba(22, 163, 74, 0.3);
          transition: all 0.3s ease;
          animation: slideInRight 0.5s ease-out;
        }

        #translate-toggle-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 30px rgba(22, 163, 74, 0.4);
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }

        #translate-popup {
          position: absolute;
          bottom: 70px;
          right: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 50px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          min-width: 240px;
          animation: popupSlideIn 0.3s ease-out;
        }

        @keyframes popupSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .translate-popup-header {
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 600;
        }

        .translate-popup-header span { flex: 1; }

        .translate-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .translate-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .translate-list {
          max-height: 320px;
          overflow-y: auto;
          padding: 8px;
        }

        .translate-list::-webkit-scrollbar {
          width: 6px;
        }

        .translate-list::-webkit-scrollbar-thumb {
          background: #16a34a;
          border-radius: 3px;
        }

        .translate-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          font-size: 15px;
          color: #1e293b;
        }

        .translate-item:hover {
          background: #f0fdf4;
        }

        .translate-item.active {
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
        }

        .translate-item .flag-icon {
          width: 28px;
          height: 20px;
          border-radius: 3px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          flex-shrink: 0;
        }

        .translate-item .name {
          flex: 1;
          font-weight: 500;
        }

        .translate-item .check {
          opacity: 0;
        }

        .translate-item.active .check {
          opacity: 1;
        }

        /* Hide Google elements */
        .goog-te-banner-frame.skiptranslate,
        #goog-gt-tt, .goog-te-balloon-frame,
        .skiptranslate iframe { display: none !important; }
        body { top: 0 !important; }

        /* Mobile */
        @media (max-width: 768px) {
          #translate-floating-container {
            bottom: 15px;
            right: 15px;
          }

          .translate-btn-text { display: none; }

          #translate-toggle-btn {
            width: 54px;
            height: 54px;
            padding: 0;
            border-radius: 50%;
            justify-content: center;
          }

          #translate-popup {
            bottom: 65px;
            min-width: 220px;
          }
        }

        @media (max-width: 480px) {
          #translate-popup {
            position: fixed;
            bottom: 80px;
            right: 15px;
            left: 15px;
            min-width: auto;
          }
        }
      `}</style>

      <div id="translate-floating-container">
        {!isOpen && (
          <button
            id="translate-toggle-btn"
            className="notranslate"
            translate="no"
            onClick={() => setIsOpen(true)}
            aria-label="Traducere"
          >
            <Languages size={20} />
            <span className="translate-btn-text notranslate" translate="no">Translate</span>
          </button>
        )}

        {isOpen && (
          <div id="translate-popup" className="notranslate" translate="no">
            <div className="translate-popup-header notranslate" translate="no">
              <Globe size={18} />
              <span>Selecteaza Limba</span>
              <button
                className="translate-close"
                onClick={() => setIsOpen(false)}
                aria-label="Inchide"
              >
                <X size={14} />
              </button>
            </div>
            <div className="translate-list notranslate" translate="no">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`translate-item ${currentLang === lang.code ? 'active' : ''}`}
                  onClick={() => selectLanguage(lang.code)}
                >
                  <lang.Flag className="flag-icon" />
                  <span className="name">{lang.name}</span>
                  <Check size={18} className="check" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
