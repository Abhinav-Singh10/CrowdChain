export type Tier = {
  name: string,
  amount: number
}

export type FundReleaseData = {
  amount: number;
  description: string;
};

export type Campaign = {
  address: string
  owner: string
  title: string
  description: string
  imageUrl: string
  goalAmount: number // Gwei
  totalAmountRaised: number // Wei
  fundingGranted: number // Wei
  status: "Active" | "Ended" | "Cancelled"
  voteStatus: "Active" | "Approved" | "Rejected" | "NoVotes" | "Eligible"
  totalDonors: number // Wei
  tiers: {
    name: string,
    amount: number
  }[],
  startDate: number // Unix timestamp
  endDate: number // Unix timestamp
  AllDonors: string[]
  votes?: {
    amount: number
    description: string
    endTime: number
    yesWeight: number
    noWeight: number
    status: string
  }[]
}
export type CampaignDetails = {
  address: string
  goalAmount: number // Gwei
  owner: string
  title: string
  status: "Active" | "Ended" | "Cancelled"
  voteEligible: boolean
  voteStatus: "Active" | "Approved" | "Rejected" | "NoVotes" | "Eligible"
}

// Mock user for testing
export const mockUser = "0xUser1234567890abcdef"

// Sample campaign data

// Helper functions for working with mock data
export const weiToEth = (wei: number): number => {
  return wei / 1e18
}

export const gweiToEth = (gwei: number): number => {
  return gwei / 1e9
}

export const formatAddress = (address: string): string => {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

