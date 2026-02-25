"use client"

import { Web3Provider } from "@/lib/web3/context"
import { WalletConnectModal } from "@/components/web3/wallet-connect-modal"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PortfolioTracker } from "@/components/dashboard/portfolio-tracker"
import { AITokenScanner } from "@/components/dashboard/ai-token-scanner"
import { CopyTradingSection } from "@/components/dashboard/copy-trading-section"
import { ActivityPanel } from "@/components/dashboard/activity-panel"

export default function DashboardPage() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />

        <div className="relative z-10">
          <DashboardHeader />

          <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
            {/* Top Row: Portfolio & AI Scanner */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PortfolioTracker />
              <AITokenScanner />
            </div>

            {/* Bottom Row: Copy Trading & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CopyTradingSection />
              <ActivityPanel />
            </div>
          </main>
        </div>

        {/* Wallet Connect Modal */}
        <WalletConnectModal />
      </div>
    </Web3Provider>
  )
}
