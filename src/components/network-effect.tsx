"use client"

import { useEffect, useRef } from "react"

interface NetworkEffectProps {
  className?: string
  nodeCount?: number
  connectionDistance?: number
}

export function NetworkEffect({ className = "", nodeCount = 80, connectionDistance = 150 }: NetworkEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let nodes: Node[] = []

    class Node {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.radius = Math.random() * 2 + 1

        // Teal/Cyan color palette
        const colors = ["#2DD4BF", "#14B8A6", "#0D9488", "#0F766E"]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1

        this.x += this.vx
        this.y += this.vy
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    const init = () => {
      nodes = []
      // Adjust node count based on screen size
      const adjustedNodeCount = Math.min(nodeCount, (canvas.width * canvas.height) / 8000)
      for (let i = 0; i < adjustedNodeCount; i++) {
        nodes.push(new Node())
      }
    }

    const drawConnections = () => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            // Calculate opacity based on distance
            const opacity = 1 - distance / connectionDistance
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(14, 116, 144, ${opacity * 0.5})` // Cyan-700 with opacity
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update()
        nodes[i].draw()
      }

      // Draw connections between nodes
      drawConnections()

      animationFrameId = requestAnimationFrame(animate)
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      init()
    }

    window.addEventListener("resize", resize)
    resize()
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [nodeCount, connectionDistance])

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} />
}
