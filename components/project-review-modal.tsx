"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Calendar, Leaf, FileText, ExternalLink, CheckCircle, XCircle, Eye } from "lucide-react"

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

interface ProjectReviewModalProps {
  project: Project
  isOpen: boolean
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}

export function ProjectReviewModal({ project, isOpen, onClose, onApprove, onReject }: ProjectReviewModalProps) {
  const handleViewIPFS = (cid: string) => {
    window.open(`https://ipfs.io/ipfs/${cid}`, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Leaf className="h-5 w-5 text-primary" />
            {project.name}
          </DialogTitle>
          <DialogDescription>Review project details and evidence for verification</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Project Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Project Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Submitted: {new Date(project.submissionDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm capitalize">{project.projectType} restoration</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Project Owner</h4>
                  <p className="font-mono text-sm bg-muted p-2 rounded">{project.owner}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Project Metrics</h3>
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
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Status</h4>
                  <Badge
                    variant={
                      project.status === "pending"
                        ? "secondary"
                        : project.status === "approved"
                          ? "default"
                          : "destructive"
                    }
                    className={
                      project.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : project.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : ""
                    }
                  >
                    {project.status === "pending" && <Calendar className="h-3 w-3 mr-1" />}
                    {project.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {project.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </div>
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewIPFS(project.metadataCid)}
                        className="bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewIPFS(project.metadataCid)}
                        className="bg-transparent"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        IPFS
                      </Button>
                    </div>
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
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewIPFS(cid)}
                            className="bg-transparent"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewIPFS(cid)}
                            className="bg-transparent"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            IPFS
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        {project.status === "pending" && (
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              Close
            </Button>
            <Button variant="destructive" onClick={onReject}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject Project
            </Button>
            <Button onClick={onApprove} className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Project
            </Button>
          </div>
        )}

        {project.status !== "pending" && (
          <div className="flex justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
