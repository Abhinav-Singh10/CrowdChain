import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThirdwebProvider } from "thirdweb/react";
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CrowdChain - Decentralized Crowdfunding Platform",
  description: "Connect visionary creators with forward-thinking backers through blockchain technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
           <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  )
}
