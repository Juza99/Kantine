import type * as Party from 'partykit/server'
import type { ClientMessage, Player, RoomPhase, ServerMessage } from '../src/types/room'
import { MAX_PLAYERS } from '../src/types/room'

type ConnectionState = {
  name: string
}

export default class KantineRoom implements Party.Server {
  phase: RoomPhase = 'lobby'
  hostId: string | null = null

  constructor(readonly room: Party.Room) {}

  players(): Player[] {
    const players: Player[] = []
    for (const connection of this.room.getConnections<ConnectionState>()) {
      if (connection.state?.name) {
        players.push({ id: connection.id, name: connection.state.name })
      }
    }
    return players
  }

  send(connection: Party.Connection, message: ServerMessage) {
    connection.send(JSON.stringify(message))
  }

  broadcastState() {
    const message: ServerMessage = {
      type: 'state',
      players: this.players(),
      hostId: this.hostId,
      phase: this.phase,
    }
    this.room.broadcast(JSON.stringify(message))
  }

  ensureHost() {
    const players = this.players()
    if (!this.hostId || !players.some((p) => p.id === this.hostId)) {
      this.hostId = players[0]?.id ?? null
    }
  }

  onConnect(connection: Party.Connection) {
    // Wait for the client to send a "join" message with their name before
    // counting them as a player, so we can validate the name first.
    this.send(connection, {
      type: 'state',
      players: this.players(),
      hostId: this.hostId,
      phase: this.phase,
    })
  }

  onMessage(raw: string | ArrayBuffer | ArrayBufferView, sender: Party.Connection) {
    if (typeof raw !== 'string') return
    let message: ClientMessage
    try {
      message = JSON.parse(raw)
    } catch {
      return
    }

    if (message.type === 'join') {
      const name = message.name.trim().slice(0, 24)
      if (!name) {
        this.send(sender, { type: 'error', code: 'INVALID_NAME', message: 'Name is required' })
        return
      }

      const existingPlayers = this.players()
      const alreadyJoined = existingPlayers.some((p) => p.id === sender.id)

      if (!alreadyJoined && existingPlayers.length >= MAX_PLAYERS) {
        this.send(sender, { type: 'error', code: 'ROOM_FULL', message: 'Room is full' })
        return
      }

      const nameTaken = existingPlayers.some(
        (p) => p.id !== sender.id && p.name.toLowerCase() === name.toLowerCase(),
      )
      if (nameTaken) {
        this.send(sender, { type: 'error', code: 'NAME_TAKEN', message: 'Name already taken' })
        return
      }

      sender.setState({ name })
      this.ensureHost()
      this.broadcastState()
      return
    }

    if (message.type === 'start') {
      if (sender.id !== this.hostId) return
      if (this.players().length < 3) return
      this.phase = 'starting'
      this.broadcastState()
      return
    }
  }

  onClose() {
    this.ensureHost()
    this.broadcastState()
  }

  onError() {
    this.ensureHost()
    this.broadcastState()
  }
}
