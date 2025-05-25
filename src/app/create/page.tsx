"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast, Toaster } from "react-hot-toast"
import { CheckCircle2, ChevronRight, Trash2, Plus, ImageIcon, Calendar, Coins, Info } from "lucide-react"
import { mockUser } from "@/lib/mockData"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NetworkEffect } from "@/components/network-effect"
import { CampaignCard } from "@/components/ui/campaign-card"
import { useActiveAccount } from "thirdweb/react"
import { ConnectPrompt } from "@/components/connect-prompt"

export default function CreateCampaignPage() {
  const account = useActiveAccount();
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    endDate: "",
    imageUrl: "/placeholder.svg?height=400&width=600",
    tiers: [{ name: "Supporter", amount: "0.1" }],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle tier changes
  const handleTierChange = (index: number, field: string, value: string) => {
    const newTiers = [...formData.tiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    setFormData((prev) => ({ ...prev, tiers: newTiers }))

    // Clear tier errors
    if (errors[`tier-${index}-${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`tier-${index}-${field}`]
        return newErrors
      })
    }
  }

  // Add new tier
  const addTier = () => {
    if (formData.tiers.length >= 10) {
      toast.error("Maximum 10 tiers allowed")
      return
    }

    setFormData((prev) => ({
      ...prev,
      tiers: [...prev.tiers, { name: "", amount: "" }],
    }))
  }

  // Remove tier
  const removeTier = (index: number) => {
    if (formData.tiers.length <= 1) {
      toast.error("At least one tier is required")
      return
    }

    const newTiers = [...formData.tiers]
    newTiers.splice(index, 1)
    setFormData((prev) => ({ ...prev, tiers: newTiers }))
  }

  // Validate form data
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = "Title is required"
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required"
      }

      if (!formData.goalAmount) {
        newErrors.goalAmount = "Goal amount is required"
      } else if (isNaN(Number(formData.goalAmount)) || Number(formData.goalAmount) <= 0) {
        newErrors.goalAmount = "Goal amount must be a positive number"
      }

      if (!formData.endDate) {
        newErrors.endDate = "End date is required"
      } else {
        const endDate = new Date(formData.endDate)
        const now = new Date()
        const oneYearFromNow = new Date()
        oneYearFromNow.setFullYear(now.getFullYear() + 1)

        if (endDate <= now) {
          newErrors.endDate = "End date must be in the future"
        } else if (endDate > oneYearFromNow) {
          newErrors.endDate = "End date cannot be more than 1 year in the future"
        }
      }

      if (!formData.imageUrl.trim()) {
        newErrors.imageUrl = "Image URL is required"
      }
    } else if (step === 2) {
      formData.tiers.forEach((tier, index) => {
        if (!tier.name.trim()) {
          newErrors[`tier-${index}-name`] = "Tier name is required"
        }

        if (!tier.amount) {
          newErrors[`tier-${index}-amount`] = "Amount is required"
        } else if (isNaN(Number(tier.amount)) || Number(tier.amount) <= 0) {
          newErrors[`tier-${index}-amount`] = "Amount must be a positive number"
        } else if (Number(tier.amount) > Number(formData.goalAmount)) {
          newErrors[`tier-${index}-amount`] = "Amount cannot exceed goal amount"
        }
      })

      // Check for duplicate tier names
      const tierNames = formData.tiers.map((tier) => tier.name.trim())
      const uniqueTierNames = new Set(tierNames)
      if (uniqueTierNames.size !== tierNames.length) {
        newErrors.tiers = "Tier names must be unique"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateStep(currentStep)) {
      // In a real app, this would create a blockchain transaction
      // For now, just show a success message and redirect

      toast.success("Campaign created successfully!")

      // Redirect to campaigns page after a delay
      setTimeout(() => {
        router.push("/campaigns")
      }, 2000)
    }
  }

  // Create preview campaign object
  const previewCampaign = {
    address: "0x" + Math.random().toString(16).substring(2, 42),
    owner: mockUser,
    title: formData.title || "Campaign Title",
    description: formData.description || "Campaign description will appear here.",
    imageUrl: formData.imageUrl,
    goalAmount: Number(formData.goalAmount) * 1e9 || 1000000000, // Convert ETH to Gwei
    totalAmountRaised: 0,
    fundingGranted: 0,
    status: "Active",
    voteStatus: "NoVotes",
    totalDonors: 0,
    tiers: formData.tiers.map((tier) => ({
      name: tier.name,
      amount: Number(tier.amount) * 1e18 || 100000000000000000, // Convert ETH to Wei
    })),
    startDate: Date.now(),
    endDate: formData.endDate ? new Date(formData.endDate).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000,
    donations: {},
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
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">Create Campaign</h1>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Launch your crowdfunding campaign and connect with supporters around the world.
              </p>
            </motion.div>

            {/* Progress steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12"
            >
              <div className="mx-auto max-w-3xl">
                <div className="relative mb-6">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-800"></div>
                  <div
                    className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-teal-500 to-cyan-600 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                  ></div>
                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep > 1
                            ? "bg-gradient-to-r from-teal-500 to-cyan-600"
                            : currentStep === 1
                              ? "border-2 border-teal-500 bg-slate-900"
                              : "border border-slate-700 bg-slate-800"
                          }`}
                      >
                        {currentStep > 1 ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">1</span>
                        )}
                      </div>
                      <span className="mt-2 text-sm font-medium">Details</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep > 2
                            ? "bg-gradient-to-r from-teal-500 to-cyan-600"
                            : currentStep === 2
                              ? "border-2 border-teal-500 bg-slate-900"
                              : "border border-slate-700 bg-slate-800"
                          }`}
                      >
                        {currentStep > 2 ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">2</span>
                        )}
                      </div>
                      <span className="mt-2 text-sm font-medium">Tiers</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep === 3
                            ? "border-2 border-teal-500 bg-slate-900"
                            : "border border-slate-700 bg-slate-800"
                          }`}
                      >
                        <span className="text-sm font-medium">3</span>
                      </div>
                      <span className="mt-2 text-sm font-medium">Review</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              {/* Step 1: Campaign Details */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle>Campaign Details</CardTitle>
                      <CardDescription>Provide basic information about your campaign</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                          Campaign Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter a catchy title for your campaign"
                          className="border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500"
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe your campaign and what you're raising funds for"
                          className="min-h-32 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500"
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="goalAmount" className="text-sm font-medium">
                          Goal Amount (ETH) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            id="goalAmount"
                            name="goalAmount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={formData.goalAmount}
                            onChange={handleChange}
                            placeholder="1.0"
                            className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500"
                          />
                          <Coins className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                        {errors.goalAmount && <p className="text-sm text-red-500">{errors.goalAmount}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="endDate" className="text-sm font-medium">
                          End Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500"
                          />
                          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                        {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="imageUrl" className="text-sm font-medium">
                          Campaign Image URL <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500"
                          />
                          <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                        {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}
                        <p className="text-xs text-slate-400">
                          Enter a URL for your campaign image. For testing, you can use the default placeholder.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button onClick={handleNextStep} className="bg-gradient-to-r from-teal-500 to-cyan-600">
                        Next Step
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Donation Tiers */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle>Donation Tiers</CardTitle>
                      <CardDescription>Create donation tiers for your supporters</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {errors.tiers && (
                        <div className="rounded-lg bg-red-500/10 p-3">
                          <p className="text-sm text-red-500">{errors.tiers}</p>
                        </div>
                      )}

                      {formData.tiers.map((tier, index) => (
                        <div key={index} className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-sm font-medium">Tier {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTier(index)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove tier</span>
                            </Button>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <label htmlFor={`tier-${index}-name`} className="text-sm font-medium">
                                Tier Name <span className="text-red-500">*</span>
                              </label>
                              <Input
                                id={`tier-${index}-name`}
                                value={tier.name}
                                onChange={(e) => handleTierChange(index, "name", e.target.value)}
                                placeholder="e.g., Supporter, Patron, etc."
                                className="border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500"
                              />
                              {errors[`tier-${index}-name`] && (
                                <p className="text-sm text-red-500">{errors[`tier-${index}-name`]}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <label htmlFor={`tier-${index}-amount`} className="text-sm font-medium">
                                Amount (ETH) <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <Input
                                  id={`tier-${index}-amount`}
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  value={tier.amount}
                                  onChange={(e) => handleTierChange(index, "amount", e.target.value)}
                                  placeholder="0.1"
                                  className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500"
                                />
                                <Coins className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              </div>
                              {errors[`tier-${index}-amount`] && (
                                <p className="text-sm text-red-500">{errors[`tier-${index}-amount`]}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTier}
                        className="w-full border-dashed border-slate-700 bg-slate-800/30"
                        disabled={formData.tiers.length >= 10}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tier
                      </Button>

                      <div className="rounded-lg bg-slate-800/50 p-3">
                        <div className="flex items-start">
                          <Info className="mr-2 mt-0.5 h-4 w-4 text-slate-400" />
                          <p className="text-xs text-slate-400">
                            Create up to 10 donation tiers. Each tier should have a unique name and amount. Supporters
                            will be able to choose from these tiers when donating to your campaign.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevStep} className="border-slate-700 bg-slate-800/50">
                        Back
                      </Button>
                      <Button onClick={handleNextStep} className="bg-gradient-to-r from-teal-500 to-cyan-600">
                        Next Step
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle>Review Campaign</CardTitle>
                      <CardDescription>Review your campaign details before creating</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="rounded-lg bg-slate-800/50 p-4">
                        <h3 className="mb-2 text-lg font-medium">Campaign Preview</h3>
                        <div className="overflow-hidden rounded-lg border border-slate-700">
                          <CampaignCard campaign={previewCampaign} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Campaign Details</h3>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-lg bg-slate-800/30 p-3">
                            <p className="text-sm text-slate-400">Title</p>
                            <p className="font-medium">{formData.title}</p>
                          </div>

                          <div className="rounded-lg bg-slate-800/30 p-3">
                            <p className="text-sm text-slate-400">Goal Amount</p>
                            <p className="font-medium">{formData.goalAmount} ETH</p>
                          </div>
                        </div>

                        <div className="rounded-lg bg-slate-800/30 p-3">
                          <p className="text-sm text-slate-400">Description</p>
                          <p className="whitespace-pre-wrap">{formData.description}</p>
                        </div>

                        <div className="rounded-lg bg-slate-800/30 p-3">
                          <p className="text-sm text-slate-400">End Date</p>
                          <p className="font-medium">{new Date(formData.endDate).toLocaleDateString()}</p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Donation Tiers</p>
                          <div className="space-y-2">
                            {formData.tiers.map((tier, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-lg bg-slate-800/30 p-3"
                              >
                                <span>{tier.name}</span>
                                <span className="font-medium">{tier.amount} ETH</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg bg-teal-500/10 p-4">
                        <div className="flex items-start">
                          <Info className="mr-2 mt-0.5 h-5 w-5 text-teal-400" />
                          <div>
                            <p className="font-medium text-teal-400">Ready to Launch</p>
                            <p className="text-sm text-slate-300">
                              Your campaign is ready to be created. Once created, it will be visible to all users.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevStep} className="border-slate-700 bg-slate-800/50">
                        Back
                      </Button>
                      <Button onClick={handleSubmit} className="bg-gradient-to-r from-teal-500 to-cyan-600">
                        Create Campaign
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </section>
        <Toaster position="bottom-right" />
      </main>
      <Footer />
    </div>
  )
}
