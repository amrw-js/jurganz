'use client'

import { useCallback, useEffect, useState } from 'react'

import type { Project, ProjectFormData, ProjectMedia } from '@/types/project.types'

const STORAGE_KEY = 'projects-data'

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Load projects from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedProjects = JSON.parse(stored)
        // Ensure dates are properly converted
        const projectsWithDates = parsedProjects.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
        }))
        setProjects(projectsWithDates)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save projects to localStorage whenever projects change
  const saveProjects = useCallback((updatedProjects: Project[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects))
      setProjects(updatedProjects)
    } catch (error) {
      console.error('Error saving projects:', error)
    }
  }, [])

  // Convert File objects to ProjectMedia objects (simulate upload)
  const processFiles = useCallback(async (files: File[]): Promise<ProjectMedia[]> => {
    const processedMedia: ProjectMedia[] = []

    for (const file of files) {
      try {
        // Create object URL for preview (in real app, you'd upload to server/cloud)
        const url = URL.createObjectURL(file)

        // Determine file type
        const type = file.type.startsWith('video/') ? 'video' : 'image'

        const media: ProjectMedia = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: url,
          type: type,
          name: file.name,
          size: file.size,
          createdAt: new Date(),
        }

        processedMedia.push(media)
      } catch (error) {
        console.error('Error processing file:', file.name, error)
      }
    }

    return processedMedia
  }, [])

  const addProject = useCallback(
    async (data: ProjectFormData) => {
      try {
        // Process uploaded files
        const processedMedia = await processFiles(data.photos || [])

        const newProject: Project = {
          id: Date.now().toString(),
          name: data.name,
          capacity: data.capacity,
          companyName: data.companyName,
          time: data.time,
          photos: processedMedia,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const updatedProjects = [...projects, newProject]
        saveProjects(updatedProjects)
        return newProject
      } catch (error) {
        console.error('Error adding project:', error)
        throw error
      }
    },
    [projects, saveProjects, processFiles],
  )

  const updateProject = useCallback(
    async (id: string, data: ProjectFormData) => {
      try {
        // Process any new uploaded files
        const processedMedia = await processFiles(data.photos || [])

        const updatedProjects = projects.map((project) => {
          if (project.id === id) {
            // Merge existing photos with new ones
            const existingPhotos = project.photos || []
            const allPhotos = [...existingPhotos, ...processedMedia]

            return {
              ...project,
              name: data.name,
              capacity: data.capacity,
              time: data.time,
              photos: allPhotos,
              updatedAt: new Date(),
            }
          }
          return project
        })

        saveProjects(updatedProjects)
      } catch (error) {
        console.error('Error updating project:', error)
        throw error
      }
    },
    [projects, saveProjects, processFiles],
  )

  const deleteProject = useCallback(
    (id: string) => {
      try {
        // Clean up object URLs before deleting
        const projectToDelete = projects.find((p) => p.id === id)
        if (projectToDelete?.photos) {
          projectToDelete.photos.forEach((photo) => {
            if (photo.url.startsWith('blob:')) {
              URL.revokeObjectURL(photo.url)
            }
          })
        }

        const updatedProjects = projects.filter((project) => project.id !== id)
        saveProjects(updatedProjects)
      } catch (error) {
        console.error('Error deleting project:', error)
        throw error
      }
    },
    [projects, saveProjects],
  )

  const addMedia = useCallback(
    async (projectId: string, files: File[]) => {
      try {
        const processedMedia = await processFiles(files)

        const updatedProjects = projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                photos: [...(project.photos || []), ...processedMedia],
                updatedAt: new Date(),
              }
            : project,
        )
        saveProjects(updatedProjects)
      } catch (error) {
        console.error('Error adding media:', error)
        throw error
      }
    },
    [projects, saveProjects, processFiles],
  )

  const removeMedia = useCallback(
    (projectId: string, mediaId: string) => {
      try {
        const updatedProjects = projects.map((project) => {
          if (project.id === projectId) {
            // Clean up object URL before removing
            const mediaToRemove = project.photos?.find((photo) => photo.id === mediaId)
            if (mediaToRemove?.url.startsWith('blob:')) {
              URL.revokeObjectURL(mediaToRemove.url)
            }

            return {
              ...project,
              photos: project.photos?.filter((photo) => photo.id !== mediaId) || [],
              updatedAt: new Date(),
            }
          }
          return project
        })
        saveProjects(updatedProjects)
      } catch (error) {
        console.error('Error removing media:', error)
        throw error
      }
    },
    [projects, saveProjects],
  )

  const replaceProjectMedia = useCallback(
    async (projectId: string, files: File[]) => {
      try {
        // Clean up existing object URLs
        const project = projects.find((p) => p.id === projectId)
        if (project?.photos) {
          project.photos.forEach((photo) => {
            if (photo.url.startsWith('blob:')) {
              URL.revokeObjectURL(photo.url)
            }
          })
        }

        // Process new files
        const processedMedia = await processFiles(files)

        const updatedProjects = projects.map((proj) =>
          proj.id === projectId
            ? {
                ...proj,
                photos: processedMedia,
                updatedAt: new Date(),
              }
            : proj,
        )
        saveProjects(updatedProjects)
      } catch (error) {
        console.error('Error replacing project media:', error)
        throw error
      }
    },
    [projects, saveProjects, processFiles],
  )

  const getProject = useCallback(
    (id: string) => {
      return projects.find((project) => project.id === id)
    },
    [projects],
  )

  const getProjectsByCapacity = useCallback(
    (minCapacity: number) => {
      return projects.filter((project) => project.capacity >= minCapacity)
    },
    [projects],
  )

  const searchProjects = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase()
      return projects.filter(
        (project) =>
          project.name.toLowerCase().includes(lowercaseQuery) || project.time.toLowerCase().includes(lowercaseQuery),
      )
    },
    [projects],
  )

  // Cleanup function to revoke all object URLs
  const cleanup = useCallback(() => {
    projects.forEach((project) => {
      project.photos?.forEach((photo) => {
        if (photo.url.startsWith('blob:')) {
          URL.revokeObjectURL(photo.url)
        }
      })
    })
  }, [projects])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    // Data
    projects,
    loading,

    // CRUD operations
    addProject,
    updateProject,
    deleteProject,
    getProject,

    // Media operations
    addMedia,
    removeMedia,
    replaceProjectMedia,

    // Utility functions
    getProjectsByCapacity,
    searchProjects,
    cleanup,
  }
}
