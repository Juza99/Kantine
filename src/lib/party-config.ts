const getDevHost = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.hostname}:1999`
  }
  return '127.0.0.1:1999'
}

export const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST ?? getDevHost()

