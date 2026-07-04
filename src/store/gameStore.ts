import { create } from 'zustand'
import type PartySocket from 'partysocket'
import type { Player, RoomPhase } from '../types/room'
import { generateRoomCode } from '../lib/room-code'

export type View = 'home' | 'createName' | 'join' | 'lobby' | 'starting'

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
  socket: PartySocket | null

  goHome: () => void
  startCreateFlow: () => void
  startJoinFlow: () => void
  createGame: (name: string) => void
  joinGame: (code: string, name: string) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setPlayerId: (id: string) => void
  setError: (errorKey: string | null) => void
  setSocket: (socket: PartySocket | null) => void
  applyServerState: (players: Player[], hostId: string | null, phase: RoomPhase) => void
}

const initialRoomState = {
  roomCode: null,
  playerName: '',
  playerId: null,
  players: [],
  hostId: null,
  connectionStatus: 'idle' as ConnectionStatus,
  errorKey: null,
  socket: null,
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

  setSocket: (socket) => set({ socket }),

  applyServerState: (players, hostId, phase) =>
    set({
      players,
      hostId,
      view: phase === 'starting' ? 'starting' : 'lobby',
    }),
}))
