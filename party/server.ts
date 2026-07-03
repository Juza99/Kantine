import type * as Party from 'partykit/server'
import type {
  ClientMessage,
  Player,
  QuestionDef,
  RoomPhase,
  RoundQuestionForClient,
  RoundResult,
  ScoreEntry,
  ServerMessage,
} from '../src/types/room'
import { MAX_PLAYERS, TOTAL_ROUNDS } from '../src/types/room'
import { QUESTION_BANK } from '../src/data/thatsYouQuestions'

type ConnectionState = {
  name: string
}

type RoundStage = 'answering' | 'reveal'

export default class KantineRoom implements Party.Server {
  phase: RoomPhase = 'lobby'
  hostId: string | null = null

  roundIndex = 0
  roundStage: RoundStage = 'answering'
  currentQuestion: QuestionDef | null = null
  subjectId: string | null = null
  answers = new Map<string, string>()
  scores = new Map<string, number>()
  usedQuestionIds = new Set<string>()
  lastResult: RoundResult | null = null

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

  send(connection: Party.Connection<ConnectionState>, message: ServerMessage) {
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

  onConnect(connection: Party.Connection<ConnectionState>) {
    // Wait for the client to send a "join" message with their name before
    // counting them as a player, so we can validate the name first.
    this.send(connection, {
      type: 'state',
      players: this.players(),
      hostId: this.hostId,
      phase: this.phase,
    })
  }

  onMessage(raw: string | ArrayBuffer | ArrayBufferView, sender: Party.Connection<ConnectionState>) {
    if (typeof raw !== 'string') return
    let message: ClientMessage
    try {
      message = JSON.parse(raw)
    } catch {
      return
    }

    if (message.type === 'join') {
      this.handleJoin(message.name, sender)
      return
    }

    if (message.type === 'start') {
      if (sender.id !== this.hostId) return
      if (this.players().length < 3) return
      this.beginGame()
      return
    }

    if (message.type === 'submit_answer') {
      this.handleSubmitAnswer(message.questionId, message.value, sender)
      return
    }

    if (message.type === 'next_round') {
      if (sender.id !== this.hostId) return
      if (this.phase !== 'playing' || this.roundStage !== 'reveal') return
      this.startNextRound()
      return
    }
  }

  handleJoin(rawName: string, sender: Party.Connection<ConnectionState>) {
    const name = rawName.trim().slice(0, 24)
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

    // Late joiner during an active round: catch them up so their screen
    // isn't stuck on the lobby.
    if (this.phase === 'playing' && this.currentQuestion) {
      if (this.roundStage === 'answering') {
        this.send(sender, this.roundStartMessage(sender.id))
      } else {
        this.send(sender, this.roundRevealMessage())
      }
    } else if (this.phase === 'gameover') {
      this.send(sender, { type: 'game_over', scores: this.scoreboard() })
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

  // --- Game flow -----------------------------------------------------

  beginGame() {
    this.phase = 'starting'
    this.broadcastState()

    for (const player of this.players()) {
      if (!this.scores.has(player.id)) this.scores.set(player.id, 0)
    }

    setTimeout(() => {
      this.phase = 'playing'
      this.roundIndex = 0
      this.startNextRound()
    }, 1500)
  }

  pickNextQuestion(): QuestionDef {
    const unused = QUESTION_BANK.filter((q) => !this.usedQuestionIds.has(q.id))
    const pool = unused.length > 0 ? unused : QUESTION_BANK
    const question = pool[Math.floor(Math.random() * pool.length)]
    this.usedQuestionIds.add(question.id)
    return question
  }

  startNextRound() {
    this.roundIndex += 1

    if (this.roundIndex > TOTAL_ROUNDS) {
      this.phase = 'gameover'
      this.currentQuestion = null
      this.room.broadcast(JSON.stringify({ type: 'game_over', scores: this.scoreboard() }))
      return
    }

    const players = this.players()
    this.currentQuestion = this.pickNextQuestion()
    this.subjectId =
      this.currentQuestion.type === 'guess' && players.length > 0
        ? players[(this.roundIndex - 1) % players.length].id
        : null
    this.answers = new Map()
    this.roundStage = 'answering'

    for (const connection of this.room.getConnections<ConnectionState>()) {
      if (!connection.state?.name) continue
      this.send(connection, this.roundStartMessage(connection.id))
    }
  }

  roundStartMessage(recipientId: string): ServerMessage {
    if (!this.currentQuestion) throw new Error('No current question')
    return {
      type: 'round_start',
      roundIndex: this.roundIndex,
      totalRounds: TOTAL_ROUNDS,
      question: this.buildQuestionForClient(this.currentQuestion, recipientId),
      answeredCount: this.answers.size,
      totalToAnswer: this.players().length,
    }
  }

  buildQuestionForClient(question: QuestionDef, recipientId: string): RoundQuestionForClient {
    if (question.type === 'vote') {
      return {
        type: 'vote',
        id: question.id,
        prompt: question.prompt,
        choices: this.players().filter((p) => p.id !== recipientId),
      }
    }

    if (question.type === 'guess') {
      const subject = this.players().find((p) => p.id === this.subjectId) ?? {
        id: '',
        name: '?',
      }
      return {
        type: 'guess',
        id: question.id,
        prompt: {
          nl: question.prompt.nl.replace('{name}', subject.name),
          en: question.prompt.en.replace('{name}', subject.name),
        },
        options: question.options,
        subject,
        isSubject: recipientId === this.subjectId,
      }
    }

    return { type: 'photo', id: question.id, prompt: question.prompt }
  }

  handleSubmitAnswer(questionId: string, value: string, sender: Party.Connection<ConnectionState>) {
    if (this.phase !== 'playing' || this.roundStage !== 'answering') return
    if (!this.currentQuestion || this.currentQuestion.id !== questionId) return
    if (!sender.state?.name) return

    this.answers.set(sender.id, value)

    const totalToAnswer = this.players().length
    this.room.broadcast(
      JSON.stringify({
        type: 'answer_progress',
        answeredCount: this.answers.size,
        totalToAnswer,
      } satisfies ServerMessage),
    )

    if (this.answers.size >= totalToAnswer) {
      this.revealRound()
    }
  }

  revealRound() {
    if (!this.currentQuestion) return
    this.roundStage = 'reveal'

    // Compute once — this mutates scores, so it must never be re-run for the
    // same round (e.g. to catch up a late joiner).
    this.lastResult = this.computeResult(this.currentQuestion)
    this.room.broadcast(JSON.stringify(this.roundRevealMessage()))
  }

  computeResult(question: QuestionDef): RoundResult {
    const players = this.players()
    const playerById = new Map(players.map((p) => [p.id, p]))

    if (question.type === 'vote') {
      const voteCounts = new Map<string, number>()
      for (const targetId of this.answers.values()) {
        voteCounts.set(targetId, (voteCounts.get(targetId) ?? 0) + 1)
      }
      const tally = players.map((player) => ({
        player,
        votes: voteCounts.get(player.id) ?? 0,
      }))
      const maxVotes = Math.max(0, ...tally.map((t) => t.votes))
      const winnerIds = maxVotes > 0 ? tally.filter((t) => t.votes === maxVotes).map((t) => t.player.id) : []
      for (const winnerId of winnerIds) {
        this.scores.set(winnerId, (this.scores.get(winnerId) ?? 0) + 2)
      }
      return { type: 'vote', prompt: question.prompt, tally, winnerIds }
    }

    if (question.type === 'guess') {
      const subject = playerById.get(this.subjectId ?? '') ?? { id: '', name: '?' }
      const correctRaw = this.answers.get(subject.id)
      const correctIndex = correctRaw ? Number.parseInt(correctRaw, 10) : -1

      const guesses = players
        .filter((p) => p.id !== subject.id)
        .map((player) => {
          const raw = this.answers.get(player.id)
          const optionIndex = raw ? Number.parseInt(raw, 10) : -1
          const correct = optionIndex === correctIndex
          if (correct) this.scores.set(player.id, (this.scores.get(player.id) ?? 0) + 2)
          return { player, optionIndex, correct }
        })

      return {
        type: 'guess',
        prompt: {
          nl: question.prompt.nl.replace('{name}', subject.name),
          en: question.prompt.en.replace('{name}', subject.name),
        },
        subject,
        options: question.options,
        correctIndex,
        guesses,
      }
    }

    const photos = players
      .map((player) => {
        const dataUrl = this.answers.get(player.id)
        return dataUrl ? { player, photoDataUrl: dataUrl } : null
      })
      .filter((p): p is { player: Player; photoDataUrl: string } => p !== null)

    return { type: 'photo', prompt: question.prompt, photos }
  }

  roundRevealMessage(): ServerMessage {
    if (!this.lastResult) throw new Error('No result to reveal')
    return {
      type: 'round_reveal',
      roundIndex: this.roundIndex,
      totalRounds: TOTAL_ROUNDS,
      result: this.lastResult,
      scores: this.scoreboard(),
    }
  }

  scoreboard(): ScoreEntry[] {
    return this.players()
      .map((player) => ({
        playerId: player.id,
        name: player.name,
        score: this.scores.get(player.id) ?? 0,
      }))
      .sort((a, b) => b.score - a.score)
  }
}
