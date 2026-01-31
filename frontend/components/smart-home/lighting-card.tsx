"use client"

import { useState } from "react"
import { GlassCard } from "./glass-card"
import { Switch } from "@/components/ui/switch"
import { Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface LightingCardProps {
  name: string
  initialOn?: boolean
}

export function LightingCard({
  name,
  initialOn = false,
}: LightingCardProps) {
  const [isOn, setIsOn] = useState(initialOn)

  return (
    <GlassCard className="relative overflow-hidden">
      {/* Glow effect when on */}
      {isOn && (
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle, oklch(0.85 0.18 80 / 0.4), transparent)",
          }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300",
                isOn ? "bg-warning/20" : "bg-muted"
              )}
            >
              <Lightbulb
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  isOn ? "text-warning" : "text-muted-foreground"
                )}
              />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{name}</h3>
              <p className="text-xs text-muted-foreground">
                {isOn ? "On" : "Off"}
              </p>
            </div>
          </div>
          <Switch
            checked={isOn}
            onCheckedChange={setIsOn}
            className="data-[state=checked]:bg-warning"
          />
        </div>
      </div>
    </GlassCard>
  )
}
