"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "./glass-card"
import { Switch } from "@/components/ui/switch"
import { Plug, Zap, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface WifiPlugCardProps {
  name: string
  initialOn?: boolean
  baseWattage?: number
}

export function WifiPlugCard({
  name,
  initialOn = false,
  baseWattage = 45,
}: WifiPlugCardProps) {
  const [isOn, setIsOn] = useState(initialOn)
  const [currentWattage, setCurrentWattage] = useState(baseWattage)
  const [todayKwh, setTodayKwh] = useState(0)

  // Simulate real-time power fluctuation
  useEffect(() => {
    if (!isOn) {
      setCurrentWattage(0)
      return
    }

    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 10
      setCurrentWattage(Math.max(0, baseWattage + fluctuation))
      setTodayKwh((prev) => prev + (baseWattage / 1000) * (1 / 3600))
    }, 1000)

    return () => clearInterval(interval)
  }, [isOn, baseWattage])

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300",
              isOn ? "bg-success/20" : "bg-muted"
            )}
          >
            <Plug
              className={cn(
                "w-5 h-5 transition-colors duration-300",
                isOn ? "text-success" : "text-muted-foreground"
              )}
            />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground">
              {isOn ? "Active" : "Standby"}
            </p>
          </div>
        </div>
        <Switch
          checked={isOn}
          onCheckedChange={setIsOn}
          className="data-[state=checked]:bg-success"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3 h-3 text-warning" />
            <span className="text-xs text-muted-foreground">Current</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {isOn ? currentWattage.toFixed(1) : "0.0"}
            <span className="text-xs text-muted-foreground ml-1">W</span>
          </p>
        </div>
        <div className="bg-muted/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {todayKwh.toFixed(2)}
            <span className="text-xs text-muted-foreground ml-1">kWh</span>
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
