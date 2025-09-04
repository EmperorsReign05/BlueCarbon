"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, MapPin, Calendar, Leaf, TrendingUp, Eye, BarChart3 } from "lucide-react"
import { ProjectDetailModal } from "@/components/project-detail-modal"

interface Project {
  id: string
  name: string
  owner: string
  projectType: string
  location: string
  area: number
  estimatedCredits: number
  issuedCredits: number
  retiredCredits: number
  status: "registered" | "verified" | "issued" | "retired"
  registrationDate: string
  verificationDate?: string
  issuanceDate?: string
  metadataCid: string
  evidenceFiles: string[]
  description: string
  pricePerCredit?: number
}

export default function ProjectExplorer() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
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
        issuedCredits: 2500,
        retiredCredits: 1000,
        status: "issued",
        registrationDate: "2024-01-15",
        verificationDate: "2024-01-20",
        issuanceDate: "2024-01-22",
        metadataCid: "QmX1Y2Z3...",
        evidenceFiles: ["QmA1B2C3...", "QmD4E5F6..."],
        description:
          "Large-scale mangrove restoration project aimed at protecting coastal areas and sequestering carbon through native species replanting.",
        pricePerCredit: 25,
      },
      {
        id: "proj_002",
        name: "Seagrass Conservation Project",
        owner: "0x9876...4321",
        projectType: "seagrass",
        location: "Chesapeake Bay, USA",
        area: 75,
        estimatedCredits: 1200,
        issuedCredits: 1200,
        retiredCredits: 100,
        status: "issued",
        registrationDate: "2024-01-12",
        verificationDate: "2024-01-18",
        issuanceDate: "2024-01-20",
        metadataCid: "QmP7Q8R9...",
        evidenceFiles: ["QmG7H8I9..."],
        description:
          "Seagrass bed restoration and protection initiative focusing on eelgrass species to improve water quality and carbon storage.",
        pricePerCredit: 22,
      },
      {
        id: "proj_003",
        name: "Salt Marsh Protection",
        owner: "0x5555...7777",
        projectType: "saltmarsh",
        location: "San Francisco Bay, USA",
        area: 200,
        estimatedCredits: 3000,
        issuedCredits: 3000,
        retiredCredits: 0,
        status: "issued",
        registrationDate: "2024-01-08",
        verificationDate: "2024-01-15",
        issuanceDate: "2024-01-17",
        metadataCid: "QmL3M4N5...",
        evidenceFiles: ["QmJ1K2L3...", "QmM4N5O6..."],
        description:
          "Comprehensive salt marsh restoration and protection program with community involvement and long-term monitoring.",
        pricePerCredit: 30,
      },
      {
        id: "proj_004",
        name: "Kelp Forest Restoration",
        owner: "0x3333...9999",
        projectType: "kelp",
        location: "Monterey Bay, USA",
        area: 120,
        estimatedCredits: 1800,
        issuedCredits: 0,
        retiredCredits: 0,
        status: "verified",
        registrationDate: "2024-01-25",
        verificationDate: "2024-01-30",
        metadataCid: "QmK1L2M3...",
        evidenceFiles: ["QmN4O5P6..."],
        description: "Kelp forest restoration project to enhance marine biodiversity and carbon sequestration.",
      },
      {
        id: "proj_005",
        name: "Coastal Wetland Conservation",
        owner: "0x7777...1111",
        projectType: "saltmarsh",
        location: "Louisiana Coast, USA",
        area: 300,
        estimatedCredits: 4500,
        issuedCredits: 0,
        retiredCredits: 0,
        status: "registered",
        registrationDate: "2024-02-01",
        metadataCid: "QmR5S6T7...",
        evidenceFiles: ["QmU8V9W0..."],
        description: "Large-scale coastal wetland conservation project to protect against erosion and store carbon.",
      },
    ]

    setTimeout(() => {
      setProjects(mockProjects)
      setFilteredProjects(mockProjects)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter projects based on search and filters
  useEffect(() => {
    let filtered = projects

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.owner.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((project) => project.projectType === typeFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchQuery, statusFilter, typeFilter])

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "registered":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Registered
          </Badge>
        )
      case "verified":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Verified
          </Badge>
        )
      case "issued":
        return <Badge className="bg-green-100 text-green-800">Credits Issued</Badge>
      case "retired":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Retired
          </Badge>
        )
    }
  }

  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
    setIsDetailModalOpen(true)
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
        <div className="space-y-4">
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
              <span className="text-muted-foreground">Issued:</span>
              <p className="font-medium">{project.issuedCredits.toLocaleString()}</p>
            </div>
          </div>

          {project.status === "issued" && project.pricePerCredit && (
            <div className="bg-primary/5 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Price per credit:</span>
                <span className="font-bold text-primary">${project.pricePerCredit}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-muted-foreground">Available:</span>
                <span className="font-medium">{(project.issuedCredits - project.retiredCredits).toLocaleString()}</span>
              </div>
            </div>
          )}

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
              onClick={() => handleViewProject(project)}
              className="flex-1 bg-transparent"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            {project.status === "issued" && project.issuedCredits > project.retiredCredits && (
              <Button size="sm" onClick={() => router.push("/buy")} className="bg-primary hover:bg-primary/90">
                Buy Credits
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const stats = {
    totalProjects: projects.length,
    totalCreditsIssued: projects.reduce((sum, p) => sum + p.issuedCredits, 0),
    totalCreditsRetired: projects.reduce((sum, p) => sum + p.retiredCredits, 0),
    totalArea: projects.reduce((sum, p) => sum + p.area, 0),
  }

  const projectsByStatus = {
    registered: projects.filter((p) => p.status === "registered").length,
    verified: projects.filter((p) => p.status === "verified").length,
    issued: projects.filter((p) => p.status === "issued").length,
    retired: projects.filter((p) => p.status === "retired").length,
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
              <BarChart3 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Project Explorer</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Blue Carbon Projects</h2>
          <p className="text-muted-foreground">Explore all registered blue carbon projects and their impact</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalProjects}</p>
                </div>
                <Leaf className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Credits Issued</p>
                  <p className="text-2xl font-bold text-accent">{stats.totalCreditsIssued.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Credits Retired</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalCreditsRetired.toLocaleString()}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Area</p>
                  <p className="text-2xl font-bold text-secondary">{stats.totalArea.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">hectares</p>
                </div>
                <MapPin className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects, locations, or owners..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="issued">Credits Issued</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="mangrove">Mangrove</SelectItem>
                    <SelectItem value="seagrass">Seagrass</SelectItem>
                    <SelectItem value="saltmarsh">Salt Marsh</SelectItem>
                    <SelectItem value="kelp">Kelp Forest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({filteredProjects.length})</TabsTrigger>
            <TabsTrigger value="registered">Registered ({projectsByStatus.registered})</TabsTrigger>
            <TabsTrigger value="verified">Verified ({projectsByStatus.verified})</TabsTrigger>
            <TabsTrigger value="issued">Issued ({projectsByStatus.issued})</TabsTrigger>
            <TabsTrigger value="retired">Retired ({projectsByStatus.retired})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Status-specific tabs */}
          {["registered", "verified", "issued", "retired"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects
                  .filter((p) => p.status === status)
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  )
}
