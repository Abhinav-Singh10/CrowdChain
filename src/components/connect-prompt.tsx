"use client"

import Link from "next/link"
import { ArrowRight, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NetworkEffect } from "@/components/network-effect"
import { FadeIn } from "@/components/fade-in"
import ConnectButtonNav from "./ConnectButtonNav"

interface ConnectPromptProps {
  title: string
  description: string
}

export function ConnectPrompt({ title, description }: ConnectPromptProps) {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
      <NetworkEffect className="absolute inset-0 opacity-30" />
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-16 text-center">
        <FadeIn>
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-600">
            <Wallet className="h-10 w-10" />
          </div>
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h1>
          <p className="mb-8 text-lg text-slate-400">{description}</p>
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-cyan-600 px-8 text-lg"
          >
          <ConnectButtonNav/>
          </Button>
        </FadeIn>
      </div>
    </div>
  )
}
