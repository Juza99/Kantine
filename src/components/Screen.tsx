import type { ReactNode } from 'react'
import { doodleBackgroundImage } from '../lib/doodle-bg'

export function Screen({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-full w-full flex-col items-center justify-center gap-8 bg-kantine-green-700 px-6 py-16 text-center"
      style={{
        backgroundImage: `radial-gradient(120% 100% at 50% 0%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 100%), ${doodleBackgroundImage}`,
        backgroundSize: 'auto, 240px 240px',
        backgroundRepeat: 'no-repeat, repeat',
      }}
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-8">{children}</div>
    </div>
  )
}
