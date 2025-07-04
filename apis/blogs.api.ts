import { API_BASE_URL } from '@/app/utils/constants'
import { Blog, CreateBlog } from '@/types/blog.types'

export const blogsApi = {
  createBlog: async (data: CreateBlog): Promise<Blog> => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to create blog')
    }
    return response.json()
  },

  updateBlog: async (id: string, data: Partial<CreateBlog>): Promise<Blog> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to update blog')
    }
    return response.json()
  },

  getBlogs: async (): Promise<Blog[]> => {
    const response = await fetch(`${API_BASE_URL}/blogs`)
    if (!response.ok) {
      throw new Error('Failed to fetch blogs')
    }
    return response.json()
  },

  getBlog: async (id: string): Promise<Blog> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch blog')
    }
    return response.json()
  },

  deleteBlog: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete blog')
    }
  },
}
