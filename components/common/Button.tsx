import React from 'react'

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
}) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-800 text-slate-50 hover:bg-slate-700 border border-slate-700',
    ghost: 'text-slate-400 hover:text-slate-50 hover:bg-slate-800',
  }
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}