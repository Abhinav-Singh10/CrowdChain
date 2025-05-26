"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast, Toaster } from "react-hot-toast"
import { User, Wallet, PlusCircle, Clock } from "lucide-react"
import { mockUser, formatAddress, weiToEth, CampaignDetails, statusMap, voteStatusMap } from "@/lib/mockData"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CampaignCard } from "@/components/ui/campaign-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { NetworkEffect } from "@/components/network-effect"
import { Skeleton } from "@/components/ui/skeleton"
import { useActiveAccount, useReadContract, useWalletBalance } from "thirdweb/react"
import { ConnectPrompt } from "@/components/connect-prompt"
import { getContract } from "thirdweb"
import { client } from "../client"
import { sepolia } from "thirdweb/chains"
import { CROWDFUDNING_FACTORY } from "@/constants/contracts"

export default function DashboardPage() {
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<CampaignDetails[]>([])
  const [myDonations, setMyDonations] = useState<any[]>([])

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: CROWDFUDNING_FACTORY,
  })

  const { data: Funds, isLoading: isLoadingBalance, } = useWalletBalance({
    chain: sepolia,
    address: account?.address,
    client,
  });

  // 1. Get All User Campaigns
  const { data: RawUserCampaigns, isPending: isLoadingUserCampaigns } = useReadContract({
    contract,
    method:
      "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string title, uint256 goalAmount, uint256 totalAmountRaised, uint8 status, uint8 voteStatus, bool voteEligible)[])",
    params: [account?.address || "0x5DCA238E3D8C661f467faa3F5AC222bEc0dFD778"],
  });

  // Simulate loading data
  useEffect(() => {
    if (isLoadingUserCampaigns) {
      setIsLoading(true);
    } else {
      if (RawUserCampaigns) {
        const formattedCampaigns: CampaignDetails[] = RawUserCampaigns?.map(campaign => ({
          address: campaign.campaignAddress,
          owner: campaign.owner,
          title: campaign.title,
          goalAmount: Number(campaign.goalAmount) / 1e9,
          status: statusMap[campaign.status] || 'Active',
          voteEligible: campaign.voteEligible,
          voteStatus: voteStatusMap[campaign.voteStatus] || 'NoVotes',
        }))
        setCampaigns(formattedCampaigns);
        setIsLoading(false)
      }
    }
  }, [isLoadingUserCampaigns, RawUserCampaigns])

  // Show toast for active votes
  useEffect(() => {
    if (!isLoading && myDonations.some((campaign) => campaign.voteStatus === "Active")) {
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-slate-900 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Clock className="h-10 w-10 text-cyan-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">Active Votes Available</p>
                  <p className="mt-1 text-sm text-slate-400">
                    You have campaigns with active votes. Check your donations tab to vote!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-slate-700">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-cyan-500 hover:text-cyan-400 focus:outline-none"
              >
                Dismiss
              </button>
            </div>
          </div>
        ),
        { duration: 5000 },
      )
    }
  }, [isLoading, myDonations])

  if (!account) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950 text-white">
        <Navbar />
        <main className="flex-1">
          <ConnectPrompt
            title="Features Locked"
            description="Connect your wallet to explore all the revolutionary features CrowdChain has to offer."
          />
        </main>
        <Footer />

      </div>
    )
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950 text-white">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-20">
            <Skeleton className="mb-8 h-16 w-64" />

            <Skeleton className="mb-8 h-12 w-full" />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />
      <main className="flex-1">
        <section className="relative py-20 md:py-32">
          <NetworkEffect className="absolute inset-0 opacity-30" />
          <div className="container relative z-10 mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="mb-8 flex items-center">
                <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-600">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold md:text-4xl">My Dashboard</h1>
                  <div className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4 text-slate-400" />
                    <span className="font-mono text-sm text-slate-400">{formatAddress(account.address)}</span>
                  </div>
                  {isLoadingBalance && (<div className="text-right">
                    <p className="text-sm text-slate-400">Current Balance</p>
                    <p className="text-3xl font-bold text-teal-400">{Funds} ETH</p>
                  </div>)}
                </div>
              </div>

              <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg bg-slate-800/50 p-4 text-center">
                      <p className="text-sm text-slate-400">My Campaigns</p>
                      <p className="text-2xl font-bold text-white">{campaigns.length}</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/50 p-4 text-center">
                      <p className="text-sm text-slate-400">Campaigns Supported</p>
                      <p className="text-2xl font-bold text-white">{myDonations.length}</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/50 p-4 text-center">
                      <p className="text-sm text-slate-400">Total Donated</p>
                      <p className="text-2xl font-bold text-white">
                        {weiToEth(
                          myDonations.reduce((total, campaign) => total + (campaign.donations[mockUser] || 0), 0),
                        ).toFixed(2)}{" "}
                        ETH
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Tabs defaultValue="campaigns" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                  <TabsTrigger
                    value="campaigns"
                    className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                  >
                    My Campaigns
                  </TabsTrigger>
                  <TabsTrigger
                    value="donations"
                    className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                  >
                    My Donations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="campaigns" className="mt-6">
                  {campaigns.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {campaigns.map((campaign, index) => (
                        <CampaignCard key={campaign.address} address={campaign.address} index={index} />
                      ))}

                      <Card className="flex h-full flex-col items-center justify-center border-dashed border-slate-800 bg-slate-900/30 p-6 text-center hover:border-slate-700">
                        <PlusCircle className="mb-4 h-12 w-12 text-slate-400" />
                        <h3 className="mb-2 text-xl font-medium text-white">Create New Campaign</h3>
                        <p className="mb-6 text-sm text-slate-400">
                          Start a new crowdfunding campaign for your project
                        </p>
                        <Button asChild className="bg-gradient-to-r from-teal-500 to-cyan-600">
                          <a href="/create">Create Campaign</a>
                        </Button>
                      </Card>
                    </div>
                  ) : (
                    <Card className="border-slate-800 bg-slate-900/50 p-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                        <PlusCircle className="h-8 w-8 text-slate-400" />
                      </div>
                      <CardTitle className="mb-2">No Campaigns Yet</CardTitle>
                      <CardDescription className="mb-6 text-slate-400">
                        You haven't created any campaigns yet. Start your first campaign now!
                      </CardDescription>
                      <Button asChild className="bg-gradient-to-r from-teal-500 to-cyan-600">
                        <a href="/create">Create Campaign</a>
                      </Button>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="donations" className="mt-6">
                  {myDonations.length > 0 ? (
                    <div className="space-y-6">
                      {myDonations.map((campaign, index) => (
                        <motion.div
                          key={campaign.address}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
                            <CardContent className="p-6">
                              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                  <div className="mb-1 flex items-center">
                                    <h3 className="text-xl font-bold">{campaign.title}</h3>
                                    {campaign.voteStatus === "Active" && (
                                      <Badge className="ml-2 bg-cyan-500">Active Vote</Badge>
                                    )}
                                  </div>
                                  <p className="mb-2 line-clamp-1 text-sm text-slate-400">{campaign.description}</p>
                                  <div className="flex flex-wrap gap-4">
                                    <div>
                                      <p className="text-xs text-slate-400">Your Donation</p>
                                      <p className="font-bold text-teal-400">
                                        {weiToEth(campaign.donations[mockUser]).toFixed(2)} ETH
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-400">Campaign Status</p>
                                      <p className="font-medium">{campaign.status}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-400">Vote Status</p>
                                      <Badge className={`${getVoteStatusColor(campaign.voteStatus)}`}>
                                        {campaign.voteStatus}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-shrink-0 gap-2">
                                  {campaign.voteStatus === "Active" && (
                                    <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
                                      <a href={`/campaigns/${campaign.address}`}>Vote Now</a>
                                    </Button>
                                  )}
                                  <Button asChild variant="outline" className="border-slate-700 bg-slate-800/50">
                                    <a href={`/campaigns/${campaign.address}`}>View Details</a>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-slate-800 bg-slate-900/50 p-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                        <Wallet className="h-8 w-8 text-slate-400" />
                      </div>
                      <CardTitle className="mb-2">No Donations Yet</CardTitle>
                      <CardDescription className="mb-6 text-slate-400">
                        You haven't donated to any campaigns yet. Explore campaigns to support!
                      </CardDescription>
                      <Button asChild className="bg-gradient-to-r from-teal-500 to-cyan-600">
                        <a href="/campaigns">Explore Campaigns</a>
                      </Button>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </section>
        <Toaster position="bottom-right" />
      </main>
      <Footer />
    </div>
  )
}
