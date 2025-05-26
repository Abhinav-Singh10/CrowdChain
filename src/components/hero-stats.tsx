"use client"

import { useEffect, useState } from "react"
import { FadeIn } from "@/components/fade-in"

interface HeroStatsProps {
  className?: string
}

export function HeroStats({ className = "" }: HeroStatsProps) {
  const [stats, setStats] = useState({
    projects: 0,
    backers: 0,
    funded: 0,
  })


  useEffect(() => {
    const targetStats = {
      projects: 1250,
      backers: 25000,
      funded: 15,
    }
    const duration = 2000 // 2 seconds
    const frameDuration = 1000 / 60 // 60fps
    const totalFrames = Math.round(duration / frameDuration)
    let frame = 0

    const counter = setInterval(() => {
      frame++
      const progress = frame / totalFrames

      setStats({
        projects: Math.floor(progress * targetStats.projects),
        backers: Math.floor(progress * targetStats.backers),
        funded: Math.floor(progress * targetStats.funded * 10) / 10,
      })

      if (frame === totalFrames) {
        clearInterval(counter)
        setStats(targetStats)
      }
    }, frameDuration)

    return () => clearInterval(counter)
  }, [])

  return (
    <div className={`grid grid-cols-1 gap-8 sm:grid-cols-3 ${className}`}>
      <FadeIn delay={0.1}>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 text-center backdrop-blur">
          <div className="text-3xl font-bold text-white md:text-4xl">{stats.projects.toLocaleString()}+</div>
          <div className="mt-2 text-sm text-slate-400">Projects Launched</div>
        </div>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 text-center backdrop-blur">
          <div className="text-3xl font-bold text-white md:text-4xl">{stats.backers.toLocaleString()}+</div>
          <div className="mt-2 text-sm text-slate-400">Active Backers</div>
        </div>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 text-center backdrop-blur">
          <div className="text-3xl font-bold text-white md:text-4xl">${stats.funded.toLocaleString()}M+</div>
          <div className="mt-2 text-sm text-slate-400">Total Funded</div>
        </div>
      </FadeIn>
    </div>
  )
}
