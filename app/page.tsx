"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Leaf, Shield, ShoppingCart, BarChart3 } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

export default function HomePage() {
  const router = useRouter()
  const { wallet, connectWallet, isLoading } = useWallet()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">BlueMRV</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/projects")}
                className="text-muted-foreground hover:text-foreground"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Explore Projects
              </Button>
              {wallet.isConnected ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Connected: {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                  </Badge>
                  <div className="text-sm text-muted-foreground">Balance: {wallet.balance} CARBON</div>
                </div>
              ) : (
                <Button onClick={connectWallet} disabled={isLoading} className="bg-primary hover:bg-primary/90">
                  <Wallet className="mr-2 h-4 w-4" />
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Blockchain-Powered Blue Carbon Credits
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Register, verify, and trade blue carbon credits with transparency and trust through blockchain technology
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Leaf className="h-5 w-5 text-primary" />
                Project Owner
              </CardTitle>
              <CardDescription>Register and manage your blue carbon projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Upload project evidence to IPFS</li>
                <li>• Register projects on blockchain</li>
                <li>• Track verification status</li>
                <li>• Receive carbon credits</li>
              </ul>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!wallet.isConnected}
                onClick={() => router.push("/register")}
              >
                Register Project
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5 text-accent" />
                Verifier
              </CardTitle>
              <CardDescription>Verify and approve carbon credit projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Review project submissions</li>
                <li>• Validate environmental impact</li>
                <li>• Approve credit issuance</li>
                <li>• Maintain verification records</li>
              </ul>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                disabled={!wallet.isConnected}
                onClick={() => router.push("/verify")}
              >
                Verifier Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <ShoppingCart className="h-5 w-5 text-secondary" />
                Buyer
              </CardTitle>
              <CardDescription>Purchase and retire carbon credits</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Browse verified projects</li>
                <li>• Purchase carbon credits</li>
                <li>• Retire credits for offsetting</li>
                <li>• Track retirement certificates</li>
              </ul>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                disabled={!wallet.isConnected}
                onClick={() => router.push("/buy")}
              >
                Browse Credits
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="h-5 w-5 text-primary" />
              Platform Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5</div>
                <div className="text-sm text-muted-foreground">Projects Registered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">10,700</div>
                <div className="text-sm text-muted-foreground">Credits Issued</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">1,100</div>
                <div className="text-sm text-muted-foreground">Credits Retired</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">845</div>
                <div className="text-sm text-muted-foreground">Total Area (hectares)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
