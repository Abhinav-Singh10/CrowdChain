"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { type Campaign, weiToEth, gweiToEth } from "@/lib/mockData"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircularProgress } from "@/components/ui/circular-progress"

interface CampaignCardProps {
  campaign: Campaign
  index?: number
}

export function CampaignCard({ campaign, index = 0 }: CampaignCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Calculate progress percentage
  const goalInWei = campaign.goalAmount * 1e9 // Convert Gwei to Wei
  const progressPercentage = Math.min(Math.round((campaign.totalAmountRaised / goalInWei) * 100), 100)

  // Format dates
  const timeLeft =
    campaign.status === "Active" ? formatDistanceToNow(new Date(campaign.endDate), { addSuffix: true }) : ""

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-teal-500 hover:bg-teal-600"
      case "Ended":
        return "bg-slate-500 hover:bg-slate-600"
      case "Cancelled":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-slate-500 hover:bg-slate-600"
    }
  }

  // Vote status badge color
  const getVoteStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-cyan-500 hover:bg-cyan-600"
      case "Approved":
        return "bg-green-500 hover:bg-green-600"
      case "Rejected":
        return "bg-red-500 hover:bg-red-600"
      case "Eligible":
        return "bg-amber-500 hover:bg-amber-600"
      default:
        return "bg-slate-500 hover:bg-slate-600"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-slate-800 bg-slate-900/50 backdrop-blur transition-all duration-300 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={campaign.imageUrl || "/placeholder.svg"}
              alt={campaign.title}
              fill
              className="object-cover transition-transform duration-500 ease-in-out"
              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(campaign.status)}`}>{campaign.status}</Badge>
                {campaign.status === "Active" && (
                  <div className="flex items-center text-xs text-slate-300">
                    <Clock className="mr-1 h-3 w-3" />
                    {timeLeft}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-1 text-xl font-bold text-white">{campaign.title}</h3> 
          <p className="mb-4 line-clamp-2 text-sm text-slate-400">{campaign.description}</p>

          <div className="mb-4 flex items-center justify-between">
            <CircularProgress value={progressPercentage} size={60} strokeWidth={5} />
            <div className="text-right">
              <p className="text-sm text-slate-400">Raised</p>
              <p className="text-lg font- text-white">{weiToEth(campaign.totalAmountRaised).toFixed(2)} ETH</p>
              <p className="text-xs text-slate-400">of {gweiToEth(campaign.goalAmount).toFixed(2)} ETH</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-slate-800/50 p-2">
              <p className="text-xs text-slate-400">Donors</p>
              <p className="font-bold text-white">{campaign.totalDonors}</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-2">
              <p className="text-xs text-slate-400">Granted</p>
              <p className="font-bold text-white">{weiToEth(campaign.fundingGranted).toFixed(2)} ETH</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-slate-400">Vote Status</p>
            <Badge className={`mt-1 ${getVoteStatusColor(campaign.voteStatus)}`}>{campaign.voteStatus}</Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20"
          >
            <Link href={`/campaigns/${campaign.address}`} className="flex items-center justify-center">
              View Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
