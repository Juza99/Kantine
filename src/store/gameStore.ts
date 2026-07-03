import { create } from 'zustand'
import type { Player, RoomPhase, RoundQuestionForClient, RoundResult, ScoreEntry } from '../types/room'
import { generateRoomCode } from '../lib/room-code'

export type View =
  | 'home'
  | 'createName'
  | 'join'
  | 'lobby'
  | 'starting'
  | 'answering'
  | 'reveal'
  | 'gameover'

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error'

type GameState = {
  view: View
  roomCode: string | null
  playerName: string
  playerId: string | null
  players: Player[]
  hostId: string | null
  connectionStatus: ConnectionStatus
  errorKey: string | null

  roundIndex: number
  totalRounds: number
  currentQuestion: RoundQuestionForClient | null
  answeredCount: number
  totalToAnswer: number
  hasAnswered: boolean
  roundResult: RoundResult | null
  scores: ScoreEntry[] | null

  goHome: () => void
  startCreateFlow: () => void
  startJoinFlow: () => void
  createGame: (name: string) => void
  joinGame: (code: string, name: string) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setPlayerId: (id: string) => void
  setError: (errorKey: string | null) => void
  applyServerState: (players: Player[], hostId: string | null, phase: RoomPhase) => void
  applyRoundStart: (payload: {
    roundIndex: number
    totalRounds: number
    question: RoundQuestionForClient
    answeredCount: number
    totalToAnswer: number
  }) => void
  applyAnswerProgress: (answeredCount: number, totalToAnswer: number) => void
  applyRoundReveal: (payload: {
    roundIndex: number
    totalRounds: number
    result: RoundResult
    scores: ScoreEntry[]
  }) => void
  applyGameOver: (scores: ScoreEntry[]) => void
  markAnswered: () => void
}

const initialRoomState = {
  roomCode: null,
  playerName: '',
  playerId: null,
  players: [],
  hostId: null,
  connectionStatus: 'idle' as ConnectionStatus,
  errorKey: null,
  roundIndex: 0,
  totalRounds: 0,
  currentQuestion: null,
  answeredCount: 0,
  totalToAnswer: 0,
  hasAnswered: false,
  roundResult: null,
  scores: null,
}

export const useGameStore = create<GameState>((set) => ({
  view: 'home',
  ...initialRoomState,

  goHome: () => set({ view: 'home', ...initialRoomState }),

  startCreateFlow: () => set({ view: 'createName', errorKey: null }),

  startJoinFlow: () => set({ view: 'join', errorKey: null }),

  createGame: (name) =>
    set({
      view: 'lobby',
      playerName: name,
      roomCode: generateRoomCode(),
      connectionStatus: 'connecting',
      errorKey: null,
    }),

  joinGame: (code, name) =>
    set({
      view: 'lobby',
      playerName: name,
      roomCode: code,
      connectionStatus: 'connecting',
      errorKey: null,
    }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setPlayerId: (id) => set({ playerId: id }),

  setError: (errorKey) => set({ errorKey }),

  applyServerState: (players, hostId, phase) =>
    set((state) => ({
      players,
      hostId,
      // Round messages (round_start/round_reveal/game_over) own the view
      // once play begins — a "state" broadcast (e.g. a player list update)
      // must not yank the screen back to the lobby mid-round.
      view: phase === 'lobby' || phase === 'starting' ? phase : state.view,
    })),

  applyRoundStart: (payload) =>
    set({
      view: 'answering',
      roundIndex: payload.roundIndex,
      totalRounds: payload.totalRounds,
      currentQuestion: payload.question,
      answeredCount: payload.answeredCount,
      totalToAnswer: payload.totalToAnswer,
      hasAnswered: false,
      roundResult: null,
    }),

  applyAnswerProgress: (answeredCount, totalToAnswer) => set({ answeredCount, totalToAnswer }),

  applyRoundReveal: (payload) =>
    set({
      view: 'reveal',
      roundIndex: payload.roundIndex,
      totalRounds: payload.totalRounds,
      roundResult: payload.result,
      scores: payload.scores,
    }),

  applyGameOver: (scores) => set({ view: 'gameover', scores }),

  markAnswered: () => set({ hasAnswered: true }),
}))
