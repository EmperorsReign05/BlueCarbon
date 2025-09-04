// API service for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface UploadResponse {
  success: boolean
  ipfsCid?: string
  error?: string
}

export interface ProjectMetadata {
  name: string
  description: string
  location: string
  area: number
  projectType: string
  estimatedCredits: number
  startDate: string
  endDate: string
  evidenceFiles: string[]
  metadataFiles: string[]
}

class ApiService {
  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("File upload error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      }
    }
  }

  async triggerVerification(projectId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      })

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Verification trigger error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Verification failed",
      }
    }
  }

  async getProjectMetadata(ipfsCid: string): Promise<ProjectMetadata | null> {
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${ipfsCid}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Metadata fetch error:", error)
      return null
    }
  }
}

export const apiService = new ApiService()
