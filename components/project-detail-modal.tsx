"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  Calendar,
  Leaf,
  FileText,
  ExternalLink,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  DollarSign,
} from "lucide-react"

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

interface ProjectDetailModalProps {
  project: Project
  isOpen: boolean
  onClose: () => void
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const handleViewIPFS = (cid: string) => {
    window.open(`https://ipfs.io/ipfs/${cid}`, "_blank")
  }

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "registered":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Registered
          </Badge>
        )
      case "verified":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "issued":
        return (
          <Badge className="bg-green-100 text-green-800">
            <Award className="h-3 w-3 mr-1" />
            Credits Issued
          </Badge>
        )
      case "retired":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <Calendar className="h-3 w-3 mr-1" />
            Retired
          </Badge>
        )
    }
  }

  const getProgressPercentage = () => {
    if (project.estimatedCredits === 0) return 0
    return (project.issuedCredits / project.estimatedCredits) * 100
  }

  const getRetirementPercentage = () => {
    if (project.issuedCredits === 0) return 0
    return (project.retiredCredits / project.issuedCredits) * 100
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Leaf className="h-5 w-5 text-primary" />
            {project.name}
          </DialogTitle>
          <DialogDescription>Detailed project information and impact metrics</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Project Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Project Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm capitalize">{project.projectType} restoration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Registered: {new Date(project.registrationDate).toLocaleDateString()}
                      </span>
                    </div>
                    {project.verificationDate && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Verified: {new Date(project.verificationDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {project.issuanceDate && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Credits Issued: {new Date(project.issuanceDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Project Owner</h4>
                  <p className="font-mono text-sm bg-muted p-2 rounded">{project.owner}</p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Status</h4>
                  {getStatusBadge(project.status)}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Project Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p className="text-lg font-bold text-primary">{project.area}</p>
                      <p className="text-xs text-muted-foreground">hectares</p>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Est. Credits</p>
                      <p className="text-lg font-bold text-accent">{project.estimatedCredits.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">CARBON tokens</p>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Issued</p>
                      <p className="text-lg font-bold text-green-600">{project.issuedCredits.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">CARBON tokens</p>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Retired</p>
                      <p className="text-lg font-bold text-secondary">{project.retiredCredits.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">CARBON tokens</p>
                    </div>
                  </div>
                </div>

                {project.pricePerCredit && (
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-foreground">Market Information</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Price per credit:</span>
                        <span className="font-bold text-primary">${project.pricePerCredit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Available:</span>
                        <span className="font-medium">
                          {(project.issuedCredits - project.retiredCredits).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Market value:</span>
                        <span className="font-bold">
                          $
                          {((project.issuedCredits - project.retiredCredits) * project.pricePerCredit).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Progress Tracking */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Project Progress</h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Credit Issuance Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {project.issuedCredits.toLocaleString()} / {project.estimatedCredits.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {getProgressPercentage().toFixed(1)}% of estimated credits issued
                  </p>
                </div>

                {project.issuedCredits > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Retirement Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {project.retiredCredits.toLocaleString()} / {project.issuedCredits.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={getRetirementPercentage()} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {getRetirementPercentage().toFixed(1)}% of issued credits retired
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Project Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Project Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
            </div>

            <Separator />

            {/* IPFS Files */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Project Files</h3>

              {/* Metadata */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Project Metadata</h4>
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">metadata.json</p>
                        <p className="text-sm text-muted-foreground">IPFS: {project.metadataCid}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewIPFS(project.metadataCid)}
                      className="bg-transparent"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on IPFS
                    </Button>
                  </div>
                </div>
              </div>

              {/* Evidence Files */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Evidence Files</h4>
                <div className="space-y-2">
                  {project.evidenceFiles.map((cid, index) => (
                    <div key={cid} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-accent" />
                          <div>
                            <p className="font-medium">evidence_{index + 1}.jpg</p>
                            <p className="text-sm text-muted-foreground">IPFS: {cid}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewIPFS(cid)}
                          className="bg-transparent"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on IPFS
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="bg-transparent">
            Close
          </Button>
          {project.status === "issued" && project.issuedCredits > project.retiredCredits && (
            <Button className="bg-primary hover:bg-primary/90">
              <TrendingUp className="h-4 w-4 mr-2" />
              Buy Credits
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
