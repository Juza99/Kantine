import type { InputHTMLAttributes } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function TextField({ label, className = '', id, ...props }: TextFieldProps) {
  return (
    <label className="block w-full text-left" htmlFor={id}>
      <span className="mb-2 block text-sm font-semibold text-white/70">{label}</span>
      <input
        id={id}
        className={`w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-lg text-white placeholder-white/30 outline-none focus:border-party-400 ${className}`}
        {...props}
      />
    </label>
  )
}
