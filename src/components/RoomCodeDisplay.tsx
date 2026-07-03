export function RoomCodeDisplay({ code }: { code: string }) {
  return (
    <div className="flex justify-center gap-2">
      {code.split('').map((letter, index) => (
        <span
          key={index}
          className="flex h-16 w-14 items-center justify-center rounded-2xl bg-white/10 text-4xl font-black tracking-wide text-white sm:h-20 sm:w-16 sm:text-5xl"
        >
          {letter}
        </span>
      ))}
    </div>
  )
}
