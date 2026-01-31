"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Home,
  Lightbulb,
  Thermometer,
  Plug,
  Settings,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Flame,
  ToggleLeft,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Lightbulb, label: "Lighting" },
  { icon: Thermometer, label: "Climate" },
  { icon: Plug, label: "Devices" },
  { icon: Flame, label: "Boiler" },
  { icon: ToggleLeft, label: "Switches" },
  { icon: Settings, label: "Settings" },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out",
          "bg-sidebar/80 backdrop-blur-2xl border-r border-sidebar-border",
          isOpen ? "w-64" : "w-20",
          "lg:translate-x-0",
          !isOpen && "max-lg:-translate-x-full lg:w-20"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-primary" />
            </div>
            {isOpen && (
              <span className="text-lg font-semibold text-foreground whitespace-nowrap">
                Smart Home
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                  "hover:bg-sidebar-accent",
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {isOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Toggle button */}
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-full py-3 rounded-xl hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
