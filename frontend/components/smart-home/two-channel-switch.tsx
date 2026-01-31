"use client"

import { useState } from "react"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"
import { ToggleLeft, Power } from "lucide-react"

export function TwoChannelSwitch() {
  const [channel1, setChannel1] = useState(false)
  const [channel2, setChannel2] = useState(true)

  return (
    <GlassCard>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <ToggleLeft className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">T-Switch</h3>
          <p className="text-xs text-muted-foreground">2-Channel Switch</p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setChannel1(!channel1)}
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300",
            channel1
              ? "bg-primary/20 border border-primary/30"
              : "bg-muted/50 border border-transparent"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                channel1 ? "bg-primary/30" : "bg-muted"
              )}
            >
              <Power
                className={cn(
                  "w-4 h-4",
                  channel1 ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <span
              className={cn(
                "font-medium",
                channel1 ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Channel 1
            </span>
          </div>
          <div
            className={cn(
              "w-12 h-7 rounded-full p-1 transition-colors duration-300",
              channel1 ? "bg-primary" : "bg-muted"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full bg-foreground transition-transform duration-300",
                channel1 ? "translate-x-5" : "translate-x-0"
              )}
            />
          </div>
        </button>

        <button
          onClick={() => setChannel2(!channel2)}
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300",
            channel2
              ? "bg-primary/20 border border-primary/30"
              : "bg-muted/50 border border-transparent"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                channel2 ? "bg-primary/30" : "bg-muted"
              )}
            >
              <Power
                className={cn(
                  "w-4 h-4",
                  channel2 ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <span
              className={cn(
                "font-medium",
                channel2 ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Channel 2
            </span>
          </div>
          <div
            className={cn(
              "w-12 h-7 rounded-full p-1 transition-colors duration-300",
              channel2 ? "bg-primary" : "bg-muted"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full bg-foreground transition-transform duration-300",
                channel2 ? "translate-x-5" : "translate-x-0"
              )}
            />
          </div>
        </button>
      </div>
    </GlassCard>
  )
}
