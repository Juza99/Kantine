import type { CSSProperties } from 'react'

export function RoomCodeDisplay({ code }: { code: string }) {
  return (
    <div className="flex justify-center gap-3">
      {code.split('').map((letter, index) => (
        <span
          key={index}
          className="flex h-16 w-14 rotate-(--tile-rotate) items-center justify-center rounded-2xl border-[3px] border-kantine-ink bg-kantine-gold text-4xl font-black text-kantine-ink shadow-[3px_3px_0_0_var(--color-kantine-ink)] sm:h-20 sm:w-16 sm:text-5xl"
          style={{ '--tile-rotate': index % 2 === 0 ? '-3deg' : '3deg' } as CSSProperties}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}
