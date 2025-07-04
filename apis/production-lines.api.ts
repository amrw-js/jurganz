import { API_BASE_URL } from '@/app/utils/constants'
import { CreateProductionLine, ProductionLine } from '@/types/production-line.types'

export const productionLinesApi = {
  createProductionLine: async (data: CreateProductionLine): Promise<ProductionLine> => {
    const response = await fetch(`${API_BASE_URL}/production-lines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to create production line')
    }
    return response.json()
  },

  updateProductionLine: async (id: string, data: Partial<CreateProductionLine>): Promise<ProductionLine> => {
    const response = await fetch(`${API_BASE_URL}/production-lines/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to update production line')
    }
    return response.json()
  },

  getProductionLines: async (): Promise<ProductionLine[]> => {
    const response = await fetch(`${API_BASE_URL}/production-lines`)
    if (!response.ok) {
      throw new Error('Failed to fetch production lines')
    }
    return response.json()
  },

  getPublishedProductionLines: async (): Promise<ProductionLine[]> => {
    const response = await fetch(`${API_BASE_URL}/production-lines/published`)
    if (!response.ok) {
      throw new Error('Failed to fetch published production lines')
    }
    return response.json()
  },

  getProductionLine: async (id: string): Promise<ProductionLine> => {
    const response = await fetch(`${API_BASE_URL}/production-lines/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch production line')
    }
    return response.json()
  },

  deleteProductionLine: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/production-lines/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete production line')
    }
  },
}
