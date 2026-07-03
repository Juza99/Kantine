export type Player = {
  id: string
  name: string
}

export type RoomPhase = 'lobby' | 'starting'

export const MAX_PLAYERS = 8
export const MIN_PLAYERS_TO_START = 3

export type ErrorCode = 'ROOM_FULL' | 'NAME_TAKEN' | 'INVALID_NAME'

export type ServerMessage =
  | { type: 'state'; players: Player[]; hostId: string | null; phase: RoomPhase }
  | { type: 'error'; code: ErrorCode; message: string }

export type ClientMessage = { type: 'join'; name: string } | { type: 'start' }
