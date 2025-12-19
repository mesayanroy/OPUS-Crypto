"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useAptos } from "@/lib/web3/aptos-context"
import { X, Loader2, Wallet } from "lucide-react"

export function AptosWalletConnector() {
  const { account, connecting, connected, disconnect } = useWallet()
  const { showWalletModal, setShowWalletModal } = useAptos()

  const handleDisconnect = async () => {
    await disconnect()
  }

  if (connected && account?.address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col text-right text-sm">
          <span className="font-medium text-foreground">Connected</span>
          <span className="text-xs text-muted-foreground">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </span>
        </div>
        <Button onClick={handleDisconnect} variant="outline" size="sm">
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button onClick={() => setShowWalletModal(true)} variant="default" className="gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>

      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowWalletModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md rounded-2xl border border-border overflow-hidden bg-card">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Connect Aptos Wallet</h2>
                <Button
                  onClick={() => setShowWalletModal(false)}
                  variant="ghost"
                  size="sm"
                  disabled={connecting}
                  className="-mr-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Info */}
              <p className="text-sm text-muted-foreground">
                Your wallet address will be your unique identifier on OPUS. No email or password needed.
              </p>

              {/* Wallet Options from Wallet Adapter */}
              <div className="space-y-2">
                {connecting && (
                  <div className="p-4 rounded-lg bg-muted/30 border border-border flex items-center gap-2 justify-center text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting wallet...
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                <h3 className="font-medium text-sm">🔒 Your Security</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>✓ Private keys never stored on our servers</li>
                  <li>✓ All trades require your wallet signature</li>
                  <li>✓ AI agents run locally on your machine</li>
                  <li>✓ Only you control your wallet and funds</li>
                </ul>
              </div>

              {/* Note about Aptos */}
              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs text-muted-foreground">
                💡 OPUS operates exclusively on the Aptos blockchain. Your wallet will automatically connect to Aptos Mainnet.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
