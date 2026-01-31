"use client"

import { useState, useEffect, useCallback } from "react"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"
import { Flame, Timer, Zap } from "lucide-react"

export function BoilerCard() {
  const [isBoostActive, setIsBoostActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(45 * 60) // 45 minutes in seconds
  const [initialTime] = useState(45 * 60)

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (!isBoostActive || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsBoostActive(false)
          return initialTime
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isBoostActive, timeRemaining, initialTime])

  const handleBoostToggle = () => {
    if (isBoostActive) {
      setIsBoostActive(false)
      setTimeRemaining(initialTime)
    } else {
      setIsBoostActive(true)
    }
  }

  const progress = (timeRemaining / initialTime) * 100

  return (
    <GlassCard
      className={cn(
        "relative overflow-hidden transition-all duration-500",
        isBoostActive && "bg-gradient-to-br from-orange-500/20 to-orange-600/5"
      )}
    >
      {/* Background glow */}
      {isBoostActive && (
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300",
              isBoostActive ? "bg-orange-500/20" : "bg-muted"
            )}
          >
            <Flame
              className={cn(
                "w-5 h-5 transition-colors duration-300",
                isBoostActive ? "text-orange-400" : "text-muted-foreground"
              )}
            />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Boiler</h3>
            <p className="text-xs text-muted-foreground">
              {isBoostActive ? "Boost active" : "Standby mode"}
            </p>
          </div>
        </div>

        {/* Timer Display */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {isBoostActive ? "Time remaining" : "Boost duration"}
            </span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-1000"
              style={{ width: isBoostActive ? `${progress}%` : "100%" }}
            />
          </div>
          <p className="text-3xl font-bold text-foreground text-center">
            {formatTime(timeRemaining)}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              remaining
            </span>
          </p>
        </div>

        {/* Boost Button */}
        <button
          onClick={handleBoostToggle}
          className={cn(
            "w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300",
            isBoostActive
              ? "bg-orange-500 text-foreground shadow-lg shadow-orange-500/30 hover:bg-orange-600"
              : "bg-gradient-to-r from-orange-500 to-orange-600 text-foreground shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
          )}
        >
          <Zap className="w-5 h-5" />
          {isBoostActive ? "Stop Boost" : "Boost"}
        </button>
      </div>
    </GlassCard>
  )
}
