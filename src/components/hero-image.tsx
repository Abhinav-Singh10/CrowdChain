"use client"

import { useEffect, useRef } from "react"
import { BlockchainImage } from "@/components/blockchain-image"
import { FadeIn } from "@/components/fade-in"

interface HeroImageProps {
  className?: string
}

export function HeroImage({ className = "" }: HeroImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5

      // Subtle parallax effect
      container.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <FadeIn delay={0.3} className={className}>
      <div
        ref={containerRef}
        className="relative mx-auto aspect-square w-full max-w-lg transition-transform duration-200 ease-out md:max-w-xl lg:max-w-2xl"
      >
        {/* Glow effect behind image */}
        <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 blur-3xl" />

        {/* Main image container */}
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur">
          {/* Blockchain visualization */}
          <BlockchainImage className="h-full w-full" />

          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/10 via-transparent to-transparent pointer-events-none" />

          {/* Overlay text */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white md:text-2xl">Blockchain Powered</h3>
              <p className="text-sm text-slate-300 md:text-base">Secure Funding Through Smart Contracts</p>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
