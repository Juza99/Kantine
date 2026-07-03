import type { ReactNode } from 'react'

export function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-8 bg-gradient-to-b from-party-950 via-party-900 to-party-950 px-6 py-16 text-center">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">{children}</div>
    </div>
  )
}
