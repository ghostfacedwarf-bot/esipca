// Free translation using LibreTranslate or Google Translate (via free API)
// We'll use MyMemory API which has a free tier (1000 words/day, 10000 chars/request)

const MYMEMORY_API = 'https://api.mymemory.translated.net/get'

interface TranslateResult {
  translatedText: string
  detectedLang: string
}

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'auto'
): Promise<TranslateResult> {
  try {
    // If source is auto, we need to detect first
    const langPair = sourceLang === 'auto' ? `autodetect|${targetLang}` : `${sourceLang}|${targetLang}`

    const response = await fetch(
      `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${langPair}`
    )

    if (!response.ok) {
      throw new Error('Translation API failed')
    }

    const data = await response.json()

    if (data.responseStatus !== 200) {
      // Fallback: return original text
      console.error('Translation error:', data.responseDetails)
      return { translatedText: text, detectedLang: sourceLang }
    }

    const detectedLang = data.responseData?.detectedLanguage || sourceLang
    const translatedText = data.responseData?.translatedText || text

    return {
      translatedText,
      detectedLang: detectedLang === 'autodetect' ? 'unknown' : detectedLang,
    }
  } catch (error) {
    console.error('Translation error:', error)
    return { translatedText: text, detectedLang: sourceLang }
  }
}

// Detect language only
export async function detectLanguage(text: string): Promise<string> {
  try {
    // Use a small translation request to detect language
    const response = await fetch(
      `${MYMEMORY_API}?q=${encodeURIComponent(text.substring(0, 100))}&langpair=autodetect|en`
    )

    if (!response.ok) return 'unknown'

    const data = await response.json()
    return data.responseData?.detectedLanguage || 'unknown'
  } catch {
    return 'unknown'
  }
}

// Language names for display
export const LANGUAGE_NAMES: Record<string, string> = {
  ro: 'Română',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  hu: 'Magyar',
  bg: 'Български',
  pl: 'Polski',
  nl: 'Nederlands',
  unknown: 'Unknown',
}
