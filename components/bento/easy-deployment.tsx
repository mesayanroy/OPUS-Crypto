"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface DeploymentEasyProps {
  /** Width of component – number (px) or any CSS size value */
  width?: number | string
  /** Height of component – number (px) or any CSS size value */
  height?: number | string
  /** Extra Tailwind / CSS classes for root element */
  className?: string
}

const DeploymentEasy: React.FC<DeploymentEasyProps> = ({ width = "100%", height = "100%", className = "" }) => {
  const [isCardHovered, setIsCardHovered] = useState(false)

  useEffect(() => {
    // Initial delay of 3 seconds before first hover
    const initialTimeout = setTimeout(() => {
      setIsCardHovered(true)
    }, 3000)

    return () => {
      clearTimeout(initialTimeout)
    }
  }, [])

  /* ------------------------------------------------------------
   * Theme-based design tokens using global CSS variables
   * ---------------------------------------------------------- */
  const themeVars = {
    "--deploy-primary-color": "hsl(var(--primary))",
    "--deploy-background-color": "hsl(var(--background))",
    "--deploy-text-color": "hsl(var(--foreground))",
    "--deploy-text-secondary": "hsl(var(--muted-foreground))",
    "--deploy-border-color": "hsl(var(--border))",
  } as React.CSSProperties

  /* ------------------------------------------------------------
   * Console log output (static for demo) – can be replaced via props
   * ---------------------------------------------------------- */
  const logLines = [
    "[16:37:25.637] Running build in Washington, D.C., USA (East) – iad1",
    "[16:37:25.638] Build machine configuration: 2 cores, 8 GB",
    "[16:37:25.653] Retrieving list of deployment files...",
    "[16:37:25.741] Previous build caches not available",
    "[16:37:25.979] Downloading 84 deployment files...",
    '[16:37:29.945] Running "vercel build"',
    "[16:37:30.561] Vercel CLI 44.5.0",
    '[16:37:30.880] Running "install" command: `bun install`...',
    "[16:37:30.914] bun install v1.2.19 (aad3abea)",
    "[16:37:30.940] Resolving dependencies",
    "[16:37:34.436] Resolved, downloaded and extracted [1116]",
    '[16:37:34.436] warn: incorrect peer dependency "react@19.1.0"',
    "[16:37:37.265] Saved lockfile",
    "[16:37:39.076] Next.js anonymous telemetry notice",
    "[16:37:39.137] ▲ Next.js 15.2.4",
    "[16:37:41.439] ✓ Compiled successfully",
    "[16:37:53.979] ✓ Generated static pages",
    "[16:38:00.585] ○ (Static) prerendered as static content",
    "[16:38:01.099] Build Completed in /vercel/output [30s]",
    "🚀 Deployment complete – Easy!",
  ]

  return (
    <div
      className={`w-full h-full flex items-center justify-center p-4 relative text-red-500 ${className}`}
      style={{
        width,
        height,
        position: "relative",
        background: "transparent",
        ...themeVars,
      }}
      role="img"
      aria-label="Deployment console output with Deploy on Vercel button"
    >
      {/* -------------------------------------------------------- */}
      {/* Console / Terminal panel                                */}
      {/* -------------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: isCardHovered
            ? "translate(-50%, -50%) translateY(-10px) scale(1.03)"
            : "translate(-50%, -50%) translateY(0) scale(1)",
          width: "340px",
          height: "239px",
          background: isCardHovered
            ? "linear-gradient(180deg, var(--deploy-background-color) 0%, var(--deploy-background-color) 100%)"
            : "linear-gradient(180deg, var(--deploy-background-color) 0%, transparent 100%)",
          backdropFilter: isCardHovered ? "blur(14px)" : "blur(7.907px)",
          borderRadius: "10px",
          border: isCardHovered
            ? "2px solid var(--deploy-primary-color)"
            : "none",
          overflow: "hidden",
          zIndex: isCardHovered ? 15 : 1,
          transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: isCardHovered
            ? "0px 25px 50px rgba(0, 0, 0, 0.2), 0 0 0 1px var(--deploy-primary-color) inset, 0 0 40px rgba(0, 0, 0, 0.15)"
            : "0px 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Inner translucent panel – replicates subtle overlay */}
        <div
          style={{
            position: "absolute",
            inset: "2px",
            borderRadius: "8px",
            background: "hsl(var(--foreground) / 0.08)",
          }}
        />

        {/* Scrolling Log text - Movie Credits Style */}
        <div className="bg-muted"
          style={{
            position: "relative",
            padding: "8px",
            height: "100%",
            overflow: "hidden",
            fontFamily: "'Geist Mono', 'SF Mono', Monaco, Consolas, 'Liberation Mono', monospace",
            fontSize: "10px",
            lineHeight: "16px",
            color: "var(--deploy-text-color)",
          }}
        >
          {/* Scrolling container */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "calc(200% + 100px)", // Double height for seamless loop
              display: "flex",
              flexDirection: "column",
              animation: "scrollCredits 20s linear infinite",
              paddingLeft: "8px",
              paddingRight: "8px",
            }}
          >
            {/* First instance of log lines */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              {logLines.map((line, index) => (
                <p key={`first-${index}`} style={{ margin: 0, whiteSpace: "pre" }}>
                  {line}
                </p>
              ))}
            </div>

            {/* Duplicate instance for seamless loop */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              {logLines.map((line, index) => (
                <p key={`second-${index}`} style={{ margin: 0, whiteSpace: "pre" }}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Gradient masks for fade effect at top and bottom */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40px",
              background: "linear-gradient(to bottom, hsl(var(--muted)), transparent)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40px",
              background: "linear-gradient(to top, hsl(var(--muted)), transparent)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        </div>

        {/* Inner border overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "0.791px solid var(--deploy-border-color)",
            borderRadius: "10px",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* -------------------------------------------------------- */}
      {/* Call-to-action button                                   */}
      {/* -------------------------------------------------------- */}
      
      <style jsx>{`
        @keyframes scrollCredits {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(calc(-50% - 50px));
          }
        }
      `}</style>
    </div>
  )
}

export default DeploymentEasy
