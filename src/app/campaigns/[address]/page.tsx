"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { toast, Toaster } from "react-hot-toast"
import { format } from "date-fns"
import { AlertTriangle, Check, Copy, Twitter } from "lucide-react"
import { mockUser, getCampaignByAddress, weiToEth, gweiToEth, formatAddress } from "@/lib/mockData"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { NetworkEffect } from "@/components/network-effect"
import { Skeleton } from "@/components/ui/skeleton"
import { VoteTimer } from "@/components/ui/vote-timer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CampaignDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [voteChoice, setVoteChoice] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [showVoteConfirm, setShowVoteConfirm] = useState(false)
  const [showDonateConfirm, setShowDonateConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // Simulate loading campaign data
  useEffect(() => {
    const timer = setTimeout(() => {
      const campaignData = getCampaignByAddress(params.address as string)
      if (campaignData) {
        setCampaign(campaignData)
      }
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.address])

  // Check if user has already voted
  useEffect(() => {
    if (campaign?.votes?.[0]?.status === "Active") {
      // In a real app, we would check if the user has voted
      // For now, just set a random value
      setHasVoted(Math.random() > 0.5)
    }
  }, [campaign])

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!campaign) return 0
    const goalInWei = campaign.goalAmount * 1e9 // Convert Gwei to Wei
    return Math.min(Math.round((campaign.totalAmountRaised / goalInWei) * 100), 100)
  }

  // Handle donation
  const handleDonate = () => {
    if (!selectedTier) {
      toast.error("Please select a donation tier")
      return
    }

    setShowDonateConfirm(true)
  }

  // Confirm donation
  const confirmDonate = () => {
    const tierAmount = campaign.tiers[selectedTier].amount

    // Update local state (in a real app, this would be a blockchain transaction)
    const updatedCampaign = { ...campaign }

    // Add donation to user's donations
    if (!updatedCampaign.donations[mockUser]) {
      updatedCampaign.donations[mockUser] = 0
    }
    updatedCampaign.donations[mockUser] += tierAmount

    // Update total amount raised
    updatedCampaign.totalAmountRaised += tierAmount

    // Update total donors if this is a new donor
    if (updatedCampaign.donations[mockUser] === tierAmount) {
      updatedCampaign.totalDonors += 1
    }

    setCampaign(updatedCampaign)
    setShowDonateConfirm(false)
    setSelectedTier(null)

    toast.success(`Donated ${weiToEth(tierAmount)} ETH successfully!`)
  }

  // Handle vote
  const handleVote = (choice: string) => {
    setVoteChoice(choice)
    setShowVoteConfirm(true)
  }

  // Confirm vote
  const confirmVote = () => {
    // Update local state (in a real app, this would be a blockchain transaction)
    const updatedCampaign = { ...campaign }
    const vote = updatedCampaign.votes[0]

    // Add vote weight based on user's donation
    const userDonation = updatedCampaign.donations[mockUser] || 0

    if (voteChoice === "yes") {
      vote.yesWeight += userDonation
    } else {
      vote.noWeight += userDonation
    }

    setCampaign(updatedCampaign)
    setShowVoteConfirm(false)
    setVoteChoice(null)
    setHasVoted(true)

    toast.success(`Vote cast successfully!`)
  }

  // Handle start vote (for campaign owner)
  const handleStartVote = () => {
    // In a real app, this would open a form to set vote parameters
    // For now, just create a mock vote
    const updatedCampaign = { ...campaign }

    updatedCampaign.voteStatus = "Active"
    updatedCampaign.votes = [
      {
        amount: updatedCampaign.totalAmountRaised * 0.3, // 30% of raised funds
        description: "Release funds for project development",
        endTime: Date.now() + 30 * 60 * 1000, // 30 minutes from now
        yesWeight: 0,
        noWeight: 0,
        status: "Active",
      },
    ]

    setCampaign(updatedCampaign)
    toast.success("Vote started successfully!")
  }

  // Handle cancel campaign (for campaign owner)
  const handleCancelCampaign = () => {
    setShowCancelConfirm(true)
  }

  // Confirm cancel campaign
  const confirmCancelCampaign = () => {
    const updatedCampaign = { ...campaign }
    updatedCampaign.status = "Cancelled"
    updatedCampaign.voteStatus = "NoVotes"

    setCampaign(updatedCampaign)
    setShowCancelConfirm(false)
    toast.success("Campaign cancelled successfully!")
  }

  // Share campaign
  const handleShare = (platform: string) => {
    const campaignUrl = `${window.location.origin}/campaigns/${campaign.address}`
    const shareText = `Support ${campaign.title} on CrowdChain! ${campaignUrl} #Crowdfunding #Web3`

    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")
    } else if (platform === "copy") {
      navigator.clipboard.writeText(campaignUrl)
      toast.success("Link copied to clipboard!")
    }
  }

  // Check if user is campaign owner
  const isOwner = campaign?.owner === mockUser

  // Check if user has donated
  const userDonation = campaign?.donations?.[mockUser] || 0
  const hasDonated = userDonation > 0

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950 text-white">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-20">
            <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl">
              <Skeleton className="h-full w-full" />
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <Skeleton className="mb-4 h-10 w-3/4" />
                <Skeleton className="mb-6 h-4 w-full" />
                <Skeleton className="mb-6 h-4 w-full" />
                <Skeleton className="mb-6 h-4 w-2/3" />

                <Skeleton className="mb-4 h-8 w-full" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>

              <div>
                <Skeleton className="mb-4 h-64 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950 text-white">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
            <AlertTriangle className="mb-4 h-16 w-16 text-amber-500" />
            <h1 className="mb-4 text-3xl font-bold">Campaign Not Found</h1>
            <p className="mb-8 text-slate-400">The campaign you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push("/campaigns")} className="bg-gradient-to-r from-teal-500 to-cyan-600">
              Browse Campaigns
            </Button>
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
        {/* Hero section with campaign image */}
        <div className="relative h-64 w-full overflow-hidden md:h-80 lg:h-96">
          <Image
            src={campaign.imageUrl || "/placeholder.svg"}
            alt={campaign.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold md:text-4xl">{campaign.title}</h1>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${getStatusColor(campaign.status)}`}>{campaign.status}</Badge>
                  <Badge className={`${getVoteStatusColor(campaign.voteStatus)}`}>Vote: {campaign.voteStatus}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign details */}
        <section className="relative py-12">
          <NetworkEffect className="absolute inset-0 opacity-10" />
          <div className="container relative z-10 mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Left column: Campaign info */}
              <div className="md:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="mb-8 border-slate-800 bg-slate-900/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle>Campaign Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <p className="mb-6 text-slate-300">{campaign.description}</p>

                        <div className="mb-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm text-slate-400">Progress</span>
                            <span className="text-sm font-medium">{calculateProgress()}%</span>
                          </div>
                          <Progress value={calculateProgress()} className="h-2 bg-slate-700" />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-lg bg-slate-800/50 p-4">
                            <p className="text-sm text-slate-400">Goal</p>
                            <p className="text-xl font-bold">{gweiToEth(campaign.goalAmount).toFixed(2)} ETH</p>
                          </div>
                          <div className="rounded-lg bg-slate-800/50 p-4">
                            <p className="text-sm text-slate-400">Raised</p>
                            <p className="text-xl font-bold">{weiToEth(campaign.totalAmountRaised).toFixed(2)} ETH</p>
                          </div>
                          <div className="rounded-lg bg-slate-800/50 p-4">
                            <p className="text-sm text-slate-400">Donors</p>
                            <p className="text-xl font-bold">{campaign.totalDonors}</p>
                          </div>
                          <div className="rounded-lg bg-slate-800/50 p-4">
                            <p className="text-sm text-slate-400">Funds Granted</p>
                            <p className="text-xl font-bold">{weiToEth(campaign.fundingGranted).toFixed(2)} ETH</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="mb-2 text-lg font-medium">Campaign Timeline</h3>
                        <div className="flex items-center space-x-2">
                          <div className="rounded bg-slate-800 px-2 py-1 text-xs">
                            {format(new Date(campaign.startDate), "MMM d, yyyy")}
                          </div>
                          <div className="h-0.5 flex-1 bg-gradient-to-r from-teal-500 to-cyan-600" />
                          <div className="rounded bg-slate-800 px-2 py-1 text-xs">
                            {format(new Date(campaign.endDate), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 text-lg font-medium">Campaign Owner</h3>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600" />
                          <span className="ml-2 font-mono text-sm">{formatAddress(campaign.owner)}</span>
                          {isOwner && <Badge className="ml-2 bg-teal-500">You</Badge>}
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
                  <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle>Donation Tiers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {campaign.tiers.map((tier: any, index: number) => (
                          <div
                            key={index}
                            className={`rounded-lg border p-4 transition-all ${
                              selectedTier === index
                                ? "border-teal-500 bg-teal-500/10"
                                : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                            } ${campaign.status !== "Active" ? "opacity-50" : "cursor-pointer"}`}
                            onClick={() => campaign.status === "Active" && setSelectedTier(index)}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{tier.name}</h4>
                              <span className="font-bold">{weiToEth(tier.amount).toFixed(2)} ETH</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right column: Actions */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {/* Donation panel */}
                  {campaign.status === "Active" && (
                    <Card className="mb-6 border-slate-800 bg-slate-900/50 backdrop-blur">
                      <CardHeader>
                        <CardTitle>Support This Campaign</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <p className="mb-2 text-sm text-slate-400">Select a tier above to donate</p>
                          {selectedTier !== null && (
                            <div className="rounded-lg bg-teal-500/10 p-3 text-center">
                              <p className="text-sm text-slate-300">You selected</p>
                              <p className="text-lg font-bold text-teal-400">
                                {campaign.tiers[selectedTier].name} -{" "}
                                {weiToEth(campaign.tiers[selectedTier].amount).toFixed(2)} ETH
                              </p>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={handleDonate}
                          disabled={selectedTier === null}
                          className="w-full bg-gradient-to-r from-teal-500 to-cyan-600"
                        >
                          Donate Now
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Vote panel */}
                  {campaign.voteStatus === "Active" && campaign.votes && campaign.votes.length > 0 && (
                    <Card className="mb-6 border-slate-800 bg-slate-900/50 backdrop-blur">
                      <CardHeader>
                        <CardTitle>Active Vote</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <p className="mb-2 text-sm font-medium">{campaign.votes[0].description}</p>
                          <p className="mb-4 text-sm text-slate-400">
                            Amount: {weiToEth(campaign.votes[0].amount).toFixed(2)} ETH
                          </p>

                          <div className="mb-4">
                            <VoteTimer endTime={campaign.votes[0].endTime} />
                          </div>

                          <div className="mb-4 grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-green-500/10 p-3 text-center">
                              <p className="text-xs text-slate-400">Yes</p>
                              <p className="font-bold text-green-400">
                                {weiToEth(campaign.votes[0].yesWeight).toFixed(2)} ETH
                              </p>
                            </div>
                            <div className="rounded-lg bg-red-500/10 p-3 text-center">
                              <p className="text-xs text-slate-400">No</p>
                              <p className="font-bold text-red-400">
                                {weiToEth(campaign.votes[0].noWeight).toFixed(2)} ETH
                              </p>
                            </div>
                          </div>
                        </div>

                        {hasDonated ? (
                          hasVoted ? (
                            <div className="rounded-lg bg-slate-800 p-3 text-center text-slate-300">
                              <Check className="mx-auto mb-2 h-5 w-5 text-green-500" />
                              You have already voted
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <Button onClick={() => handleVote("yes")} className="bg-green-600 hover:bg-green-700">
                                Vote Yes
                              </Button>
                              <Button onClick={() => handleVote("no")} className="bg-red-600 hover:bg-red-700">
                                Vote No
                              </Button>
                            </div>
                          )
                        ) : (
                          <div className="rounded-lg bg-amber-500/10 p-3 text-center text-amber-400">
                            <AlertTriangle className="mx-auto mb-2 h-5 w-5" />
                            You need to donate to vote
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Vote results panel */}
                  {(campaign.voteStatus === "Approved" || campaign.voteStatus === "Rejected") &&
                    campaign.votes &&
                    campaign.votes.length > 0 && (
                      <Card className="mb-6 border-slate-800 bg-slate-900/50 backdrop-blur">
                        <CardHeader>
                          <CardTitle>Vote Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="mb-2 flex items-center">
                              <Badge className={campaign.voteStatus === "Approved" ? "bg-green-500" : "bg-red-500"}>
                                {campaign.voteStatus}
                              </Badge>
                            </div>

                            <p className="mb-2 text-sm font-medium">{campaign.votes[0].description}</p>
                            <p className="mb-4 text-sm text-slate-400">
                              Amount: {weiToEth(campaign.votes[0].amount).toFixed(2)} ETH
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="rounded-lg bg-green-500/10 p-3 text-center">
                                <p className="text-xs text-slate-400">Yes</p>
                                <p className="font-bold text-green-400">
                                  {weiToEth(campaign.votes[0].yesWeight).toFixed(2)} ETH
                                </p>
                              </div>
                              <div className="rounded-lg bg-red-500/10 p-3 text-center">
                                <p className="text-xs text-slate-400">No</p>
                                <p className="font-bold text-red-400">
                                  {weiToEth(campaign.votes[0].noWeight).toFixed(2)} ETH
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  {/* Owner actions */}
                  {isOwner && (
                    <Card className="mb-6 border-slate-800 bg-slate-900/50 backdrop-blur">
                      <CardHeader>
                        <CardTitle>Owner Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {campaign.status === "Active" && campaign.voteStatus === "Eligible" && (
                          <Button onClick={handleStartVote} className="w-full bg-cyan-600 hover:bg-cyan-700">
                            Start Vote
                          </Button>
                        )}

                        {campaign.status === "Active" && (
                          <Button onClick={handleCancelCampaign} variant="destructive" className="mt-2 w-full">
                            Cancel Campaign
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Share panel */}
                  <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle>Share Campaign</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleShare("twitter")}
                          variant="outline"
                          className="flex items-center justify-center border-slate-700 bg-slate-800/50"
                        >
                          <Twitter className="mr-2 h-4 w-4" />
                          Twitter
                        </Button>
                        <Button
                          onClick={() => handleShare("copy")}
                          variant="outline"
                          className="flex items-center justify-center border-slate-700 bg-slate-800/50"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Donation confirmation modal */}
        <Dialog open={showDonateConfirm} onOpenChange={setShowDonateConfirm}>
          <DialogContent className="border-slate-700 bg-slate-900 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Donation</DialogTitle>
              <DialogDescription className="text-slate-400">
                You are about to donate to this campaign.
              </DialogDescription>
            </DialogHeader>

            {selectedTier !== null && (
              <div className="rounded-lg bg-teal-500/10 p-4 text-center">
                <p className="text-sm text-slate-300">You are donating</p>
                <p className="text-xl font-bold text-teal-400">
                  {weiToEth(campaign.tiers[selectedTier].amount).toFixed(2)} ETH
                </p>
                <p className="mt-2 text-sm text-slate-400">Tier: {campaign.tiers[selectedTier].name}</p>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setShowDonateConfirm(false)}
                className="mb-2 border-slate-700 bg-slate-800 sm:mb-0"
              >
                Cancel
              </Button>
              <Button onClick={confirmDonate} className="bg-gradient-to-r from-teal-500 to-cyan-600">
                Confirm Donation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Vote confirmation modal */}
        <Dialog open={showVoteConfirm} onOpenChange={setShowVoteConfirm}>
          <DialogContent className="border-slate-700 bg-slate-900 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Vote</DialogTitle>
              <DialogDescription className="text-slate-400">You are about to cast your vote.</DialogDescription>
            </DialogHeader>

            <div className={`rounded-lg p-4 text-center ${voteChoice === "yes" ? "bg-green-500/10" : "bg-red-500/10"}`}>
              <p className="text-sm text-slate-300">You are voting</p>
              <p className={`text-xl font-bold ${voteChoice === "yes" ? "text-green-400" : "text-red-400"}`}>
                {voteChoice === "yes" ? "YES" : "NO"}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Your voting power: {weiToEth(campaign.donations[mockUser] || 0).toFixed(2)} ETH
              </p>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setShowVoteConfirm(false)}
                className="mb-2 border-slate-700 bg-slate-800 sm:mb-0"
              >
                Cancel
              </Button>
              <Button onClick={confirmVote} className={voteChoice === "yes" ? "bg-green-600" : "bg-red-600"}>
                Confirm Vote
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel campaign confirmation modal */}
        <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
          <DialogContent className="border-slate-700 bg-slate-900 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cancel Campaign</DialogTitle>
              <DialogDescription className="text-slate-400">
                Are you sure you want to cancel this campaign? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-red-500/10 p-4 text-center">
              <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
              <p className="text-sm text-red-400">
                All future donations will be disabled and the campaign status will be set to Cancelled.
              </p>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
                className="mb-2 border-slate-700 bg-slate-800 sm:mb-0"
              >
                Keep Campaign Active
              </Button>
              <Button onClick={confirmCancelCampaign} variant="destructive">
                Cancel Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster position="bottom-right" />
      </main>
      <Footer />
    </div>
  )
}
