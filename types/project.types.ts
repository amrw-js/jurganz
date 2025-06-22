export interface Project {
  id: string
  name: string
  capacity: number
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

export interface ProjectFormData {
  name: string
  capacity: number
  time: string
  photos: File[]
}

// Legacy support - can be removed if not needed elsewhere
export type ProjectPhoto = ProjectMedia
