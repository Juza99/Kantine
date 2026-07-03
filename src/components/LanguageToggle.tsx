import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n } = useTranslation()

  const setLang = (lng: 'nl' | 'en') => {
    void i18n.changeLanguage(lng)
  }

  return (
    <div className="fixed top-3 right-3 z-50 flex overflow-hidden rounded-full border border-white/15 bg-black/30 text-xs font-semibold shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={() => setLang('nl')}
        className={`px-3 py-2 transition-colors ${
          i18n.resolvedLanguage === 'nl' ? 'bg-party-500 text-white' : 'text-white/70'
        }`}
        aria-pressed={i18n.resolvedLanguage === 'nl'}
      >
        NL
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-3 py-2 transition-colors ${
          i18n.resolvedLanguage === 'en' ? 'bg-party-500 text-white' : 'text-white/70'
        }`}
        aria-pressed={i18n.resolvedLanguage === 'en'}
      >
        EN
      </button>
    </div>
  )
}
