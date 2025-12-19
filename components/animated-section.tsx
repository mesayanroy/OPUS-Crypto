"use client"

import type { HTMLAttributes, ReactNode } from "react"

interface AnimatedSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  delay?: number
}

export function AnimatedSection({ children, className, delay = 0, ...props }: AnimatedSectionProps) {
  return (
    <div
      className={className}
      {...props}
      data-animate-delay={delay}
    >
      {children}
    </div>
  )
}
