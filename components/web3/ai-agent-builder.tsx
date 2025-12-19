"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAptos } from "@/lib/web3/aptos-context"
import { createDefaultAgent, validateAgentRule, type AIAgent, type AgentExecutionRule } from "@/lib/web3/aptos-agent-types"
import { agentStorage } from "@/lib/web3/agent-storage"
import { DEX_CONFIGS, APTOS_TOKENS, AGENT_TRIGGER_TYPES } from "@/lib/web3/aptos-config"
import { ChevronRight, CheckCircle, AlertCircle } from "lucide-react"

type BuilderStep = "select_dex" | "select_token" | "set_trigger" | "set_action" | "review" | "complete"

interface BuilderState {
  step: BuilderStep
  agent: AIAgent
  currentRule: Partial<AgentExecutionRule>
}

export function AIAgentBuilder() {
  const { user, walletAddress } = useAptos()
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState<BuilderState>({
    step: "select_dex",
    agent: createDefaultAgent(walletAddress || ""),
    currentRule: {},
  })
  const [errors, setErrors] = useState<string[]>([])

  const handleNext = async () => {
    // Validate and move to next step
    const steps: BuilderStep[] = ["select_dex", "select_token", "set_trigger", "set_action", "review", "complete"]
    const currentIndex = steps.indexOf(state.step)

    if (currentIndex < steps.length - 1) {
      setState((prev) => ({
        ...prev,
        step: steps[currentIndex + 1],
      }))
    }
  }

  const handleSaveAgent = async () => {
    if (!walletAddress) return

    try {
      // Validate final agent
      const hasRules = state.agent.rules.length > 0
      if (!hasRules) {
        setErrors(["Agent must have at least one rule"])
        return
      }

      // Save to local storage (wallet-bound)
      await agentStorage.saveAgent(walletAddress, state.agent)

      setState({
        step: "complete",
        agent: createDefaultAgent(walletAddress),
        currentRule: {},
      })
    } catch (error) {
      setErrors([`Failed to save agent: ${String(error)}`])
    }
  }

  if (!user) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        <p>Connect wallet to create AI agents</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(!isOpen)} className="w-full" variant="outline">
        Create New AI Agent
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>

      {isOpen && (
        <Card className="p-6 space-y-6">
          {/* Step Indicator */}
          <div className="flex gap-2 justify-between mb-6">
            {(["select_dex", "select_token", "set_trigger", "set_action", "review"] as const).map((step, idx) => (
              <div
                key={step}
                className={`flex-1 h-1 rounded ${state.step === step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>

          {/* Step: Select DEX */}
          {state.step === "select_dex" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Select DEX</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(DEX_CONFIGS).map(([key, dex]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        currentRule: { ...prev.currentRule },
                      }))
                      handleNext()
                    }}
                    className="p-3 border rounded text-left hover:bg-muted"
                  >
                    <div className="font-medium">{dex.name}</div>
                    <div className="text-sm text-muted-foreground">Fee: {(dex.fee * 100).toFixed(2)}%</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Select Token */}
          {state.step === "select_token" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Select Trading Token</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(APTOS_TOKENS).map(([key, token]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        currentRule: {
                          ...prev.currentRule,
                          actions: [
                            {
                              type: "swap",
                              dex: "LIQUIDSWAP",
                              tokenIn: token.address,
                              tokenOut: APTOS_TOKENS.USDC.address,
                              maxSlippage: 0.5,
                              requiresApproval: true,
                            },
                          ],
                        },
                      }))
                      handleNext()
                    }}
                    className="p-2 border rounded text-center hover:bg-muted"
                  >
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-xs text-muted-foreground">{token.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Set Trigger */}
          {state.step === "set_trigger" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Set Trigger Condition</h3>
              <div className="space-y-3">
                {Object.entries(AGENT_TRIGGER_TYPES).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        currentRule: {
                          ...prev.currentRule,
                          trigger: {
                            type: type as keyof typeof AGENT_TRIGGER_TYPES,
                            targetValue: 100,
                            tolerance: 0.5,
                          },
                        },
                      }))
                      handleNext()
                    }}
                    className="w-full p-3 border rounded text-left hover:bg-muted"
                  >
                    {type.replace(/_/g, " ").toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Set Action */}
          {state.step === "set_action" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Execution Action</h3>
              <div className="p-4 bg-muted rounded space-y-2 text-sm">
                <p>
                  <strong>Action Type:</strong> Swap when trigger condition is met
                </p>
                <p>
                  <strong>Max Slippage:</strong> 0.5%
                </p>
                <p className="text-orange-500 text-xs">⚠️ This action requires wallet signature approval</p>
              </div>
              <Button onClick={handleNext} className="w-full">
                Continue
              </Button>
            </div>
          )}

          {/* Step: Review */}
          {state.step === "review" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Review Agent Config</h3>
              <div className="space-y-3">
                <div className="p-4 bg-muted rounded space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {state.agent.name}
                  </p>
                  <p>
                    <strong>Strategy:</strong> {state.agent.strategy}
                  </p>
                  <p>
                    <strong>Rules:</strong> {state.agent.rules.length}
                  </p>
                  <p>
                    <strong>Max Daily Trades:</strong> {state.agent.limits.maxDailyTrades}
                  </p>
                </div>

                {errors.length > 0 && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded space-y-1">
                    {errors.map((error, idx) => (
                      <p key={idx} className="text-sm text-destructive flex gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                <Button onClick={handleSaveAgent} className="w-full bg-primary">
                  Save Agent & Enable
                </Button>
                <Button onClick={() => setIsOpen(false)} variant="outline" className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Step: Complete */}
          {state.step === "complete" && (
            <div className="space-y-4 text-center">
              <CheckCircle className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h3 className="font-semibold">Agent Created Successfully!</h3>
                <p className="text-sm text-muted-foreground mt-2">Your AI agent is now running locally on your system.</p>
              </div>
              <Button onClick={() => setIsOpen(false)} className="w-full">
                Done
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
