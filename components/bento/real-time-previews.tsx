"use client"

import type React from "react"
import { useState, useEffect } from "react"

const RealtimeCodingPreviews: React.FC = () => {
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

  const themeVars = {
    "--realtime-primary-color": "hsl(var(--primary))",
    "--realtime-background-editor": "hsl(var(--background) / 0.8)", // Tinted gray from background
    "--realtime-background-preview": "hsl(var(--background) / 0.8)", // Tinted gray from background
    "--realtime-text-color": "hsl(var(--foreground))",
    "--realtime-text-editor": "hsl(var(--foreground))",
    "--realtime-text-preview": "hsl(var(--primary-foreground))", // For button text
    "--realtime-border-color": "hsl(var(--border))",
    "--realtime-border-main": "hsl(var(--border))",
    "--realtime-connection-color": "hsl(var(--muted-foreground))",
  }

  return (
    <div
      className="text-destructive" // Remove className prop if not used
      style={
        {
          width: "100%", // Use 100% for responsiveness within parent
          height: "100%", // Use 100% for responsiveness within parent
          position: "relative",
          background: "transparent",
          ...themeVars,
        } as React.CSSProperties
      }
      role="img"
      aria-label="Realtime Coding Previews interface showing split-screen code editor and live preview"
    >
      {/* Left Panel - Code Editor */}
      <div
        style={{
          position: "absolute",
          top: "46px",
          left: "50%",
          transform: isCardHovered
            ? "translateX(-50%) translateY(-10px) scale(1.03)"
            : "translateX(-50%) translateY(0) scale(1)",
          width: "350px",
          height: "221px",
          background: isCardHovered
            ? "linear-gradient(180deg, var(--realtime-background-editor) 0%, var(--realtime-background-editor) 100%)"
            : "linear-gradient(180deg, var(--realtime-background-editor) 0%, transparent 100%)",
          backdropFilter: isCardHovered ? "blur(14px)" : "blur(7.907px)",
          borderRadius: "9.488px",
          border: isCardHovered
            ? "2px solid var(--realtime-primary-color)"
            : "1px solid var(--realtime-border-main)",
          overflow: "hidden",
          boxSizing: "border-box",
          zIndex: isCardHovered ? 15 : 1,
          transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: isCardHovered
            ? "0px 25px 50px rgba(0, 0, 0, 0.2), 0 0 0 1px var(--realtime-primary-color) inset, 0 0 40px rgba(0, 0, 0, 0.15)"
            : "0px 4px 12px rgba(0, 0, 0, 0.05)",
        }}
        data-name="code-editor"
      >
        <div className="text-red-500 bg-background"
          style={{
            padding: "9.488px 9.492px",
            height: "100%",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          {/* Scrolling Code Container - Movie Credits Style */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "calc(200% + 100px)", // Double height for seamless loop
              display: "flex",
              flexDirection: "column",
              animation: "scrollCredits 15s linear infinite",
              fontFamily: "'Geist Mono', 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              fontSize: "10.279px",
              lineHeight: "15.814px",
              letterSpacing: "-0.3163px",
              color: "var(--realtime-text-editor)",
              width: "100%",
              paddingLeft: "9.492px",
              paddingRight: "9.492px",
            }}
          >
            {/* First instance of code */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: "20px",
                paddingBottom: "20px",
              }}
            >
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>switch (type) {"{"}</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> case 'success':</p>
              <p className="italic bg-muted text-primary" style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> return {"{"}</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>
                {" "}
                border: theme === 'dark' ? 'border-[rgba(34,197,94,0.4)]' : 'border-green-200',
              </p>
              <p className="italic bg-muted text-foreground" style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> icon: (</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>
                {" "}
                &lt;svg className={"{baseIconClasses}"} fill="none" viewBox="0 0 14 14"&gt;
              </p>
              <p className="italic bg-muted text-yellow-300" style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> &lt;path</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>
                {" "}
                d="M3.85156 7.875L6.47656 10.5L10.8516 3.5"
              </p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>
                {" "}
                stroke="var(--realtime-primary-color)"
              </p>
              <p className="text-red-500" style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>
                {" "}
                strokeLinecap="round"
              </p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>
                {" "}
                strokeLinejoin="round"
              </p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> strokeWidth="1.5"</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> /&gt;</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> &lt;/svg&gt;</p>
            </div>

            {/* Duplicate instance for seamless loop */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: "20px",
                paddingBottom: "20px",
              }}
            >
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>switch (type) {"{"}</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> case 'success':</p>
              <p className="italic bg-muted text-primary" style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> return {"{"}</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>
                {" "}
                border: theme === 'dark' ? 'border-[rgba(34,197,94,0.4)]' : 'border-green-200',
              </p>
              <p className="italic bg-muted text-foreground" style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> icon: (</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>
                {" "}
                &lt;svg className={"{baseIconClasses}"} fill="none" viewBox="0 0 14 14"&gt;
              </p>
              <p className="italic bg-muted text-yellow-300" style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> &lt;path</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>
                {" "}
                d="M3.85156 7.875L6.47656 10.5L10.8516 3.5"
              </p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>
                {" "}
                stroke="var(--realtime-primary-color)"
              </p>
              <p className="text-red-500" style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>
                {" "}
                strokeLinecap="round"
              </p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}>
                {" "}
                strokeLinejoin="round"
              </p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> strokeWidth="1.5"</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> /&gt;</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontWeight: 400, display: "block" }}> &lt;/svg&gt;</p>
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
              background: "linear-gradient(to bottom, hsl(var(--background)), transparent)",
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
              background: "linear-gradient(to top, hsl(var(--background)), transparent)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div
        style={{
          position: "absolute",
          top: "46px",
          left: "calc(50% + 87.499px)",
          transform: "translateX(-50%)",
          width: "175px",
          height: "221px",
          background: "linear-gradient(180deg, var(--realtime-background-preview) 0%, transparent 100%)",
          backdropFilter: "blur(7.907px)",
          borderRadius: "9.488px",
          borderTopRightRadius: "9.488px",
          // Removed the border property from here
          overflow: "hidden",
          boxSizing: "border-box",
        }}
        data-name="preview-panel"
      >
        <div className="text-foreground"
          style={{
            padding: "9.488px 9.492px",
            height: "100%",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            background: "var(--realtime-background-preview)", // Applied solid background here
          }}
        >
          {/* Download Button - Exact positioning from Figma */}
          <div
            style={{
              position: "absolute",
              top: "calc(50% + 0.001px)",
              left: "calc(50% - 71.501px)",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7.907px",
              background: "var(--realtime-primary-color)",
              color: "var(--realtime-text-preview)",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
              padding: "6.326px 12.651px",
              borderRadius: "11.07px",
              boxShadow:
                "0px 52.186px 14.233px rgba(0, 0, 0, 0), 0px 33.209px 12.651px rgba(0, 0, 0, 0.01), 0px 18.977px 11.07px rgba(0, 0, 0, 0.05), 0px 7.907px 7.907px rgba(0, 0, 0, 0.09), 0px 1.581px 4.744px rgba(0, 0, 0, 0.1)",
              boxSizing: "border-box",
            }}
          >
            <div className=""
              style={{
                fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: "20.558px",
                lineHeight: "31.628px",
                letterSpacing: "-0.6326px",
                fontWeight: 500,
                color: "var(--realtime-text-preview)", // Changed to use theme variable
                textAlign: "left",
                whiteSpace: "pre",
              }}
            >
              Download for macOS
            </div>
          </div>
        </div>
      </div>

      {/* Connection Line - Exact positioning from Figma */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* This div now directly contains the SVG for the vertical line */}
        <div
          style={{
            position: "relative",
            width: "2px", // Width of the line (stroke width)
            height: "285.088px", // Length of the line
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="2"
            height="285.088"
            viewBox="0 0 2 285.088"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              inset: 0,
              display: "block",
              maxWidth: "none",
              width: "100%",
              height: "100%",
            }}
          >
            <defs>
              <linearGradient id="connectionGradient" x1="1" y1="0" x2="1" y2="285.088" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--realtime-primary-color)" stopOpacity="0" />
                <stop offset="0.5" stopColor="var(--realtime-primary-color)" />
                <stop offset="1" stopColor="var(--realtime-primary-color)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M1 0V285.088" stroke="url(#connectionGradient)" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Live Recording Indicator */}

      {/* Sync Indicator at connection point */}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

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

export default RealtimeCodingPreviews
