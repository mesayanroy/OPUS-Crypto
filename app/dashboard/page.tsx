import { WalletBoundDashboard } from "@/components/dashboard/wallet-bound-dashboard"
import { AptosWalletConnector } from "@/components/web3/aptos-wallet-connector"
import { AIAgentBuilder } from "@/components/web3/ai-agent-builder"
import { useAptos } from "@/lib/web3/aptos-context"

function DashboardContent() {
  const { user } = useAptos()

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/40 backdrop-blur-xl bg-background/80">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">OPUS Trading</h1>
            <AptosWalletConnector />
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
          {user ? (
            <>
              {/* Agent Builder */}
              <div>
                <AIAgentBuilder />
              </div>

              {/* Dashboard */}
              <WalletBoundDashboard />
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">Connect your Aptos wallet to view your trading dashboard</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
}
