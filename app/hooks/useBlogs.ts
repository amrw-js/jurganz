import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { blogsApi } from '@/apis/blogs.api'
import { Blog, CreateBlog } from '@/types/blog.types'

// Query keys
export const blogsKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogsKeys.all, 'list'] as const,
  list: (filters?: any) => [...blogsKeys.lists(), filters] as const,
  details: () => [...blogsKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogsKeys.details(), id] as const,
}

// Get all blogs
export const useBlogs = () => {
  return useQuery<Blog[], Error>({
    queryKey: blogsKeys.lists(),
    queryFn: blogsApi.getBlogs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single blog
export const useBlog = (id: string) => {
  return useQuery({
    queryKey: blogsKeys.detail(id),
    queryFn: () => blogsApi.getBlog(id),
    enabled: !!id,
  })
}

// Create blog mutation
export const useCreateBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBlog) => blogsApi.createBlog(data),
    onSuccess: () => {
      // Invalidate and refetch blogs list
      queryClient.invalidateQueries({ queryKey: blogsKeys.lists() })
    },
  })
}

// Update blog mutation
export const useUpdateBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBlog> }) => blogsApi.updateBlog(id, data),
    onSuccess: (updatedBlog) => {
      // Update the specific blog in cache
      queryClient.setQueryData(blogsKeys.detail(updatedBlog.id), updatedBlog)
      // Invalidate blogs list
      queryClient.invalidateQueries({ queryKey: blogsKeys.lists() })
    },
  })
}

// Delete blog mutation
export const useDeleteBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => blogsApi.deleteBlog(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: blogsKeys.detail(deletedId) })
      // Invalidate blogs list
      queryClient.invalidateQueries({ queryKey: blogsKeys.lists() })
    },
  })
}
