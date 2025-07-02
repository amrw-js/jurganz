export interface BlogMedia {
  id: string
  url: string
  type: 'image' | 'video'
  name: string
  size?: number
  createdAt?: Date
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featuredImage?: string
  media?: BlogMedia[]
  tags: string[]
  status: 'draft' | 'published'
  readTime?: number
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export interface BlogFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: File | null
  media: BlogMedia[]
  tags: string[]
  status: 'draft' | 'published'
}

export interface BlogFilters {
  search?: string
  tags?: string[]
  status?: 'draft' | 'published' | 'all'
}

export interface BlogStats {
  total: number
  published: number
  drafts: number
  totalViews?: number
}
