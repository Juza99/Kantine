import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-party-500 text-white shadow-lg shadow-party-900/40 active:bg-party-600 disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none',
  secondary:
    'bg-white/10 text-white border border-white/20 active:bg-white/20 disabled:opacity-40',
  ghost: 'text-white/70 active:text-white',
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`w-full rounded-2xl px-6 py-5 text-lg font-bold transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
