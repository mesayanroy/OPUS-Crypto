"use client"

import { useState } from "react"
import { Web3Provider } from "@/lib/web3/context"
import { AppSidebar } from "@/components/app/sidebar"
import { AppDashboard } from "@/components/app/dashboard"
import { AppPortfolio } from "@/components/app/portfolio"
import { AppTrading } from "@/components/app/trading"
import { AppActivity } from "@/components/app/activity"
import { WalletConnectModal } from "@/components/web3/wallet-connect-modal"
import { AppHeader } from "@/components/app/app-header"

type ActiveView = "dashboard" | "portfolio" | "trading" | "activity"

export default function TradingAppPage() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")

  return (
    <Web3Provider>
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Left side (hidden on mobile, shown in header menu) */}
          <AppSidebar activeView={activeView} onViewChange={setActiveView} />

          {/* Main Content - Right side */}
          <main className="flex-1 overflow-auto">
            {activeView === "dashboard" && <AppDashboard />}
            {activeView === "portfolio" && <AppPortfolio />}
            {activeView === "trading" && <AppTrading />}
            {activeView === "activity" && <AppActivity />}
          </main>
        </div>

        {/* Wallet Connect Modal */}
        <WalletConnectModal />
      </div>
    </Web3Provider>
  )
}
