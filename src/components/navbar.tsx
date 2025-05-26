"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

import ConnectButtonNav from "./ConnectButtonNav"
import CustomConnectTrigger from "./customConnectTrigger"

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/campaigns", label: "Campaigns" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/create", label: "Create" },
  ]

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-slate-950/80 backdrop-blur-md" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-white">Crowd</span>
              <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">Chain</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${isActive(link.href) ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            {/* <Button
              asChild
              className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-cyan-600 hover:shadow-lg hover:shadow-teal-500/20"
            >
              <Link href="/connect">Connect Wallet</Link>
            </Button> */}
            <ConnectButtonNav />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="absolute left-0 top-20 z-50 w-full bg-slate-950/95 backdrop-blur-md">
          <nav className="container mx-auto flex flex-col space-y-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`p-2 text-sm font-medium transition-colors ${isActive(link.href) ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* <Button
              asChild
              className="mt-2 w-full group relative overflow-hidden bg-gradient-to-r from-teal-500 to-cyan-600 hover:shadow-lg hover:shadow-teal-500/20"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href="/connect">Connect Wallet</Link>
            </Button> */}
            <CustomConnectTrigger />
          </nav>
        </div>
      )}
    </header>
  )
}
