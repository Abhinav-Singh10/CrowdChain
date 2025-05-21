"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface VoteTimerProps {
  endTime: number
}

export function VoteTimer({ endTime }: VoteTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number
    minutes: number
    seconds: number
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime - Date.now()

      if (difference <= 0) {
        setIsExpired(true)
        return { hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  // Format time with leading zeros
  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0")
  }

  return (
    <div className={`rounded-lg p-3 text-center ${isExpired ? "bg-red-500/10" : "bg-slate-800/50"}`}>
      <div className="mb-1 flex items-center justify-center">
        <Clock className="mr-2 h-4 w-4" />
        <span className="text-sm font-medium">{isExpired ? "Vote Ended" : "Vote Ends In"}</span>
      </div>

      {isExpired ? (
        <p className="text-red-400">Expired</p>
      ) : (
        <div className="flex items-center justify-center space-x-1 font-mono text-lg font-bold">
          <span>{formatTime(timeLeft.hours)}</span>
          <span>:</span>
          <span>{formatTime(timeLeft.minutes)}</span>
          <span>:</span>
          <span>{formatTime(timeLeft.seconds)}</span>
        </div>
      )}
    </div>
  )
}
