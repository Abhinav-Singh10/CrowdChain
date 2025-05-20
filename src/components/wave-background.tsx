"use client"

import { useEffect, useRef } from "react"

interface WaveBackgroundProps {
  className?: string
}

export function WaveBackground({ className = "" }: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const drawWave = (
      yOffset: number,
      amplitude: number,
      frequency: number,
      speed: number,
      color: string,
      opacity: number,
    ) => {
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2 + yOffset)

      for (let x = 0; x < canvas.width; x++) {
        const y =
          Math.sin(x * frequency * 0.01 + time * speed) * amplitude +
          Math.sin(x * frequency * 0.02 + time * (speed * 0.8)) * (amplitude * 0.5) +
          yOffset
        ctx.lineTo(x, canvas.height / 2 + y)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()

      ctx.fillStyle = color
      ctx.globalAlpha = opacity
      ctx.fill()
      ctx.globalAlpha = 1
    }

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw multiple waves with different parameters
      drawWave(50, 20, 1, 1, "#0891B2", 0.3) // Cyan-600
      drawWave(80, 25, 1.5, 0.8, "#0E7490", 0.3) // Cyan-700
      drawWave(100, 30, 0.8, 1.2, "#155E75", 0.3) // Cyan-800
      drawWave(120, 35, 0.6, 0.9, "#164E63", 0.3) // Cyan-900

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resize)
    resize()
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} />
}
