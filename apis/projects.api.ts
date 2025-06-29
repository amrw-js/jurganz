import { CreateProject, Project } from '@/types/project.types'

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BASE_URL_PROD
    : process.env.NEXT_PUBLIC_BASE_URL_PROD_DEV
export const projectsApi = {
  createProject: async (data: CreateProject): Promise<Project> => {
    // Check if we have files to upload
    const hasFiles = data.photos && data.photos.length > 0

    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData()

      formData.append('name', data.name)
      formData.append('companyName', data.companyName)
      formData.append('capacity', data.capacity.toString())
      formData.append('time', data.time)

      // Add each photo file
      data.photos!.forEach((photo) => {
        formData.append('photos', photo)
      })

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        body: formData, // No Content-Type header for FormData!
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }
      return response.json()
    } else {
      // Use JSON for projects without files
      const { photos, ...projectData } = data // Remove photos field

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }
      return response.json()
    }
  },

  updateProject: async (id: string, data: Partial<CreateProject>): Promise<Project> => {
    // Check if we have files to upload
    const hasFiles = data.photos && data.photos.length > 0

    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData()

      // Only append fields that are being updated
      if (data.name !== undefined) formData.append('name', data.name)
      if (data.companyName !== undefined) formData.append('companyName', data.companyName)
      if (data.capacity !== undefined) formData.append('capacity', data.capacity.toString())
      if (data.time !== undefined) formData.append('time', data.time)

      // Add each photo file
      data.photos!.forEach((photo) => {
        formData.append('photos', photo)
      })

      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PATCH',
        body: formData, // No Content-Type header for FormData!
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }
      return response.json()
    } else {
      // Use JSON for updates without files
      const { photos, ...updateData } = data // Remove photos field

      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }
      return response.json()
    }
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/projects`)
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }
    return response.json()
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch project')
    }
    return response.json()
  },

  deleteProject: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete project')
    }
  },
}
