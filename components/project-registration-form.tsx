"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProjectData {
  name: string
  description: string
  location: string
  area: string
  projectType: string
  estimatedCredits: string
  startDate: string
  endDate: string
}

interface FileUpload {
  file: File
  type: "evidence" | "metadata"
  status: "pending" | "uploading" | "uploaded" | "error"
  ipfsCid?: string
}

export function ProjectRegistrationForm() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    description: "",
    location: "",
    area: "",
    projectType: "mangrove",
    estimatedCredits: "",
    startDate: "",
    endDate: "",
  })
  const [files, setFiles] = useState<FileUpload[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof ProjectData, value: string) => {
    setProjectData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "evidence" | "metadata") => {
    const selectedFiles = Array.from(event.target.files || [])
    const newFiles: FileUpload[] = selectedFiles.map((file) => ({
      file,
      type,
      status: "pending",
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const uploadToIPFS = async (file: File): Promise<string> => {
    // Simulate IPFS upload
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return `Qm${Math.random().toString(36).substring(2, 15)}`
  }

  const uploadFiles = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending")

    for (const fileUpload of pendingFiles) {
      const index = files.indexOf(fileUpload)
      setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "uploading" } : f)))

      try {
        const ipfsCid = await uploadToIPFS(fileUpload.file)
        setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "uploaded", ipfsCid } : f)))
      } catch (error) {
        setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "error" } : f)))
      }
    }
  }

  const registerProject = async () => {
    setIsSubmitting(true)
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Project Registered Successfully",
        description: "Your project has been submitted for verification.",
      })

      // Reset form or redirect
      setCurrentStep(4)
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const getStepProgress = () => (currentStep / 4) * 100

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Step {currentStep} of 4</span>
            <span className="text-sm text-muted-foreground">{Math.round(getStepProgress())}% Complete</span>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Project Details</span>
            <span>Upload Files</span>
            <span>Review</span>
            <span>Submit</span>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Project Details */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Project Information
            </CardTitle>
            <CardDescription>Provide basic information about your blue carbon project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={projectData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Mangrove Restoration Project"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <select
                  id="projectType"
                  value={projectData.projectType}
                  onChange={(e) => handleInputChange("projectType", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="mangrove">Mangrove Restoration</option>
                  <option value="seagrass">Seagrass Conservation</option>
                  <option value="saltmarsh">Salt Marsh Protection</option>
                  <option value="kelp">Kelp Forest Restoration</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your project's environmental impact and methodology..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={projectData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Florida Keys, USA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area (hectares)</Label>
                <Input
                  id="area"
                  type="number"
                  value={projectData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedCredits">Estimated Credits</Label>
                <Input
                  id="estimatedCredits"
                  type="number"
                  value={projectData.estimatedCredits}
                  onChange={(e) => handleInputChange("estimatedCredits", e.target.value)}
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Project Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={projectData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Project End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={projectData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={nextStep} className="bg-primary hover:bg-primary/90">
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: File Upload */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Project Evidence
            </CardTitle>
            <CardDescription>Upload photos, documents, and metadata files to support your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Evidence Files */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Project Evidence</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Photos, satellite imagery, or other visual evidence
                </p>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, "evidence")}
                      className="hidden"
                      id="evidence-upload"
                    />
                    <Label htmlFor="evidence-upload" className="cursor-pointer">
                      <Button variant="outline" className="bg-transparent" asChild>
                        <span>Choose Files</span>
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Metadata Files */}
              <div>
                <Label className="text-base font-medium">Project Metadata</Label>
                <p className="text-sm text-muted-foreground mb-2">JSON files with detailed project specifications</p>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Upload JSON metadata files</p>
                    <Input
                      type="file"
                      multiple
                      accept=".json"
                      onChange={(e) => handleFileUpload(e, "metadata")}
                      className="hidden"
                      id="metadata-upload"
                    />
                    <Label htmlFor="metadata-upload" className="cursor-pointer">
                      <Button variant="outline" className="bg-transparent" asChild>
                        <span>Choose JSON Files</span>
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <Label className="text-base font-medium">Uploaded Files</Label>
                <div className="space-y-2">
                  {files.map((fileUpload, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{fileUpload.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {fileUpload.type} • {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {fileUpload.status === "pending" && <Badge variant="secondary">Pending</Badge>}
                        {fileUpload.status === "uploading" && (
                          <Badge variant="secondary">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Uploading
                          </Badge>
                        )}
                        {fileUpload.status === "uploaded" && (
                          <Badge className="bg-primary/10 text-primary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        )}
                        {fileUpload.status === "error" && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {files.some((f) => f.status === "pending") && (
                  <Button onClick={uploadFiles} className="w-full bg-primary hover:bg-primary/90">
                    Upload to IPFS
                  </Button>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep} className="bg-transparent">
                Previous
              </Button>
              <Button
                onClick={nextStep}
                disabled={files.length === 0 || files.some((f) => f.status !== "uploaded")}
                className="bg-primary hover:bg-primary/90"
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Review Project Details
            </CardTitle>
            <CardDescription>Review your project information before submitting to the blockchain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Project Name</Label>
                  <p className="text-foreground">{projectData.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="text-foreground capitalize">{projectData.projectType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                  <p className="text-foreground">{projectData.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Area</Label>
                  <p className="text-foreground">{projectData.area} hectares</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Estimated Credits</Label>
                  <p className="text-foreground">{projectData.estimatedCredits} CARBON</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                  <p className="text-foreground">
                    {projectData.startDate} to {projectData.endDate}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Files Uploaded</Label>
                  <p className="text-foreground">{files.length} files</p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              <p className="text-foreground mt-1">{projectData.description}</p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep} className="bg-transparent">
                Previous
              </Button>
              <Button onClick={nextStep} className="bg-primary hover:bg-primary/90">
                Submit for Registration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Submit */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className={`h-5 w-5 ${isSubmitting ? "animate-spin" : ""} text-primary`} />
              {isSubmitting ? "Registering Project..." : "Ready to Submit"}
            </CardTitle>
            <CardDescription>
              {isSubmitting
                ? "Please wait while we register your project on the blockchain"
                : "Your project is ready to be registered on the blockchain"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              {!isSubmitting ? (
                <div className="space-y-4">
                  <CheckCircle className="mx-auto h-16 w-16 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Project Ready</h3>
                    <p className="text-muted-foreground">Click below to register your project on the blockchain</p>
                  </div>
                  <Button onClick={registerProject} className="bg-primary hover:bg-primary/90">
                    Register Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Processing Transaction</h3>
                    <p className="text-muted-foreground">Please confirm the transaction in your wallet</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
