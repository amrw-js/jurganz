export interface Project {
  id: string
  name: string
  capacity: string
  companyName: string
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

export interface ProjectFormData {
  name: string
  capacity: string
  companyName: string
  time: string
  media: ProjectMedia[]
}

export interface CreateProject {
  name: string
  capacity: string
  time: string
  companyName: string
  photos?: ProjectMedia[]
}

export interface ProjectsResponse {
  data: Project[]
  total?: number
  page?: number
  limit?: number
}
