import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n } = useTranslation()

  const setLang = (lng: 'nl' | 'en') => {
    void i18n.changeLanguage(lng)
  }

  return (
    <div className="fixed top-3 right-3 z-50 flex overflow-hidden rounded-full border-[3px] border-kantine-ink bg-kantine-cream text-xs font-black shadow-[3px_3px_0_0_var(--color-kantine-ink)]">
      <button
        type="button"
        onClick={() => setLang('nl')}
        className={`px-3 py-2 transition-colors ${
          i18n.resolvedLanguage === 'nl' ? 'bg-kantine-gold text-kantine-ink' : 'text-kantine-ink/50'
        }`}
        aria-pressed={i18n.resolvedLanguage === 'nl'}
      >
        NL
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-3 py-2 transition-colors ${
          i18n.resolvedLanguage === 'en' ? 'bg-kantine-gold text-kantine-ink' : 'text-kantine-ink/50'
        }`}
        aria-pressed={i18n.resolvedLanguage === 'en'}
      >
        EN
      </button>
    </div>
  )
}
