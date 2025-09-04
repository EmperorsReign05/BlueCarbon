"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, ShoppingCart, Coins, Recycle, Award, TrendingUp, Leaf, ExternalLink } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"

interface AvailableCredit {
  id: string
  projectName: string
  projectOwner: string
  projectType: string
  location: string
  pricePerCredit: number
  availableCredits: number
  totalCredits: number
  verificationDate: string
  projectId: string
}

interface RetirementRecord {
  id: string
  amount: number
  retirementDate: string
  retirementReason: string
  certificateId: string
  projectName: string
  transactionHash: string
}

interface TokenTransaction {
  id: string
  type: "purchase" | "retirement" | "transfer"
  amount: number
  date: string
  projectName?: string
  transactionHash: string
  status: "completed" | "pending" | "failed"
}

export default function BuyerDashboard() {
  const router = useRouter()
  const { wallet } = useWallet()
  const { toast } = useToast()
  const [availableCredits, setAvailableCredits] = useState<AvailableCredit[]>([])
  const [retirements, setRetirements] = useState<RetirementRecord[]>([])
  const [transactions, setTransactions] = useState<TokenTransaction[]>([])
  const [userBalance, setUserBalance] = useState(1250) // Mock balance
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCredit, setSelectedCredit] = useState<AvailableCredit | null>(null)
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [retireAmount, setRetireAmount] = useState("")
  const [retireReason, setRetireReason] = useState("")
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isRetiring, setIsRetiring] = useState(false)

  // Mock data - in real app, this would come from blockchain/API
  useEffect(() => {
    const mockCredits: AvailableCredit[] = [
      {
        id: "credit_001",
        projectName: "Mangrove Restoration Initiative",
        projectOwner: "0x1234...5678",
        projectType: "mangrove",
        location: "Florida Keys, USA",
        pricePerCredit: 25,
        availableCredits: 1500,
        totalCredits: 2500,
        verificationDate: "2024-01-20",
        projectId: "proj_001",
      },
      {
        id: "credit_002",
        projectName: "Salt Marsh Protection",
        projectOwner: "0x5555...7777",
        projectType: "saltmarsh",
        location: "San Francisco Bay, USA",
        pricePerCredit: 30,
        availableCredits: 2200,
        totalCredits: 3000,
        verificationDate: "2024-01-18",
        projectId: "proj_003",
      },
    ]

    const mockRetirements: RetirementRecord[] = [
      {
        id: "ret_001",
        amount: 100,
        retirementDate: "2024-01-25",
        retirementReason: "Corporate carbon neutrality program",
        certificateId: "CERT-2024-001",
        projectName: "Seagrass Conservation Project",
        transactionHash: "0xabc123...",
      },
    ]

    const mockTransactions: TokenTransaction[] = [
      {
        id: "tx_001",
        type: "purchase",
        amount: 500,
        date: "2024-01-24",
        projectName: "Mangrove Restoration Initiative",
        transactionHash: "0xdef456...",
        status: "completed",
      },
      {
        id: "tx_002",
        type: "retirement",
        amount: 100,
        date: "2024-01-25",
        projectName: "Seagrass Conservation Project",
        transactionHash: "0xabc123...",
        status: "completed",
      },
    ]

    setTimeout(() => {
      setAvailableCredits(mockCredits)
      setRetirements(mockRetirements)
      setTransactions(mockTransactions)
      setIsLoading(false)
    }, 1000)
  }, [])

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/")} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-secondary" />
                <h1 className="text-xl font-bold text-foreground">Buyer Dashboard</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">Wallet Required</CardTitle>
              <CardDescription>Please connect your wallet to access the buyer dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/")} className="w-full bg-primary hover:bg-primary/90">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const handlePurchaseCredits = async () => {
    if (!selectedCredit || !purchaseAmount) return

    setIsPurchasing(true)
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const amount = Number.parseInt(purchaseAmount)
      const totalCost = amount * selectedCredit.pricePerCredit

      // Update user balance and available credits
      setUserBalance((prev) => prev + amount)
      setAvailableCredits((prev) =>
        prev.map((credit) =>
          credit.id === selectedCredit.id ? { ...credit, availableCredits: credit.availableCredits - amount } : credit,
        ),
      )

      // Add transaction record
      const newTransaction: TokenTransaction = {
        id: `tx_${Date.now()}`,
        type: "purchase",
        amount,
        date: new Date().toISOString().split("T")[0],
        projectName: selectedCredit.projectName,
        transactionHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
        status: "completed",
      }
      setTransactions((prev) => [newTransaction, ...prev])

      toast({
        title: "Purchase Successful",
        description: `Purchased ${amount} CARBON credits for $${totalCost}`,
      })

      setPurchaseAmount("")
      setSelectedCredit(null)
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleRetireCredits = async () => {
    if (!retireAmount || !retireReason) return

    setIsRetiring(true)
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const amount = Number.parseInt(retireAmount)

      // Update user balance
      setUserBalance((prev) => prev - amount)

      // Add retirement record
      const newRetirement: RetirementRecord = {
        id: `ret_${Date.now()}`,
        amount,
        retirementDate: new Date().toISOString().split("T")[0],
        retirementReason: retireReason,
        certificateId: `CERT-${new Date().getFullYear()}-${String(retirements.length + 1).padStart(3, "0")}`,
        projectName: "Mixed Portfolio",
        transactionHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
      }
      setRetirements((prev) => [newRetirement, ...prev])

      // Add transaction record
      const newTransaction: TokenTransaction = {
        id: `tx_${Date.now()}`,
        type: "retirement",
        amount,
        date: new Date().toISOString().split("T")[0],
        transactionHash: newRetirement.transactionHash,
        status: "completed",
      }
      setTransactions((prev) => [newTransaction, ...prev])

      toast({
        title: "Credits Retired Successfully",
        description: `Retired ${amount} CARBON credits. Certificate: ${newRetirement.certificateId}`,
      })

      setRetireAmount("")
      setRetireReason("")
    } catch (error) {
      toast({
        title: "Retirement Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsRetiring(false)
    }
  }

  const CreditCard = ({ credit }: { credit: AvailableCredit }) => (
    <Card className="border-border hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-foreground">{credit.projectName}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Leaf className="h-3 w-3" />
              {credit.location}
            </CardDescription>
          </div>
          <Badge className="bg-primary/10 text-primary">${credit.pricePerCredit}/credit</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span>
              <p className="font-medium capitalize">{credit.projectType}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Available:</span>
              <p className="font-medium">{credit.availableCredits.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Issued:</span>
              <p className="font-medium">{credit.totalCredits.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Verified:</span>
              <p className="font-medium">{new Date(credit.verificationDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <span className="text-muted-foreground text-sm">Project Owner:</span>
            <p className="font-mono text-sm">{credit.projectOwner}</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setSelectedCredit(credit)}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Purchase Credits
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Purchase Carbon Credits</DialogTitle>
                <DialogDescription>Buy credits from {credit.projectName}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Price per credit:</span>
                    <p className="font-bold text-primary">${credit.pricePerCredit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available:</span>
                    <p className="font-bold">{credit.availableCredits.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount to Purchase</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    placeholder="Enter number of credits"
                    max={credit.availableCredits}
                  />
                </div>

                {purchaseAmount && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Total Cost:</span>
                      <span className="font-bold text-lg">
                        ${(Number.parseInt(purchaseAmount) * credit.pricePerCredit).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setPurchaseAmount("")
                      setSelectedCredit(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handlePurchaseCredits}
                    disabled={!purchaseAmount || isPurchasing}
                  >
                    {isPurchasing ? "Processing..." : "Purchase"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-secondary" />
              <h1 className="text-xl font-bold text-foreground">Buyer Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Carbon Credit Management</h2>
          <p className="text-muted-foreground">Purchase and retire blue carbon credits for your sustainability goals</p>
        </div>

        {/* Balance and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Your Balance</p>
                  <p className="text-2xl font-bold text-primary">{userBalance.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">CARBON tokens</p>
                </div>
                <Coins className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Retired</p>
                  <p className="text-2xl font-bold text-green-600">
                    {retirements.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">CARBON tokens</p>
                </div>
                <Recycle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certificates</p>
                  <p className="text-2xl font-bold text-accent">{retirements.length}</p>
                  <p className="text-xs text-muted-foreground">Retirement certificates</p>
                </div>
                <Award className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                  <p className="text-2xl font-bold text-foreground">${(userBalance * 27).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Estimated USD</p>
                </div>
                <TrendingUp className="h-8 w-8 text-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="retire">Retire Credits</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          {/* Marketplace */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Available Carbon Credits</h3>
              <Badge variant="secondary">{availableCredits.length} projects available</Badge>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCredits.map((credit) => (
                  <CreditCard key={credit.id} credit={credit} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Portfolio */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Transaction History</h3>
              <Badge variant="secondary">{transactions.length} transactions</Badge>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-muted">
                          {tx.type === "purchase" && <ShoppingCart className="h-4 w-4 text-primary" />}
                          {tx.type === "retirement" && <Recycle className="h-4 w-4 text-green-600" />}
                          {tx.type === "transfer" && <TrendingUp className="h-4 w-4 text-accent" />}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{tx.type}</p>
                          <p className="text-sm text-muted-foreground">{tx.projectName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {tx.type === "retirement" ? "-" : "+"}
                          {tx.amount.toLocaleString()} CARBON
                        </p>
                        <p className="text-sm text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="p-2">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retire Credits */}
          <TabsContent value="retire" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Retire Carbon Credits</h3>
              <p className="text-muted-foreground">
                Permanently retire credits to offset your carbon footprint and receive a certificate
              </p>
            </div>

            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="h-5 w-5 text-green-600" />
                  Retirement Form
                </CardTitle>
                <CardDescription>Retire credits for permanent carbon offsetting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Available Balance:</span>
                    <span className="font-bold text-lg">{userBalance.toLocaleString()} CARBON</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retireAmount">Amount to Retire</Label>
                  <Input
                    id="retireAmount"
                    type="number"
                    value={retireAmount}
                    onChange={(e) => setRetireAmount(e.target.value)}
                    placeholder="Enter number of credits to retire"
                    max={userBalance}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retireReason">Retirement Reason</Label>
                  <Input
                    id="retireReason"
                    value={retireReason}
                    onChange={(e) => setRetireReason(e.target.value)}
                    placeholder="e.g., Corporate carbon neutrality program"
                  />
                </div>

                <Button
                  onClick={handleRetireCredits}
                  disabled={!retireAmount || !retireReason || isRetiring}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isRetiring ? "Processing Retirement..." : "Retire Credits"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Retirement Certificates</h3>
              <Badge variant="secondary">{retirements.length} certificates</Badge>
            </div>

            {retirements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {retirements.map((retirement) => (
                  <Card key={retirement.id} className="border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Award className="h-5 w-5 text-accent" />
                            {retirement.certificateId}
                          </CardTitle>
                          <CardDescription>{retirement.projectName}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Retired</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <p className="font-medium">{retirement.amount.toLocaleString()} CARBON</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <p className="font-medium">{new Date(retirement.retirementDate).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-muted-foreground text-sm">Reason:</span>
                          <p className="text-sm">{retirement.retirementReason}</p>
                        </div>

                        <div>
                          <span className="text-muted-foreground text-sm">Transaction:</span>
                          <p className="font-mono text-sm">{retirement.transactionHash}</p>
                        </div>

                        <Button variant="outline" className="w-full bg-transparent">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Certificate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Certificates Yet</h3>
                  <p className="text-muted-foreground">Retire some credits to receive your first certificate</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
