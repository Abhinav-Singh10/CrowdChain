"use client"

import { useEffect, useRef } from "react"

interface BlockchainImageProps {
  className?: string
}

export function BlockchainImage({ className = "" }: BlockchainImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    // Helper function to draw project icon
    const drawProjectIcon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isCenter = false) => {
      ctx.save()
      ctx.translate(x, y)

      if (isCenter) {
        // Draw vault/safe icon for center node
        const vaultWidth = size * 0.7
        const vaultHeight = size * 0.8

        // Vault body
        ctx.fillStyle = "#64748B" // Slate-500 - metallic color
        ctx.strokeStyle = "#334155" // Slate-700 - darker outline
        ctx.lineWidth = size * 0.04

        // Main vault body (slightly rounded rectangle)
        const cornerRadius = size * 0.05
        ctx.beginPath()
        ctx.moveTo(-vaultWidth / 2 + cornerRadius, -vaultHeight / 2)
        ctx.lineTo(vaultWidth / 2 - cornerRadius, -vaultHeight / 2)
        ctx.arcTo(vaultWidth / 2, -vaultHeight / 2, vaultWidth / 2, -vaultHeight / 2 + cornerRadius, cornerRadius)
        ctx.lineTo(vaultWidth / 2, vaultHeight / 2 - cornerRadius)
        ctx.arcTo(vaultWidth / 2, vaultHeight / 2, vaultWidth / 2 - cornerRadius, vaultHeight / 2, cornerRadius)
        ctx.lineTo(-vaultWidth / 2 + cornerRadius, vaultHeight / 2)
        ctx.arcTo(-vaultWidth / 2, vaultHeight / 2, -vaultWidth / 2, vaultHeight / 2 - cornerRadius, cornerRadius)
        ctx.lineTo(-vaultWidth / 2, -vaultHeight / 2 + cornerRadius)
        ctx.arcTo(-vaultWidth / 2, -vaultHeight / 2, -vaultWidth / 2 + cornerRadius, -vaultHeight / 2, cornerRadius)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // Vault door
        const doorSize = vaultHeight * 0.6
        ctx.beginPath()
        ctx.arc(0, 0, doorSize / 2, 0, Math.PI * 2)
        ctx.fillStyle = "#475569" // Slate-600 - slightly darker than body
        ctx.fill()
        ctx.stroke()

        // Vault dial/lock
        ctx.beginPath()
        ctx.arc(0, 0, doorSize / 4, 0, Math.PI * 2)
        ctx.fillStyle = "#FFD700" // Gold color
        ctx.fill()
        ctx.strokeStyle = "#B7950B" // Darker gold
        ctx.lineWidth = size * 0.02
        ctx.stroke()

        // Dial lines
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2
          const innerRadius = doorSize / 8
          const outerRadius = doorSize / 4 - size * 0.02

          ctx.beginPath()
          ctx.moveTo(innerRadius * Math.cos(angle), innerRadius * Math.sin(angle))
          ctx.lineTo(outerRadius * Math.cos(angle), outerRadius * Math.sin(angle))
          ctx.strokeStyle = "#334155" // Slate-700
          ctx.lineWidth = size * 0.02
          ctx.stroke()
        }

        // Vault handle
        ctx.beginPath()
        ctx.moveTo(vaultWidth / 2 - size * 0.05, 0)
        ctx.lineTo(vaultWidth / 2 + size * 0.1, 0)
        ctx.strokeStyle = "#334155" // Slate-700
        ctx.lineWidth = size * 0.06
        ctx.stroke()

        // Gold coins/bars peeking out (indicating value)
        ctx.fillStyle = "#FFD700" // Gold color
        ctx.beginPath()
        ctx.arc(-vaultWidth / 4, vaultHeight / 4, size * 0.08, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(vaultWidth / 4, vaultHeight / 4, size * 0.08, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Draw regular project (document/blueprint style)
        // Main document
        ctx.fillStyle = "white"
        ctx.strokeStyle = "white"
        ctx.lineWidth = size * 0.05

        // Draw document base
        ctx.beginPath()
        ctx.moveTo(-size * 0.3, -size * 0.4)
        ctx.lineTo(size * 0.3, -size * 0.4)
        ctx.lineTo(size * 0.3, size * 0.4)
        ctx.lineTo(-size * 0.3, size * 0.4)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // Draw document lines (text representation)
        ctx.strokeStyle = "#0D9488" // Teal color
        ctx.lineWidth = size * 0.03

        // Draw 3 horizontal lines to represent text
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.moveTo(-size * 0.2, -size * 0.2 + i * size * 0.2)
          ctx.lineTo(size * 0.2, -size * 0.2 + i * size * 0.2)
          ctx.stroke()
        }
      }

      ctx.restore()
    }

    // Helper function to draw coin
    const drawCoin = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, opacity = 1) => {
      ctx.globalAlpha = opacity

      // Coin circle
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = "#FFD700" // Gold color
      ctx.fill()
      ctx.strokeStyle = "#B7950B" // Darker gold
      ctx.lineWidth = radius * 0.2
      ctx.stroke()

      // ETH symbol (simplified)
      const symbolSize = radius * 0.6
      ctx.beginPath()
      ctx.moveTo(x, y - symbolSize)
      ctx.lineTo(x + symbolSize, y)
      ctx.lineTo(x, y + symbolSize)
      ctx.lineTo(x - symbolSize, y)
      ctx.closePath()
      ctx.fillStyle = "#B7950B" // Darker gold
      ctx.fill()

      ctx.globalAlpha = 1 // Reset opacity
    }

    // Define blockchain blocks
    class Block {
      x: number
      y: number
      width: number
      height: number
      color: string
      connections: Block[]
      id: number
      pulsePhase: number
      isCenter: boolean

      constructor(x: number, y: number, width: number, height: number, color: string, id: number, isCenter = false) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.connections = []
        this.id = id
        this.pulsePhase = Math.random() * Math.PI * 2 // Random starting phase
        this.isCenter = isCenter
      }

      draw(ctx: CanvasRenderingContext2D, time: number) {
        // Pulse effect
        const pulse = Math.sin(time * 2 + this.pulsePhase) * 0.1 + 0.9

        // Draw block with glow
        ctx.save()
        ctx.shadowColor = this.color
        ctx.shadowBlur = 10 * pulse
        ctx.fillStyle = this.color
        ctx.globalAlpha = 0.7 * pulse
        ctx.fillRect(this.x, this.y, this.width, this.height)

        // Draw border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        ctx.lineWidth = 1
        ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.restore()

        // Draw project icon instead of person
        drawProjectIcon(
          ctx,
          this.x + this.width / 2,
          this.y + this.height / 2,
          this.width * 0.8,
          this.isCenter, // Pass true for center block to draw vault icon
        )

        // Draw connections
        this.connections.forEach((block, index) => {
          this.drawConnection(ctx, block, time, index)
        })
      }

      drawConnection(ctx: CanvasRenderingContext2D, block: Block, time: number, connectionIndex: number) {
        const startX = this.x + this.width / 2
        const startY = this.y + this.height / 2
        const endX = block.x + block.width / 2
        const endY = block.y + block.height / 2

        // Draw connection line
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = "rgba(20, 184, 166, 0.3)" // Teal color
        ctx.lineWidth = 1
        ctx.stroke()

        // Only show coins on certain connections at certain times
        // Create a sequential pattern where coins move one after another
        const cycleLength = 3 // How many connections show coins at once (out of total connections)
        const cycleDuration = 4 // How long a complete cycle takes (in seconds)
        const cycleOffset = (connectionIndex * (cycleDuration / cycleLength)) % cycleDuration

        // Calculate if this connection should show a coin based on time
        const cycleTime = (time * 0.5) % cycleDuration // Slow down the cycle
        const shouldShowCoin = cycleTime >= cycleOffset && cycleTime < cycleOffset + cycleDuration / cycleLength

        if (shouldShowCoin) {
          // Calculate progress within this connection's active time
          const connectionProgress = (cycleTime - cycleOffset) / (cycleDuration / cycleLength)
          const clampedProgress = Math.max(0, Math.min(1, connectionProgress))

          const packetX = startX + (endX - startX) * clampedProgress
          const packetY = startY + (endY - startY) * clampedProgress

          // Calculate distance from coin to both nodes
          const distToStart = Math.sqrt(Math.pow(packetX - startX, 2) + Math.pow(packetY - startY, 2))
          const distToEnd = Math.sqrt(Math.pow(packetX - endX, 2) + Math.pow(packetY - endY, 2))

          // Calculate total distance between nodes
          const totalDist = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))

          // Define thresholds for visibility and fading
          const hideThreshold = totalDist * 0.15 // Completely hide when closer than this
          const fadeThreshold = totalDist * 0.25 // Start fading when closer than this

          // Calculate opacity based on distance to nearest node
          let opacity = 1.0
          const distToNearest = Math.min(distToStart, distToEnd)

          if (distToNearest < hideThreshold) {
            opacity = 0 // Completely transparent when too close
          } else if (distToNearest < fadeThreshold) {
            // Linear fade from 0 to 1 between hideThreshold and fadeThreshold
            opacity = (distToNearest - hideThreshold) / (fadeThreshold - hideThreshold)
          }

          // Only draw if there's some visibility
          if (opacity > 0) {
            // Draw coin with calculated opacity
            drawCoin(ctx, packetX, packetY, 6, opacity)
          }
        }
      }
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initBlocks()
    }

    let blocks: Block[] = []

    const initBlocks = () => {
      blocks = []
      const blockSize = 50 // Increased block size for better visibility of project icons
      const blockCount = 6 // Reduced from 7 to 6 for better spacing
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.3

      // Create blocks in a circular pattern
      for (let i = 0; i < blockCount; i++) {
        const angle = (i / blockCount) * Math.PI * 2
        const x = centerX + Math.cos(angle) * radius - blockSize / 2
        const y = centerY + Math.sin(angle) * radius - blockSize / 2

        // Different colors for blocks
        let color
        if (i % 3 === 0) {
          color = "#0891B2" // Cyan-600
        } else if (i % 3 === 1) {
          color = "#0D9488" // Teal-600
        } else {
          color = "#0284C7" // Sky-600
        }

        blocks.push(new Block(x, y, blockSize, blockSize, color, i + 1))
      }

      // Add central block (vault)
      blocks.push(
        new Block(
          centerX - blockSize / 2,
          centerY - blockSize / 2,
          blockSize,
          blockSize,
          "#2563EB", // Blue color for central vault
          0,
          true, // Mark as center block
        ),
      )

      // Connect blocks
      for (let i = 0; i < blockCount; i++) {
        // Connect to central block
        blocks[i].connections.push(blocks[blockCount])
        blocks[blockCount].connections.push(blocks[i])

        // Connect to next block in circle
        blocks[i].connections.push(blocks[(i + 1) % blockCount])
      }
    }

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw blocks and connections
      blocks.forEach((block) => {
        block.draw(ctx, time)
      })

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
