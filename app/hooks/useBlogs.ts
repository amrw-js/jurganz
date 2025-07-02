'use client'

import { useCallback, useEffect, useState } from 'react'

import type { Blog, BlogFormData, BlogMedia } from '@/types/blog.types'

const STORAGE_KEY = 'blogs-data'

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  // Load blogs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedBlogs = JSON.parse(stored)
        // Ensure dates are properly converted
        const blogsWithDates = parsedBlogs.map((blog: any) => ({
          ...blog,
          createdAt: new Date(blog.createdAt),
          updatedAt: new Date(blog.updatedAt),
        }))
        setBlogs(blogsWithDates)
      }
    } catch (error) {
      console.error('Error loading blogs:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save blogs to localStorage whenever blogs change
  const saveBlogs = useCallback((updatedBlogs: Blog[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBlogs))
      setBlogs(updatedBlogs)
    } catch (error) {
      console.error('Error saving blogs:', error)
    }
  }, [])

  // Generate slug from title
  const generateSlug = useCallback((title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }, [])

  // Calculate read time (average 200 words per minute)
  const calculateReadTime = useCallback((content: string): number => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }, [])

  // Update the processFeaturedImage function to processMedia
  const processMedia = useCallback(async (media: BlogMedia[]): Promise<BlogMedia[]> => {
    // Since media is already uploaded via the upload hook, just return it
    return media
  }, [])

  const addBlog = useCallback(
    async (data: BlogFormData) => {
      try {
        const processedMedia = await processMedia(data.media || [])
        const slug = data.slug || generateSlug(data.title)
        const readTime = calculateReadTime(data.content)

        const newBlog: Blog = {
          id: Date.now().toString(),
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          slug: slug,
          published: data.published,
          tags: data.tags,
          media: processedMedia, // Changed from featuredImage
          readTime: readTime,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const updatedBlogs = [...blogs, newBlog]
        saveBlogs(updatedBlogs)
        return newBlog
      } catch (error) {
        console.error('Error adding blog:', error)
        throw error
      }
    },
    [blogs, saveBlogs, generateSlug, calculateReadTime, processMedia],
  )

  const updateBlog = useCallback(
    async (id: string, data: BlogFormData) => {
      try {
        const existingBlog = blogs.find((b) => b.id === id)
        const processedMedia = await processMedia(data.media || [])

        // Clean up old media URLs if they exist
        if (existingBlog?.media) {
          existingBlog.media.forEach((mediaItem) => {
            if (mediaItem.url.startsWith('blob:')) {
              URL.revokeObjectURL(mediaItem.url)
            }
          })
        }

        const slug = data.slug || generateSlug(data.title)
        const readTime = calculateReadTime(data.content)

        const updatedBlogs = blogs.map((blog) =>
          blog.id === id
            ? {
                ...blog,
                title: data.title,
                content: data.content,
                excerpt: data.excerpt,
                slug: slug,
                published: data.published,
                tags: data.tags,
                media: processedMedia, // Changed from featuredImage
                readTime: readTime,
                updatedAt: new Date(),
              }
            : blog,
        )

        saveBlogs(updatedBlogs)
      } catch (error) {
        console.error('Error updating blog:', error)
        throw error
      }
    },
    [blogs, saveBlogs, generateSlug, calculateReadTime, processMedia],
  )

  const deleteBlog = useCallback(
    (id: string) => {
      try {
        // Clean up media URLs before deleting
        const blogToDelete = blogs.find((b) => b.id === id)
        if (blogToDelete?.media) {
          blogToDelete.media.forEach((mediaItem) => {
            if (mediaItem.url.startsWith('blob:')) {
              URL.revokeObjectURL(mediaItem.url)
            }
          })
        }

        const updatedBlogs = blogs.filter((blog) => blog.id !== id)
        saveBlogs(updatedBlogs)
      } catch (error) {
        console.error('Error deleting blog:', error)
        throw error
      }
    },
    [blogs, saveBlogs],
  )

  const getBlog = useCallback(
    (id: string) => {
      return blogs.find((blog) => blog.id === id)
    },
    [blogs],
  )

  const getBlogBySlug = useCallback(
    (slug: string) => {
      return blogs.find((blog) => blog.slug === slug)
    },
    [blogs],
  )

  const searchBlogs = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase()
      return blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(lowercaseQuery) ||
          blog.excerpt.toLowerCase().includes(lowercaseQuery) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
      )
    },
    [blogs],
  )

  const getBlogsByTag = useCallback(
    (tag: string) => {
      return blogs.filter((blog) => blog.tags.includes(tag))
    },
    [blogs],
  )

  const getPublishedBlogs = useCallback(() => {
    return blogs.filter((blog) => blog.published)
  }, [blogs])

  const getDraftBlogs = useCallback(() => {
    return blogs.filter((blog) => !blog.published)
  }, [blogs])

  // Get all unique tags
  const getAllTags = useCallback(() => {
    const allTags = blogs.flatMap((blog) => blog.tags)
    return [...new Set(allTags)].sort()
  }, [blogs])

  // Update cleanup function
  const cleanup = useCallback(() => {
    blogs.forEach((blog) => {
      if (blog.media) {
        blog.media.forEach((mediaItem) => {
          if (mediaItem.url.startsWith('blob:')) {
            URL.revokeObjectURL(mediaItem.url)
          }
        })
      }
    })
  }, [blogs])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    // Data
    blogs,
    loading,

    // CRUD operations
    addBlog,
    updateBlog,
    deleteBlog,
    getBlog,
    getBlogBySlug,

    // Utility functions
    searchBlogs,
    getBlogsByTag,
    getPublishedBlogs,
    getDraftBlogs,
    getAllTags,
    generateSlug,
    cleanup,
  }
}
