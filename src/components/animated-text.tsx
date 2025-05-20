"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface AnimatedTextProps {
  children: React.ReactNode
}

export function AnimatedText({ children }: AnimatedTextProps) {
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const textElement = textRef.current
    if (!textElement) return

    const letters = textElement.innerText.split("")
    textElement.innerHTML = ""

    letters.forEach((letter, i) => {
      const span = document.createElement("span")
      span.textContent = letter
      span.style.animationDelay = `${i * 0.05}s`
      span.className = "inline-block animate-text-reveal opacity-0"
      textElement.appendChild(span)
    })

    return () => {
      if (textElement) textElement.innerHTML = letters.join("")
    }
  }, [children])

  return <span ref={textRef}>{children}</span>
}
