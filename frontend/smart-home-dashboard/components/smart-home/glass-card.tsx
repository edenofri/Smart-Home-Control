import React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-glass backdrop-blur-xl border border-glass-border p-5 transition-all duration-300 hover:bg-glass/60",
        className
      )}
    >
      {children}
    </div>
  )
}
