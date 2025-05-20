import Link from "next/link"
import { ArrowRight, Globe, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { AnimatedText } from "@/components/animated-text"
import { FadeIn } from "@/components/fade-in"
import { NetworkEffect } from "@/components/network-effect"
import { WaveBackground } from "@/components/wave-background"
import { HeroStats } from "@/components/hero-stats"
import { HeroImage } from "@/components/hero-image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import CustomConnectTrigger  from "@/components/CustomConnectTrigger"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <NetworkEffect className="absolute inset-0 opacity-30" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="text-center md:text-left">
            <FadeIn>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                <AnimatedText>Decentralized Funding</AnimatedText>
                <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500 bg-clip-text text-transparent">
                  {" "}
                  For The Future
                </span>
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 md:mx-0 md:text-xl">
                CrowdChain connects visionary creators with forward-thinking backers through blockchain technology,
                eliminating middlemen and maximizing impact.
              </p>
            </FadeIn>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
              <CustomConnectTrigger />
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 bg-transparent px-8 text-lg hover:bg-slate-900 hover:border-slate-600"
                asChild
              >
                <Link href="/explore">Explore Projects</Link>
              </Button>
            </div>
          </div>

          <HeroImage className="hidden md:block" />
        </div>

        <HeroStats className="mt-24" />
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "All transactions are secured by blockchain technology, ensuring transparency and immutability.",
    },
    {
      icon: Globe,
      title: "Global Access",
      description:
        "Anyone from anywhere can participate in funding or creating projects without geographical limitations.",
    },
    {
      icon: Zap,
      title: "Instant Funding",
      description:
        "Funds are transferred instantly to project creators without waiting for traditional banking clearance.",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <FadeIn>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Revolutionary Features</h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-slate-400">
            CrowdChain leverages cutting-edge blockchain technology to provide a seamless crowdfunding experience.
          </p>
        </FadeIn>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-600">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      title: "Connect Your Wallet",
      description: "Link your cryptocurrency wallet to access all CrowdChain features securely.",
    },
    {
      title: "Create or Fund Projects",
      description: "Launch your own campaign or browse existing projects to support.",
    },
    {
      title: "Track Progress Transparently",
      description: "Monitor funding milestones and project development in real-time.",
    },
  ]

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-teal-900/10" />
      <div className="container relative z-10 mx-auto px-4">
        <FadeIn>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-slate-400">
            Getting started with CrowdChain is simple and straightforward.
          </p>
        </FadeIn>
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-12 top-0 h-full w-0.5 bg-gradient-to-b from-teal-500 to-cyan-600 md:left-1/2 md:-ml-0.5" />
          {steps.map((step, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="relative mb-12 md:mb-24">
                <div
                  className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    } items-center gap-8`}
                >
                  <div className="flex md:w-1/2">
                    <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold">
                      <div className="absolute h-full w-full animate-ping rounded-full bg-teal-600/20" />
                      <div className="absolute h-full w-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 opacity-50" />
                      {index + 1}
                    </div>
                  </div>
                  <div className="text-center md:w-1/2 md:text-left">
                    <h3 className="mb-2 text-xl font-bold md:text-2xl">{step.title}</h3>
                    <p className="text-slate-400">{step.description}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900/50 to-cyan-900/50 p-8 md:p-16">
          <WaveBackground className="absolute inset-0 opacity-20" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <FadeIn>
              <h2 className="mb-6 text-3xl font-bold md:text-5xl">Ready to Join the Future of Crowdfunding?</h2>
              <p className="mb-10 text-lg text-slate-300 md:text-xl">
                Connect your wallet today and become part of a revolutionary platform that's changing how projects get
                funded.
              </p>
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-teal-500 to-cyan-600 px-8 text-lg hover:shadow-lg hover:shadow-teal-500/20"
              >
                <Link href="/connect">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
