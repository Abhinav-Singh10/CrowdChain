"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Loader2 } from "lucide-react"
import { mockCampaigns, type CampaignDetails } from "@/lib/mockData" // Clean Mock data
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CampaignCard } from "@/components/ui/campaign-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NetworkEffect } from "@/components/network-effect"
import { getContract } from "thirdweb"
import { client } from "../client"
import { sepolia } from "thirdweb/chains"
import { CROWDFUDNING_FACTORY } from "@/constants/contracts"

import { useReadContract } from "thirdweb/react";

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


export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignDetails[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignDetails[]>([])
  const [displayedCampaigns, setDisplayedCampaigns] = useState<CampaignDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [voteStatusFilter, setVoteStatusFilter] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [page, setPage] = useState(1)
  const campaignsPerPage = 6

  // Calling real data from the deployed contracts
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: CROWDFUDNING_FACTORY
  })

  // Importing campaign Addresses currently on the blockchain from the Factory
  const { data: CamapignAddresses, isPending } = useReadContract({
    contract,
    method:
      "function getCampaigns() view returns (address[])",
    params: [],
  });

  // List of all Camapigns for filtering and sorting
  const { data: AllCampaigns, isPending: isLoadingAllCampaigns } = useReadContract({
    contract,
    method:
      "function getAllCampaigns() view returns ((address campaignAddress, address owner, string title, uint256 goalAmount, uint256 totalAmountRaised, uint8 status, uint8 voteStatus, bool voteEligible)[])",
    params: [],
  });

  //See if this is needed
  const { data: TotalCampaignCount, isPending: isLoadingTotalCampaigns } = useReadContract({
    contract,
    method:
      "function totalCampaigns() view returns (uint256)",
    params: [],
  });

  console.log(TotalCampaignCount, AllCampaigns);


  // Simulate loading data
  useEffect(() => {
    if (isLoadingAllCampaigns) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      if (AllCampaigns) {
        // setCampaigns(AllCampaigns);
        const formattedCampaigns: CampaignDetails[] = AllCampaigns.map(c => ({
          address: c.campaignAddress,
          owner: c.owner,
          title: c.title,
          goalAmount: Number(c.goalAmount) / 1e9, // Convert Gwei (BigInt) to ETH (number)
          status: statusMap[c.status] || 'Active', //Defaulting to Active
          voteEligible: c.voteEligible,
          voteStatus: voteStatusMap[c.voteStatus] || 'NoVotes', //Defualting to NoVotes

        }))
        setCampaigns(formattedCampaigns);
      }
    }
    setIsLoading(false)


  }, [AllCampaigns, isLoadingAllCampaigns])

  console.log(campaigns);


  // Apply filters and search
  useEffect(() => {
    if (campaigns.length === 0) return

    let filtered = [...campaigns]

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((campaign) => campaign.status === statusFilter)
    }

    // Apply vote status filter
    if (voteStatusFilter !== "All") {
      filtered = filtered.filter((campaign) => campaign.voteStatus === voteStatusFilter)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "raised":
        filtered.sort((a, b) => b.totalAmountRaised - a.totalAmountRaised)
        break
      case "donors":
        filtered.sort((a, b) => b.totalDonors - a.totalDonors)
        break
      case "newest":
      default:
        filtered.sort((a, b) => b.startDate - a.startDate)
        break
    }

    setFilteredCampaigns(filtered)
    setPage(1) // Reset to first page when filters change
  }, [campaigns, statusFilter, voteStatusFilter, searchQuery, sortBy])

  // Paginate results
  useEffect(() => {
    const startIndex = (page - 1) * campaignsPerPage
    const endIndex = startIndex + campaignsPerPage
    setDisplayedCampaigns(filteredCampaigns.slice(0, endIndex))
  }, [filteredCampaigns, page])

  // Handle search with debounce
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Load more campaigns
  const loadMore = () => {
    setPage((prev) => prev + 1)
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
              className="mb-12 text-center"
            >
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">Explore Campaigns</h1>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Discover innovative projects seeking funding and support the ones that inspire you.
              </p>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 grid gap-4 md:grid-cols-4"
            >
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search campaigns..."
                  className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-slate-700 bg-slate-800/50 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-800">
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Ended">Ended</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={voteStatusFilter} onValueChange={setVoteStatusFilter}>
                <SelectTrigger className="border-slate-700 bg-slate-800/50 text-white">
                  <SelectValue placeholder="Vote Status" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-800">
                  <SelectItem value="All">All Vote Statuses</SelectItem>
                  <SelectItem value="Eligible">Eligible</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="NoVotes">No Votes</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Sort options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-400">Sort by:</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={sortBy === "newest" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("newest")}
                  className={
                    sortBy === "newest"
                      ? "bg-teal-600 hover:bg-teal-700"
                      : "border-slate-700 bg-slate-800/50 hover:bg-slate-700"
                  }
                >
                  Newest
                </Button>
                <Button
                  variant={sortBy === "raised" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("raised")}
                  className={
                    sortBy === "raised"
                      ? "bg-teal-600 hover:bg-teal-700"
                      : "border-slate-700 bg-slate-800/50 hover:bg-slate-700"
                  }
                >
                  Most Raised
                </Button>
                <Button
                  variant={sortBy === "donors" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("donors")}
                  className={
                    sortBy === "donors"
                      ? "bg-teal-600 hover:bg-teal-700"
                      : "border-slate-700 bg-slate-800/50 hover:bg-slate-700"
                  }
                >
                  Most Donors
                </Button>
              </div>
            </motion.div>

            {/* Campaign grid */}
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-teal-500" />
              </div>
            ) : displayedCampaigns.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayedCampaigns.map((campaign, index) => (
                    <CampaignCard key={campaign.address} campaign={campaign} index={index} />
                  ))}
                </div>

                {/* Load more button */}
                {displayedCampaigns.length < filteredCampaigns.length && (
                  <div className="mt-12 text-center">
                    <Button
                      onClick={loadMore}
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 px-8 hover:shadow-lg hover:shadow-teal-500/20"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center"
              >
                <h3 className="mb-2 text-xl font-bold">No campaigns found</h3>
                <p className="mb-6 text-slate-400">
                  {searchQuery || statusFilter !== "All" || voteStatusFilter !== "All"
                    ? "Try adjusting your filters or search query"
                    : "No campaigns have been created yet"}
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:shadow-lg hover:shadow-teal-500/20"
                >
                  <a href="/create">Create a Campaign</a>
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
