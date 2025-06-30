export interface Project {
  id: string
  name: string
  capacity: string
  companyName: string
  time: string
  photos?: ProjectMedia[]
  createdAt: Date
  updatedAt: Date
}

export interface ProjectMedia {
  id: string
  url: string
  type: 'image' | 'video'
  name: string
  size?: number
  createdAt?: Date
}

export type MediaItem = File | ProjectMedia

export interface ProjectFormData {
  name: string
  capacity: string
  companyName: string
  time: string
  photos: MediaItem[]
}

// Legacy support - can be removed if not needed elsewhere
export type ProjectPhoto = ProjectMedia

export interface CreateProject {
  name: string
  capacity: string
  time: string
  companyName: string
  photos?: File[]
}

export interface ProjectsResponse {
  data: Project[]
  total?: number
  page?: number
  limit?: number
}
