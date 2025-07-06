export interface Blog {
  id: string
  title: string
  content: string
  featureImage?: string
  media?: BlogMedia[]
  createdAt: string
  updatedAt: string
}

export interface BlogMedia {
  id: string
  url: string
  type: 'image' | 'video'
  name: string
  size?: number
  createdAt?: Date
}

export interface CreateBlog {
  title: string
  content: string
  featureImage?: string
  media?: BlogMedia[]
}

export interface BlogFormData {
  title: string
  content: string
  featureImage?: string
  media?: BlogMedia[]
}

export interface BlogsResponse {
  data: Blog[]
  total: number
  page?: number
  limit?: number
}
