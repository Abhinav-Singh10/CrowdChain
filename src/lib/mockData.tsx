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
  totalDonors: number
  tiers: { name: string; amount: number }[]
  startDate: number // Unix timestamp
  endDate: number // Unix timestamp
  donations: { [user: string]: number } // Wei
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
export const mockCampaigns: Campaign[] = [
  {
    address: "0x123456789abcdef123456789abcdef123456789a",
    owner: "0xOwner123456789abcdef123456789abcdef12345",
    title: "Save Dogs Shelter",
    description:
      "Help us build a new shelter for abandoned dogs in our community. Your contribution will provide food, medical care, and shelter for dozens of dogs in need. We aim to create a sustainable facility that can house up to 50 dogs at a time, with proper veterinary facilities and adoption programs.",
    imageUrl: "https://img.freepik.com/free-photo/many-cute-rescue-dogs-shelter-waiting-be-adopted_23-2148682949.jpg",
    goalAmount: 2000000000, // 2 ETH in Gwei
    totalAmountRaised: 1500000000000000000, // 1.5 ETH in Wei
    fundingGranted: 500000000000000000, // 0.5 ETH in Wei
    status: "Active",
    voteStatus: "Eligible",
    totalDonors: 2,
    tiers: [
      { name: "Supporter", amount: 500000000000000000 }, // 0.5 ETH in Wei
      { name: "Patron", amount: 1000000000000000000 }, // 1 ETH in Wei
    ],
    startDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    endDate: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days from now
    donations: {
      "0xDonor1": 1000000000000000000, // 1 ETH
      "0xDonor2": 500000000000000000, // 0.5 ETH
    },
  },
  {
    address: "0x456789abcdef123456789abcdef123456789abcd",
    owner: "0xOwner456789abcdef123456789abcdef1234567",
    title: "Plant 10,000 Trees",
    description:
      "Join our initiative to plant 10,000 trees across urban areas to combat climate change and improve air quality. Each tree planted will absorb approximately 48 pounds of CO2 per year and provide habitat for local wildlife. We'll work with local communities to ensure proper care and maintenance.",
    imageUrl: " https://mvnu.edu/content/uploads/2023/04/ArborDay23.jpg",
    goalAmount: 1000000000, // 1 ETH in Gwei
    totalAmountRaised: 500000000000000000, // 0.5 ETH in Wei
    fundingGranted: 0, // 0 ETH in Wei
    status: "Cancelled",
    voteStatus: "NoVotes",
    totalDonors: 1,
    tiers: [
      { name: "Seed", amount: 100000000000000000 }, // 0.1 ETH in Wei
      { name: "Sapling", amount: 300000000000000000 }, // 0.3 ETH in Wei
      { name: "Forest", amount: 500000000000000000 }, // 0.5 ETH in Wei
    ],
    startDate: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
    endDate: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago (ended)
    donations: {
      "0xDonor3": 500000000000000000, // 0.5 ETH
    },
  },
  {
    address: "0x789abcdef123456789abcdef123456789abcdef1",
    owner: "0xOwner789abcdef123456789abcdef123456789a",
    title: "Community Bridge Reconstruction",
    description:
      "Our community bridge was damaged in the recent floods. We need to rebuild it to reconnect our neighborhood and ensure safe passage for residents. The new bridge will be built with sustainable materials and designed to withstand future flooding events. Your support will help restore vital infrastructure for our community.",
    imageUrl: "https://www.uhpcsolutions.com/hubfs/DJI_0130-1.jpg",
    goalAmount: 1000000000, // 1 ETH in Gwei
    totalAmountRaised: 800000000000000000, // 0.8 ETH in Wei
    fundingGranted: 0, // 0 ETH in Wei
    status: "Active",
    voteStatus: "Active",
    totalDonors: 2,
    tiers: [
      { name: "Contributor", amount: 200000000000000000 }, // 0.2 ETH in Wei
      { name: "Builder", amount: 400000000000000000 }, // 0.4 ETH in Wei
      { name: "Architect", amount: 600000000000000000 }, // 0.6 ETH in Wei
    ],
    startDate: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    endDate: Date.now() + 20 * 24 * 60 * 60 * 1000, // 20 days from now
    donations: {
      "0xDonor4": 500000000000000000, // 0.5 ETH
      "0xDonor5": 300000000000000000, // 0.3 ETH
    },
    votes: [
      {
        amount: 500000000000000000, // 0.5 ETH in Wei
        description: "Release funds for initial bridge design and materials",
        endTime: Date.now() + 5 * 60 * 1000, // 5 minutes from now
        yesWeight: 300000000000000000, // 0.3 ETH in Wei
        noWeight: 200000000000000000, // 0.2 ETH in Wei
        status: "Active",
      },
    ],
  },
  {
    address: "0xabcdef123456789abcdef123456789abcdef1234",
    owner: mockUser, // This campaign is owned by the mock user
    title: "Tech Education for Underserved Communities",
    description:
      "Help us provide coding education and computer equipment to underserved communities. We aim to bridge the digital divide by offering free programming courses, mentorship, and laptops to students who otherwise wouldn't have access to tech education. Your contribution will directly impact the future of these students.",
    imageUrl: "https://theinscribermag.com/wp-content/uploads/2024/04/stempowered-banner-upscale-1.jpg",
    goalAmount: 3000000000, // 3 ETH in Gwei
    totalAmountRaised: 2000000000000000000, // 2 ETH in Wei
    fundingGranted: 1000000000000000000, // 1 ETH in Wei
    status: "Active",
    voteStatus: "Approved",
    totalDonors: 3,
    tiers: [
      { name: "Mentor", amount: 300000000000000000 }, // 0.3 ETH in Wei
      { name: "Teacher", amount: 700000000000000000 }, // 0.7 ETH in Wei
      { name: "Benefactor", amount: 1000000000000000000 }, // 1 ETH in Wei
    ],
    startDate: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    endDate: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days from now
    donations: {
      "0xDonor6": 1000000000000000000, // 1 ETH
      "0xDonor7": 700000000000000000, // 0.7 ETH
      mockUser: 300000000000000000, // 0.3 ETH - the mock user has donated to their own campaign
    },
    votes: [
      {
        amount: 1000000000000000000, // 1 ETH in Wei
        description: "Release funds for purchasing laptops and educational materials",
        endTime: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        yesWeight: 1800000000000000000, // 1.8 ETH in Wei
        noWeight: 200000000000000000, // 0.2 ETH in Wei
        status: "Approved",
      },
    ],
  },
  {
    address: "0xdef123456789abcdef123456789abcdef12345678",
    owner: "0xOwnerdef123456789abcdef123456789abcdef",
    title: "Sustainable Urban Farm",
    description:
      "Support our initiative to create a sustainable urban farm that will provide fresh produce to local food banks and create green jobs. The farm will use vertical farming techniques to maximize space efficiency and minimize water usage. We'll also offer educational programs about sustainable agriculture and nutrition.",
    imageUrl: "https://res.cloudinary.com/di6vi1xlx/image/upload/v1723575598/website-2024/blog/posts/urban-solidarity-farms-supporting-food-banks-through-urban-agriculture/MicroHabitat_18_York_120_Bremner-8994_gxwgje.jpg",
    goalAmount: 2500000000, // 2.5 ETH in Gwei
    totalAmountRaised: 100000000000000000, // 0.1 ETH in Wei
    fundingGranted: 0, // 0 ETH in Wei
    status: "Active",
    voteStatus: "NoVotes",
    totalDonors: 1,
    tiers: [
      { name: "Gardener", amount: 100000000000000000 }, // 0.1 ETH in Wei
      { name: "Farmer", amount: 500000000000000000 }, // 0.5 ETH in Wei
      { name: "Harvester", amount: 1000000000000000000 }, // 1 ETH in Wei
    ],
    startDate: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    endDate: Date.now() + 88 * 24 * 60 * 60 * 1000, // 88 days from now
    donations: {
      mockUser: 100000000000000000, // 0.1 ETH - the mock user has donated to this campaign
    },
  },
]

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

// Function to get a campaign by address
export const getCampaignByAddress = (address: string): Campaign | undefined => {
  return mockCampaigns.find((campaign) => campaign.address === address)
}

// Function to get campaigns by owner
export const getCampaignsByOwner = (owner: string): Campaign[] => {
  return mockCampaigns.filter((campaign) => campaign.owner === owner)
}

// Function to get campaigns by donor
export const getCampaignsByDonor = (donor: string): Campaign[] => {
  return mockCampaigns.filter((campaign) => campaign.donations[donor] !== undefined)
}
