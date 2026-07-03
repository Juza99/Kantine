export type Player = {
  id: string
  name: string
}

export type RoomPhase = 'lobby' | 'starting' | 'playing' | 'gameover'

export const MAX_PLAYERS = 8
export const MIN_PLAYERS_TO_START = 3
export const TOTAL_ROUNDS = 6

export type ErrorCode = 'ROOM_FULL' | 'NAME_TAKEN' | 'INVALID_NAME'

export type LocalizedText = { nl: string; en: string }

export type QuestionType = 'vote' | 'guess' | 'photo'

export type VoteQuestionDef = {
  id: string
  type: 'vote'
  prompt: LocalizedText
}

export type GuessQuestionDef = {
  id: string
  type: 'guess'
  // {name} is replaced with the subject's name at send-time
  prompt: LocalizedText
  options: LocalizedText[]
}

export type PhotoQuestionDef = {
  id: string
  type: 'photo'
  prompt: LocalizedText
}

export type QuestionDef = VoteQuestionDef | GuessQuestionDef | PhotoQuestionDef

// What a single connection receives to render the answering screen. Tailored
// per-recipient (e.g. guess rounds read differently for the subject).
export type RoundQuestionForClient =
  | { type: 'vote'; id: string; prompt: LocalizedText; choices: Player[] }
  | {
      type: 'guess'
      id: string
      prompt: LocalizedText
      options: LocalizedText[]
      subject: Player
      isSubject: boolean
    }
  | { type: 'photo'; id: string; prompt: LocalizedText }

export type ScoreEntry = { playerId: string; name: string; score: number }

export type RoundResult =
  | {
      type: 'vote'
      prompt: LocalizedText
      tally: { player: Player; votes: number }[]
      winnerIds: string[]
    }
  | {
      type: 'guess'
      prompt: LocalizedText
      subject: Player
      options: LocalizedText[]
      correctIndex: number
      guesses: { player: Player; optionIndex: number; correct: boolean }[]
    }
  | {
      type: 'photo'
      prompt: LocalizedText
      photos: { player: Player; photoDataUrl: string }[]
    }

export type ServerMessage =
  | { type: 'state'; players: Player[]; hostId: string | null; phase: RoomPhase }
  | { type: 'error'; code: ErrorCode; message: string }
  | {
      type: 'round_start'
      roundIndex: number
      totalRounds: number
      question: RoundQuestionForClient
      answeredCount: number
      totalToAnswer: number
    }
  | { type: 'answer_progress'; answeredCount: number; totalToAnswer: number }
  | {
      type: 'round_reveal'
      roundIndex: number
      totalRounds: number
      result: RoundResult
      scores: ScoreEntry[]
    }
  | { type: 'game_over'; scores: ScoreEntry[] }

export type ClientMessage =
  | { type: 'join'; name: string }
  | { type: 'start' }
  | { type: 'submit_answer'; questionId: string; value: string }
  | { type: 'next_round' }
