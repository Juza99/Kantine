import type { InputHTMLAttributes } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function TextField({ label, className = '', id, ...props }: TextFieldProps) {
  return (
    <label className="block w-full text-left" htmlFor={id}>
      <span className="mb-2 block text-sm font-bold tracking-wide text-kantine-cream/80 uppercase">
        {label}
      </span>
      <input
        id={id}
        className={`w-full rounded-2xl border-[3px] border-kantine-ink bg-kantine-cream px-5 py-4 text-lg font-semibold text-kantine-ink placeholder-kantine-ink/35 outline-none focus:border-kantine-teal-dark ${className}`}
        {...props}
      />
    </label>
  )
}
