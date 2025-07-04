// hooks/useProductionLines.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { productionLinesApi } from '@/apis/production-lines.api'
import { CreateProductionLine, ProductionLine } from '@/types/production-line.types'

// Query keys
export const productionLinesKeys = {
  all: ['production-lines'] as const,
  lists: () => [...productionLinesKeys.all, 'list'] as const,
  list: (filters?: any) => [...productionLinesKeys.lists(), filters] as const,
  published: () => [...productionLinesKeys.all, 'published'] as const,
  details: () => [...productionLinesKeys.all, 'detail'] as const,
  detail: (id: string) => [...productionLinesKeys.details(), id] as const,
}

// Get all production lines
export const useProductionLines = () => {
  return useQuery<ProductionLine[], Error>({
    queryKey: productionLinesKeys.lists(),
    queryFn: productionLinesApi.getProductionLines,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get published production lines
export const usePublishedProductionLines = () => {
  return useQuery<ProductionLine[], Error>({
    queryKey: productionLinesKeys.published(),
    queryFn: productionLinesApi.getPublishedProductionLines,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single production line
export const useProductionLine = (id: string) => {
  return useQuery({
    queryKey: productionLinesKeys.detail(id),
    queryFn: () => productionLinesApi.getProductionLine(id),
    enabled: !!id,
  })
}

// Create production line mutation
export const useCreateProductionLine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductionLine) => productionLinesApi.createProductionLine(data),
    onSuccess: () => {
      // Invalidate and refetch production lines list
      queryClient.invalidateQueries({ queryKey: productionLinesKeys.lists() })
      // Also invalidate published list as the new item might be published
      queryClient.invalidateQueries({ queryKey: productionLinesKeys.published() })
    },
  })
}

// Update production line mutation
export const useUpdateProductionLine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductionLine> }) =>
      productionLinesApi.updateProductionLine(id, data),
    onSuccess: (updatedProductionLine) => {
      // Update the specific production line in cache
      queryClient.setQueryData(productionLinesKeys.detail(updatedProductionLine.id), updatedProductionLine)
      // Invalidate production lines list
      queryClient.invalidateQueries({ queryKey: productionLinesKeys.lists() })
      // Invalidate published list in case publication status changed
      queryClient.invalidateQueries({ queryKey: productionLinesKeys.published() })
    },
  })
}

// Delete production line mutation
export const useDeleteProductionLine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productionLinesApi.deleteProductionLine(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: productionLinesKeys.detail(deletedId) })
      // Invalidate production lines list
      queryClient.invalidateQueries({ queryKey: productionLinesKeys.lists() })
      // Invalidate published list
      queryClient.invalidateQueries({ queryKey: productionLinesKeys.published() })
    },
  })
}
