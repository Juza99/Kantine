const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function generateRoomCode(): string {
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return code
}

export function isValidRoomCode(code: string): boolean {
  return /^[A-Za-z]{4}$/.test(code)
}

export function normalizeRoomCode(code: string): string {
  return code.trim().toUpperCase()
}
