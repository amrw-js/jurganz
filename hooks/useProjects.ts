// hooks/useProjects.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { projectsApi } from '@/apis/projects.api'
import { CreateProject, Project, ProjectsResponse } from '@/types/project.types'

// Query keys
export const projectsKeys = {
  all: ['projects'] as const,
  lists: () => [...projectsKeys.all, 'list'] as const,
  list: (filters?: any) => [...projectsKeys.lists(), filters] as const,
  details: () => [...projectsKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectsKeys.details(), id] as const,
}

// Get all projects
export const useProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: projectsKeys.lists(),
    queryFn: projectsApi.getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single project
export const useProject = (id: string) => {
  return useQuery({
    queryKey: projectsKeys.detail(id),
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
  })
}

// Create project mutation
export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProject) => projectsApi.createProject(data),
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() })
    },
  })
}

// Update project mutation
export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProject> }) => projectsApi.updateProject(id, data),
    onSuccess: (updatedProject) => {
      // Update the specific project in cache
      queryClient.setQueryData(projectsKeys.detail(updatedProject.id), updatedProject)
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() })
    },
  })
}

// Delete project mutation
export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => projectsApi.deleteProject(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: projectsKeys.detail(deletedId) })
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() })
    },
  })
}
