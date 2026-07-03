import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'rounded-full border-[3px] border-kantine-ink bg-kantine-gold text-kantine-ink shadow-[4px_4px_0_0_var(--color-kantine-ink)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:border-kantine-ink/25 disabled:bg-kantine-cream-dim/40 disabled:text-kantine-ink/35 disabled:shadow-none',
  secondary:
    'rounded-2xl border-[3px] border-kantine-ink bg-kantine-cream text-kantine-ink shadow-[4px_4px_0_0_var(--color-kantine-ink)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-40',
  ghost: 'text-kantine-cream/80 underline decoration-2 underline-offset-4 active:text-kantine-cream',
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`w-full px-6 py-5 text-lg font-bold transition-all disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
