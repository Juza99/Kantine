import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Screen } from '../components/Screen'
import { CameraCapture } from '../components/CameraCapture'
import { useGameStore } from '../store/gameStore'
import { sendAnswer } from '../hooks/useRoomConnection'
import type { LocalizedText } from '../types/room'

function useLocalizedText() {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage === 'en' ? 'en' : 'nl'
  return (text: LocalizedText) => text[lang]
}

export function AnsweringScreen() {
  const { t } = useTranslation()
  const localize = useLocalizedText()
  const [selected, setSelected] = useState<string | null>(null)

  const question = useGameStore((s) => s.currentQuestion)
  const roundIndex = useGameStore((s) => s.roundIndex)
  const totalRounds = useGameStore((s) => s.totalRounds)
  const answeredCount = useGameStore((s) => s.answeredCount)
  const totalToAnswer = useGameStore((s) => s.totalToAnswer)
  const hasAnswered = useGameStore((s) => s.hasAnswered)

  if (!question) return null

  function submit(value: string) {
    if (!question) return
    setSelected(value)
    sendAnswer(question.id, value)
  }

  return (
    <Screen>
      <p className="text-sm font-bold tracking-wide text-kantine-cream/60 uppercase">
        {t('answering.roundLabel', { current: roundIndex, total: totalRounds })}
      </p>

      <h1 className="font-display text-2xl text-kantine-cream" data-testid="question-type" data-question-type={question.type}>
        {localize(question.prompt)}
      </h1>

      {hasAnswered ? (
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-kantine-cream/25 border-t-kantine-gold" />
          <p className="font-semibold text-kantine-cream/70">
            {t('answering.waiting', { answered: answeredCount, total: totalToAnswer })}
          </p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3">
          {question.type === 'vote' &&
            question.choices.map((player) => (
              <button
                key={player.id}
                type="button"
                data-testid="answer-choice"
                onClick={() => submit(player.id)}
                className={`w-full rounded-2xl border-[3px] border-kantine-ink px-6 py-4 text-lg font-bold shadow-[3px_3px_0_0_var(--color-kantine-ink)] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
                  selected === player.id
                    ? 'bg-kantine-gold text-kantine-ink'
                    : 'bg-kantine-cream text-kantine-ink'
                }`}
              >
                {player.name}
              </button>
            ))}

          {question.type === 'guess' && (
            <>
              <p className="text-sm font-semibold text-kantine-cream/60">
                {question.isSubject ? t('answering.subjectHint') : t('answering.guesserHint')}
              </p>
              {question.options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  data-testid="answer-choice"
                  onClick={() => submit(String(index))}
                  className={`w-full rounded-2xl border-[3px] border-kantine-ink px-6 py-4 text-lg font-bold shadow-[3px_3px_0_0_var(--color-kantine-ink)] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
                    selected === String(index)
                      ? 'bg-kantine-gold text-kantine-ink'
                      : 'bg-kantine-cream text-kantine-ink'
                  }`}
                >
                  {localize(option)}
                </button>
              ))}
            </>
          )}

          {question.type === 'photo' && <CameraCapture onCapture={(dataUrl) => submit(dataUrl)} />}
        </div>
      )}
    </Screen>
  )
}
