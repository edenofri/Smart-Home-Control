"use client"

import React from "react"

import { useState } from "react"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"
import { Snowflake, Flame, Fan, Gauge, Power, ChevronUp, ChevronDown } from "lucide-react"

type ACMode = "cool" | "heat" | "fan" | "auto"
type FanSpeed = "low" | "medium" | "high" | "auto"

const modes: { id: ACMode; icon: React.ElementType; label: string; color: string }[] = [
  { id: "cool", icon: Snowflake, label: "Cool", color: "text-sky-400" },
  { id: "heat", icon: Flame, label: "Heat", color: "text-orange-400" },
  { id: "fan", icon: Fan, label: "Fan", color: "text-emerald-400" },
  { id: "auto", icon: Gauge, label: "Auto", color: "text-primary" },
]

const fanSpeeds: { id: FanSpeed; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Med" },
  { id: "high", label: "High" },
  { id: "auto", label: "Auto" },
]

export function ClimateControl() {
  const [isOn, setIsOn] = useState(true)
  const [temperature, setTemperature] = useState(22)
  const [mode, setMode] = useState<ACMode>("cool")
  const [fanSpeed, setFanSpeed] = useState<FanSpeed>("auto")

  const minTemp = 16
  const maxTemp = 30

  const getModeColor = () => {
    switch (mode) {
      case "cool":
        return "from-sky-500/20 to-sky-600/5"
      case "heat":
        return "from-orange-500/20 to-orange-600/5"
      case "fan":
        return "from-emerald-500/20 to-emerald-600/5"
      case "auto":
        return "from-primary/20 to-primary/5"
    }
  }

  const getDialColor = () => {
    switch (mode) {
      case "cool":
        return "stroke-sky-400"
      case "heat":
        return "stroke-orange-400"
      case "fan":
        return "stroke-emerald-400"
      case "auto":
        return "stroke-primary"
    }
  }

  const getDialBgColor = () => {
    switch (mode) {
      case "cool":
        return "bg-sky-400"
      case "heat":
        return "bg-orange-400"
      case "fan":
        return "bg-emerald-400"
      case "auto":
        return "bg-primary"
    }
  }

  // Calculate progress for circular dial (0-1)
  const progress = (temperature - minTemp) / (maxTemp - minTemp)
  const circumference = 2 * Math.PI * 80 // radius = 80
  const strokeDashoffset = circumference * (1 - progress * 0.75) // 270 degrees = 0.75 of circle

  return (
    <GlassCard className={cn("relative overflow-hidden", isOn && `bg-gradient-to-br ${getModeColor()}`)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Smart IR (AC)</h3>
          <p className="text-sm text-muted-foreground">
            {isOn ? `${mode.charAt(0).toUpperCase() + mode.slice(1)} mode` : "Off"}
          </p>
        </div>
        <button
          onClick={() => setIsOn(!isOn)}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
            isOn
              ? "bg-primary/20 text-primary shadow-lg shadow-primary/20"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Power className="w-5 h-5" />
        </button>
      </div>

      {isOn && (
        <>
          {/* Temperature Dial */}
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* Background circle */}
              <svg className="w-full h-full -rotate-135" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference * 0.75}
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  className={cn("transition-all duration-300", getDialColor())}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference * 0.75}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <button
                  onClick={() => setTemperature(Math.min(maxTemp, temperature + 1))}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  disabled={temperature >= maxTemp}
                >
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                </button>
                <div className="text-center">
                  <span className="text-5xl font-bold text-foreground">{temperature}</span>
                  <span className="text-xl text-muted-foreground">°C</span>
                </div>
                <button
                  onClick={() => setTemperature(Math.max(minTemp, temperature - 1))}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  disabled={temperature <= minTemp}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Min/Max labels */}
              <div className="absolute bottom-2 left-4 text-xs text-muted-foreground">
                {minTemp}°
              </div>
              <div className="absolute bottom-2 right-4 text-xs text-muted-foreground">
                {maxTemp}°
              </div>
            </div>
          </div>

          {/* Mode Selectors */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Mode</p>
            <div className="grid grid-cols-4 gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200",
                    mode === m.id
                      ? "bg-glass border border-glass-border"
                      : "hover:bg-muted/50"
                  )}
                >
                  <m.icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      mode === m.id ? m.color : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs",
                      mode === m.id ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fan Speed */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Fan Speed</p>
            <div className="flex gap-2">
              {fanSpeeds.map((speed) => (
                <button
                  key={speed.id}
                  onClick={() => setFanSpeed(speed.id)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200",
                    fanSpeed === speed.id
                      ? cn("text-foreground", getDialBgColor())
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {speed.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </GlassCard>
  )
}
