"use client"

import { useState } from "react"
import { useWeb3 } from "@/lib/web3/context"
import { WalletDropdown } from "@/components/web3/wallet-dropdown"
import { Menu, X, Zap, LayoutDashboard, Wallet, TrendingUp, Activity, ArrowLeft } from "lucide-react"
import Link from "next/link"

type ActiveView = "dashboard" | "portfolio" | "trading" | "activity"

export function AppHeader() {
  const { isConnected } = useWeb3()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - Logo & Back */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Back</span>
          </Link>
          <div className="w-px h-6 bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">Opus Trading</span>
          </div>
        </div>

        {/* Right side - Wallet & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          <WalletDropdown />

          {/* Mobile menu button - only show on very small screens */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-in slide-in-from-top-2 duration-200">
          <nav className="p-4 space-y-1">
            <MobileNavItem icon={LayoutDashboard} label="Dashboard" />
            <MobileNavItem icon={Wallet} label="Portfolio" />
            <MobileNavItem icon={TrendingUp} label="Trading" />
            <MobileNavItem icon={Activity} label="Activity" />
          </nav>
        </div>
      )}
    </header>
  )
}

function MobileNavItem({
  icon: Icon,
  label,
}: {
  icon: typeof LayoutDashboard
  label: string
}) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  )
}
