"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

export function SocialProof() {
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [shiningBox, setShiningBox] = useState<number | null>(null)

  useEffect(() => {
    // Initial delay of 3 seconds before first hover
    const initialTimeout = setTimeout(() => {
      setIsCardHovered(true)
    }, 3000)

    return () => {
      clearTimeout(initialTimeout)
    }
  }, [])

  useEffect(() => {
    if (!isCardHovered) return

    // Cycle through boxes to make them shine
    let currentIndex = 0
    const totalLogos = 8

    const shineInterval = setInterval(() => {
      setShiningBox(currentIndex)
      currentIndex = (currentIndex + 1) % totalLogos
    }, 600) // Change every 600ms

    return () => clearInterval(shineInterval)
  }, [isCardHovered])

  const logos = Array.from({ length: 8 }, (_, i) => i + 1)

  return (
    <section
      className="self-stretch py-16 flex flex-col justify-center items-center gap-6 overflow-hidden relative"
      style={{
        transform: isCardHovered ? "translateY(-10px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div className="text-center text-sm font-medium leading-tight text-gray-400 italic">
        Trusted by fast-growing startups
      </div>
      
      {/* Scrolling container */}
      <div className="self-stretch relative overflow-hidden" style={{ minHeight: "120px", width: "100%" }}>
        {/* Scrolling wrapper - switches from grid to flex on hover */}
        <div
          className={isCardHovered ? "flex" : "grid grid-cols-2 md:grid-cols-4"}
          style={{
            gap: "2rem",
            justifyItems: "center",
            alignItems: "center",
            width: isCardHovered ? "calc(200% + 128px)" : "100%",
            animation: isCardHovered ? "scrollLeftToRight 20s linear infinite" : "none",
            willChange: "transform",
            transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* First instance */}
          {logos.map((logoNum, i) => (
            <div
              key={`first-${i}`}
              className={isCardHovered ? "flex-shrink-0" : ""}
              style={{
                width: isCardHovered ? "250px" : "100%",
                maxWidth: "400px",
                position: "relative",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: shiningBox === i ? "scale(1.15)" : "scale(1)",
                filter: shiningBox === i ? "brightness(1.4) grayscale(0%) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))" : "brightness(0.7) grayscale(100%)",
                opacity: shiningBox === i ? 1 : 0.7,
                zIndex: shiningBox === i ? 10 : 1,
              }}
            >
              <Image
                src={`/logos/logo0${logoNum}.svg`}
                alt={`Company Logo ${logoNum}`}
                width={400}
                height={120}
                className="w-full h-auto object-contain"
                style={{
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
              {/* Shine overlay */}
              {shiningBox === i && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
                    animation: "shine 0.6s ease-out",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          ))}

          {/* Duplicate instance for seamless loop - only visible when hovered */}
          {isCardHovered &&
            logos.map((logoNum, i) => (
              <div
                key={`second-${i}`}
                className="flex-shrink-0"
                style={{
                  width: "250px",
                  maxWidth: "400px",
                  position: "relative",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: shiningBox === i ? "scale(1.15)" : "scale(1)",
                  filter: shiningBox === i ? "brightness(1.4) grayscale(0%) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))" : "brightness(0.7) grayscale(100%)",
                  opacity: shiningBox === i ? 1 : 0.7,
                  zIndex: shiningBox === i ? 10 : 1,
                }}
              >
                <Image
                  src={`/logos/logo0${logoNum}.svg`}
                  alt={`Company Logo ${logoNum}`}
                  width={400}
                  height={120}
                  className="w-full h-auto object-contain"
                  style={{
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
                {/* Shine overlay */}
                {shiningBox === i && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
                      animation: "shine 0.6s ease-out",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>
            ))}
        </div>

        {/* Gradient masks for fade effect */}
        <div
          className="absolute left-0 top-0 bottom-0 pointer-events-none z-10"
          style={{
            width: "100px",
            background: "linear-gradient(to right, hsl(var(--background)), transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 pointer-events-none z-10"
          style={{
            width: "100px",
            background: "linear-gradient(to left, hsl(var(--background)), transparent)",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes scrollLeftToRight {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 64px));
          }
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </section>
  )
}
