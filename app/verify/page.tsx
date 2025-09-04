"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Shield, Clock, CheckCircle, XCircle, Eye, FileText, MapPin } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { ProjectReviewModal } from "@/components/project-review-modal"

interface Project {
  id: string
  name: string
  owner: string
  projectType: string
  location: string
  area: number
  estimatedCredits: number
  status: "pending" | "approved" | "rejected"
  submissionDate: string
  metadataCid: string
  evidenceFiles: string[]
  description: string
}

export default function VerifierDashboard() {
  const router = useRouter()
  const { wallet } = useWallet()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real app, this would come from blockchain/API
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: "proj_001",
        name: "Mangrove Restoration Initiative",
        owner: "0x1234...5678",
        projectType: "mangrove",
        location: "Florida Keys, USA",
        area: 150,
        estimatedCredits: 2500,
        status: "pending",
        submissionDate: "2024-01-15",
        metadataCid: "QmX1Y2Z3...",
        evidenceFiles: ["QmA1B2C3...", "QmD4E5F6..."],
        description:
          "Large-scale mangrove restoration project aimed at protecting coastal areas and sequestering carbon through native species replanting.",
      },
      {
        id: "proj_002",
        name: "Seagrass Conservation Project",
        owner: "0x9876...4321",
        projectType: "seagrass",
        location: "Chesapeake Bay, USA",
        area: 75,
        estimatedCredits: 1200,
        status: "pending",
        submissionDate: "2024-01-12",
        metadataCid: "QmP7Q8R9...",
        evidenceFiles: ["QmG7H8I9..."],
        description:
          "Seagrass bed restoration and protection initiative focusing on eelgrass species to improve water quality and carbon storage.",
      },
      {
        id: "proj_003",
        name: "Salt Marsh Protection",
        owner: "0x5555...7777",
        projectType: "saltmarsh",
        location: "San Francisco Bay, USA",
        area: 200,
        estimatedCredits: 3000,
        status: "approved",
        submissionDate: "2024-01-08",
        metadataCid: "QmL3M4N5...",
        evidenceFiles: ["QmJ1K2L3...", "QmM4N5O6..."],
        description:
          "Comprehensive salt marsh restoration and protection program with community involvement and long-term monitoring.",
      },
    ]

    setTimeout(() => {
      setProjects(mockProjects)
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
                <Shield className="h-6 w-6 text-accent" />
                <h1 className="text-xl font-bold text-foreground">Verifier Dashboard</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">Wallet Required</CardTitle>
              <CardDescription>Please connect your wallet to access the verifier dashboard</CardDescription>
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

  const pendingProjects = projects.filter((p) => p.status === "pending")
  const approvedProjects = projects.filter((p) => p.status === "approved")
  const rejectedProjects = projects.filter((p) => p.status === "rejected")

  const handleReviewProject = (project: Project) => {
    setSelectedProject(project)
    setIsReviewModalOpen(true)
  }

  const handleApproveProject = async (projectId: string) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status: "approved" as const } : p)))
    setIsReviewModalOpen(false)
  }

  const handleRejectProject = async (projectId: string) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status: "rejected" as const } : p)))
    setIsReviewModalOpen(false)
  }

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
    }
  }

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="border-border hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-foreground">{project.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <MapPin className="h-3 w-3" />
              {project.location}
            </CardDescription>
          </div>
          {getStatusBadge(project.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span>
              <p className="font-medium capitalize">{project.projectType}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Area:</span>
              <p className="font-medium">{project.area} hectares</p>
            </div>
            <div>
              <span className="text-muted-foreground">Est. Credits:</span>
              <p className="font-medium">{project.estimatedCredits.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Submitted:</span>
              <p className="font-medium">{new Date(project.submissionDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <span className="text-muted-foreground text-sm">Owner:</span>
            <p className="font-mono text-sm">{project.owner}</p>
          </div>

          <div>
            <span className="text-muted-foreground text-sm">Description:</span>
            <p className="text-sm text-foreground line-clamp-2">{project.description}</p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReviewProject(project)}
              className="flex-1 bg-transparent"
            >
              <Eye className="h-4 w-4 mr-2" />
              Review
            </Button>
            {project.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApproveProject(project.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleRejectProject(project.id)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </div>
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
              <Shield className="h-6 w-6 text-accent" />
              <h1 className="text-xl font-bold text-foreground">Verifier Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Project Verification</h2>
          <p className="text-muted-foreground">Review and verify blue carbon projects for credit issuance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingProjects.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{approvedProjects.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
                  <p className="text-2xl font-bold text-primary">
                    {approvedProjects.reduce((sum, p) => sum + p.estimatedCredits, 0).toLocaleString()}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending ({pendingProjects.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedProjects.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedProjects.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
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
            ) : pendingProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Pending Projects</h3>
                  <p className="text-muted-foreground">All projects have been reviewed</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            {approvedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Approved Projects</h3>
                  <p className="text-muted-foreground">No projects have been approved yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            {rejectedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rejectedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <XCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Rejected Projects</h3>
                  <p className="text-muted-foreground">No projects have been rejected</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Project Review Modal */}
      {selectedProject && (
        <ProjectReviewModal
          project={selectedProject}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onApprove={() => handleApproveProject(selectedProject.id)}
          onReject={() => handleRejectProject(selectedProject.id)}
        />
      )}
    </div>
  )
}
