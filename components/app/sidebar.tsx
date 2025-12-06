"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/lib/web3/context"
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Activity,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Copy,
  ExternalLink,
  Zap,
  Menu,
  X,
} from "lucide-react"

type ActiveView = "dashboard" | "portfolio" | "trading" | "activity"

interface AppSidebarProps {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
}

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { wallet, isConnected, setShowWalletModal, disconnectWallet, totalValue, totalPnl } = useWeb3()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "portfolio" as const, label: "Portfolio", icon: Wallet },
    { id: "trading" as const, label: "Trading", icon: TrendingUp },
    { id: "activity" as const, label: "Activity", icon: Activity },
  ]

  const handleCopyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address)
    }
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-sidebar-primary" />
          </div>
          <div>
            <h1 className="text-sidebar-foreground font-semibold text-lg">AI Trading</h1>
            <p className="text-muted-foreground text-xs">Web3 Platform</p>
          </div>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="p-4 border-b border-sidebar-border">
        {isConnected && wallet ? (
          <div className="space-y-3">
            <div
              className="p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border cursor-pointer hover:bg-sidebar-accent transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-sidebar-primary" />
                  </div>
                  <div>
                    <p className="text-sidebar-foreground text-sm font-medium">
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </p>
                    <p className="text-muted-foreground text-xs capitalize">{wallet.chain}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                />
              </div>
            </div>

            {showUserMenu && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={handleCopyAddress}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors text-sm"
                >
                  <Copy className="w-4 h-4" />
                  Copy Address
                </button>
                <a
                  href={`https://etherscan.io/address/${wallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Explorer
                </a>
                <button
                  onClick={disconnectWallet}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            )}

            {/* Portfolio Summary */}
            <div className="p-3 rounded-xl bg-sidebar-accent/30 border border-sidebar-border">
              <p className="text-muted-foreground text-xs mb-1">Total Value</p>
              <p className="text-sidebar-foreground text-xl font-semibold">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className={`text-sm ${totalPnl >= 0 ? "text-primary" : "text-destructive"}`}>
                {totalPnl >= 0 ? "+" : ""}
                {totalPnl.toFixed(2)} (24h)
              </p>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowWalletModal(true)}
            className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 rounded-xl py-3"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id

            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id)
                  setIsMobileOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-xl bg-sidebar border border-sidebar-border md:hidden"
      >
        <Menu className="w-5 h-5 text-sidebar-foreground" />
      </button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border flex flex-col">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-sidebar-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-sidebar border-r border-sidebar-border flex-col shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}
