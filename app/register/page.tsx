"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Leaf } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { ProjectRegistrationForm } from "@/components/project-registration-form"

export default function RegisterProjectPage() {
  const router = useRouter()
  const { wallet } = useWallet()

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
                <Leaf className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Register Project</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">Wallet Required</CardTitle>
              <CardDescription>Please connect your wallet to register a blue carbon project</CardDescription>
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Register Blue Carbon Project</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Project Registration</h2>
            <p className="text-muted-foreground">
              Submit your blue carbon project for verification and credit issuance
            </p>
          </div>

          <ProjectRegistrationForm />
        </div>
      </main>
    </div>
  )
}
