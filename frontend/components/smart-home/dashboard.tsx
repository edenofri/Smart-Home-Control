"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { QuickActions } from "./quick-actions"
import { LightingCard } from "./lighting-card"
import { WifiPlugCard } from "./wifi-plug-card"
import { ClimateControl } from "./climate-control"
import { TwoChannelSwitch } from "./two-channel-switch"
import { BoilerCard } from "./boiler-card"
import { cn } from "@/lib/utils"

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleAllOff = () => {
    // In a real app, this would turn off all devices
    console.log("All devices turned off")
  }

  const handleEveningScene = () => {
    // In a real app, this would activate evening scene
    console.log("Evening scene activated")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={cn(
          "relative z-10 transition-all duration-300",
          "lg:ml-20",
          sidebarOpen && "lg:ml-64"
        )}
      >
        <QuickActions
          onAllOff={handleAllOff}
          onEveningScene={handleEveningScene}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="p-4 md:p-6 space-y-8">
          {/* Lighting Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-warning rounded-full" />
              <h2 className="text-lg font-semibold text-foreground">Lighting</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <LightingCard name="Living Room 1" initialOn={true} />
              <LightingCard name="Living Room 2" initialOn={true} />
              <LightingCard name="Living Room 3" initialOn={false} />
              <LightingCard name="Kitchen" initialOn={true} />
              <LightingCard name="Working Room" initialOn={true} />
            </div>
          </section>

          {/* Rooms & Plugs Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-success rounded-full" />
              <h2 className="text-lg font-semibold text-foreground">Wifi Plugs</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <WifiPlugCard name="Wifi Plug 1" initialOn={true} baseWattage={45} />
              <WifiPlugCard name="Wifi Plug 2" initialOn={true} baseWattage={120} />
              <WifiPlugCard name="Wifi Plug 3" initialOn={false} baseWattage={60} />
            </div>
          </section>

          {/* Climate & Specialized Controls Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h2 className="text-lg font-semibold text-foreground">Climate & Controls</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <ClimateControl />
              </div>
              <div className="space-y-4">
                <TwoChannelSwitch />
                <BoilerCard />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
