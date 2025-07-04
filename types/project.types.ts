export interface Project {
  id: string
  name: string
  companyName: string
  capacity: string
  time: string
  media?: ProjectMedia[]
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

export interface CreateProject {
  name: string
  companyName: string
  capacity: string
  time: string
  media?: ProjectMedia[]
}

export interface ProjectFormData {
  name: string
  companyName: string
  capacity: string
  time: string
  media: ProjectMedia[]
}

export interface ProjectsResponse {
  data: Project[]
  total: number
  page?: number
  limit?: number
}
