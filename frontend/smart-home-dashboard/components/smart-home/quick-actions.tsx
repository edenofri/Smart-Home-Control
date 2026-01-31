"use client"

import { PowerOff, Moon, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickActionsProps {
  onAllOff: () => void
  onEveningScene: () => void
  onMenuToggle: () => void
}

export function QuickActions({ onAllOff, onEveningScene, onMenuToggle }: QuickActionsProps) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Welcome back, manage your home</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs text-muted-foreground mr-2 hidden md:block">Quick Actions</span>
          <button
            onClick={onAllOff}
            className={cn(
              "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-200",
              "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
            )}
          >
            <PowerOff className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">All Off</span>
          </button>
          <button
            onClick={onEveningScene}
            className={cn(
              "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-200",
              "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
            )}
          >
            <Moon className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Evening Scene</span>
          </button>
        </div>
      </div>
    </header>
  )
}
