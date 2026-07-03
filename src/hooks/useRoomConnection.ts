import { useEffect } from 'react'
import PartySocket from 'partysocket'
import { useGameStore } from '../store/gameStore'
import { PARTYKIT_HOST } from '../lib/party-config'
import type { ClientMessage, ErrorCode, ServerMessage } from '../types/room'

// A single module-level socket, not a per-component ref: this hook is
// mounted once at the App root so the connection survives screen
// transitions (lobby -> answering -> reveal -> ...). Send helpers below are
// plain functions other screens can call directly without re-invoking the
// hook (which would otherwise tear down and reopen the connection).
let socket: PartySocket | null = null

export function useRoomConnection() {
  const roomCode = useGameStore((s) => s.roomCode)
  const playerName = useGameStore((s) => s.playerName)

  useEffect(() => {
    if (!roomCode || !playerName) return

    const current = new PartySocket({
      host: PARTYKIT_HOST,
      room: roomCode.toLowerCase(),
    })
    socket = current

    current.addEventListener('open', () => {
      useGameStore.getState().setConnectionStatus('connected')
      useGameStore.getState().setPlayerId(current.id)
      const join: ClientMessage = { type: 'join', name: playerName }
      current.send(JSON.stringify(join))
    })

    current.addEventListener('message', (event: MessageEvent) => {
      let message: ServerMessage
      try {
        message = JSON.parse(event.data)
      } catch {
        return
      }

      const store = useGameStore.getState()

      if (message.type === 'state') {
        store.applyServerState(message.players, message.hostId, message.phase)
      } else if (message.type === 'error') {
        store.setError(errorCodeToKey(message.code))
      } else if (message.type === 'round_start') {
        store.applyRoundStart(message)
      } else if (message.type === 'answer_progress') {
        store.applyAnswerProgress(message.answeredCount, message.totalToAnswer)
      } else if (message.type === 'round_reveal') {
        store.applyRoundReveal(message)
      } else if (message.type === 'game_over') {
        store.applyGameOver(message.scores)
      }
    })

    current.addEventListener('close', () => {
      useGameStore.getState().setConnectionStatus('idle')
    })

    current.addEventListener('error', () => {
      useGameStore.getState().setConnectionStatus('error')
      useGameStore.getState().setError('connectionLost')
    })

    return () => {
      current.close()
      if (socket === current) socket = null
    }
  }, [roomCode, playerName])
}

export function sendStart() {
  if (!socket) return
  const message: ClientMessage = { type: 'start' }
  socket.send(JSON.stringify(message))
}

export function sendAnswer(questionId: string, value: string) {
  if (!socket) return
  useGameStore.getState().markAnswered()
  const message: ClientMessage = { type: 'submit_answer', questionId, value }
  socket.send(JSON.stringify(message))
}

export function sendNextRound() {
  if (!socket) return
  const message: ClientMessage = { type: 'next_round' }
  socket.send(JSON.stringify(message))
}

function errorCodeToKey(code: ErrorCode) {
  switch (code) {
    case 'ROOM_FULL':
      return 'roomFull'
    case 'NAME_TAKEN':
      return 'nameTaken'
    case 'INVALID_NAME':
      return 'nameRequired'
    default:
      return 'generic'
  }
}
