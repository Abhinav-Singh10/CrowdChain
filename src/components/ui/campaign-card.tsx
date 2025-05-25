"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Clock } from "lucide-react"
import { formatDistanceToNow, fromUnixTime } from "date-fns"
import { weiToEth, gweiToEth, CampaignDetails } from "@/lib/mockData"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircularProgress } from "@/components/ui/circular-progress"
import { getContract } from "thirdweb"
import { client } from "@/app/client"
import { sepolia } from "thirdweb/chains"
import { useReadContract } from "thirdweb/react"

// Map status and voteStatus numbers to strings
const statusMap: Record<number, CampaignDetails['status']> = {
  0: 'Active',
  1: 'Ended',
  2: 'Cancelled',
};

const voteStatusMap: Record<number, CampaignDetails['voteStatus']> = {
  0: 'Active',
  1: 'Approved',
  2: 'Rejected',
  3: 'NoVotes',
  4: 'Eligible',
};

interface CampaignCardProps {
  address: string
  index?: number
}

export function CampaignCard({ address, index = 0 }: CampaignCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Calling real data from the deployed contracts
  const contract = getContract({
    client: client,
    chain: sepolia,
    address:address,
  })

  // ALL CONTRACT DETAILS IMPORTED HERE 
  // 1. goal amount
  const { data: RawgoalAmount, isPending:isLoadingRawgoalAmount } = useReadContract({
    contract,
    method: "function goalAmount() view returns (uint256)",
    params: [],
  });
  const goalAmount= RawgoalAmount? Number(RawgoalAmount): 0;
  // 2. totalAmountRaised
  const { data: RawtotalAmountRaised, isPending: isLoadingRawtotalAmountRaised} = useReadContract({
    contract,
    method:
      "function totalAmountRaised() view returns (uint256)",
    params: [],
  });
  const totalAmountRaised = Number(RawtotalAmountRaised);
  // 3. Campaign Status
  const { data: IndexdCampaignStatus, isPending :isLoadingIndexdCampaignStatus } = useReadContract({
    contract,
    method: "function status() view returns (uint8)",
    params: [],
  });
  const status = IndexdCampaignStatus ? statusMap[IndexdCampaignStatus] : "Active"
  // 4. endDate
  const { data: EndDateAsEpoch, isPending :isLoadingEndDateAsEpoch } = useReadContract({
    contract,
    method: "function endDate() view returns (uint256)",
    params: [],
  });
  const endDate = EndDateAsEpoch ? Number(EndDateAsEpoch) : 77 // NEED TO FIX THIS
  // 5. VoteStatus
  const { data: CurrentVoteStatus, isPending :isLoadingCurrentVoteStatus} = useReadContract({
    contract,
    method:
      "function getCurrentVoteStatus() view returns (uint8)",
    params: [],
  });
  const voteStatus = CurrentVoteStatus ? voteStatusMap[CurrentVoteStatus] : "NoVotes"
  // 6. ImageUrl
  const { data: RawImageURL, isPending :isLoadingRawImageURL} = useReadContract({
    contract,
    method: "function imageUrl() view returns (string)",
    params: [],
  });
  const imageUrl = RawImageURL ? RawImageURL : "";
  // 7. Title
  const { data:RawTitle, isPending :isLoadingRawTitle} = useReadContract({
    contract,
    method: "function title() view returns (string)",
    params: [],
  });
  const title = RawTitle ? RawTitle : "";
  // 7. Description
  const { data:RawDesc, isPending :isLoadingRawDesc} = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });
  const desc = RawDesc ? RawDesc : "";
  // 8. Total Donors
    const { data:RawDonorNumber, isPending :isLoadingRawDonorNumber} = useReadContract({
    contract,
    method:
      "function getTotalDonors() view returns (uint256)",
    params: [],
  });
  const totalDonors= RawDonorNumber? RawDonorNumber:0;
  // 9. Funding Granted
  const { data:RawFundingGranted, isPending :isLoadingRawFundingGranted} = useReadContract({
    contract,
    method:
      "function FundingGranted() view returns (uint256)",
    params: [],
  });
  const fundingGranted= RawFundingGranted? Number(RawFundingGranted):0;



  // Calculate progress percentage
  const goalInWei = goalAmount ? Number(goalAmount) * 1e9 : 0 // Convert Gwei to Wei
  const progressPercentage = Math.min(Math.round((totalAmountRaised / goalInWei) * 100), 100)

  // Format dates
  const timeLeft =
    status === "Active" ? formatDistanceToNow(fromUnixTime(endDate), { addSuffix: true }) : ""

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
  const getVoteStatusColor = (voteStatus: string) => {
    switch (voteStatus) {
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
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 ease-in-out"
              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
                {status === "Active" && (
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
          <h3 className="mb-2 line-clamp-1 text-xl font-bold text-white">{title}</h3>
          <p className="mb-4 line-clamp-2 text-sm text-slate-400">{desc}</p>

          <div className="mb-4 flex items-center justify-between">
            <CircularProgress value={progressPercentage} size={60} strokeWidth={5} />
            <div className="text-right">
              <p className="text-sm text-slate-400">Raised</p>
              <p className="text-lg font- text-white">{weiToEth(totalAmountRaised).toFixed(2)} ETH</p>
              <p className="text-xs text-slate-400">of {gweiToEth(goalAmount).toFixed(2)} ETH</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-slate-800/50 p-2">
              <p className="text-xs text-slate-400">Donors</p>
              <p className="font-bold text-white">{totalDonors}</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-2">
              <p className="text-xs text-slate-400">Granted</p>
              <p className="font-bold text-white">{weiToEth(fundingGranted).toFixed(2)} ETH</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-slate-400">Vote Status</p>
            <Badge className={`mt-1 ${getVoteStatusColor(voteStatus)}`}>{voteStatus}</Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20"
          >
            <Link href={`/campaigns/${address}`} className="flex items-center justify-center">
              View Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
