'use client'

import { useCallback, useEffect, useState } from 'react'

import type { ProductionLine, ProductionLineFormData, ProductionLineMedia } from '@/types/production-line.types'

const STORAGE_KEY = 'production-lines-data'

export const useProductionLines = () => {
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([])
  const [loading, setLoading] = useState(true)

  // Load production lines from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedLines = JSON.parse(stored)
        // Ensure dates are properly converted
        const linesWithDates = parsedLines.map((line: any) => ({
          ...line,
          createdAt: new Date(line.createdAt),
          updatedAt: new Date(line.updatedAt),
        }))
        setProductionLines(linesWithDates)
      }
    } catch (error) {
      console.error('Error loading production lines:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save production lines to localStorage whenever they change
  const saveProductionLines = useCallback((updatedLines: ProductionLine[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLines))
      setProductionLines(updatedLines)
    } catch (error) {
      console.error('Error saving production lines:', error)
    }
  }, [])

  // Convert File objects to ProductionLineMedia objects (simulate upload)
  const processFiles = useCallback(async (files: File[]): Promise<ProductionLineMedia[]> => {
    const processedMedia: ProductionLineMedia[] = []

    for (const file of files) {
      try {
        // Create object URL for preview (in real app, you'd upload to server/cloud)
        const url = URL.createObjectURL(file)

        // Determine file type
        const type = file.type.startsWith('video/') ? 'video' : 'image'

        const media: ProductionLineMedia = {
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

  const addProductionLine = useCallback(
    async (data: ProductionLineFormData) => {
      try {
        // Process uploaded files
        const processedMedia = await processFiles(data.photos || [])

        const newLine: ProductionLine = {
          id: Date.now().toString(),
          companyName: data.companyName,
          fullName: data.fullName,
          emailAddress: data.emailAddress,
          phoneNumber: data.phoneNumber,
          productType: data.productType,
          containerType: data.containerType,
          capacity: data.capacity,
          yearOfManufacturing: data.yearOfManufacturing,
          fillingProcess: data.fillingProcess,
          fillingType: data.fillingType,
          controlPLC: data.controlPLC,
          lineMachines: data.lineMachines,
          approximateWorkingTime: data.approximateWorkingTime,
          localCurrency: data.localCurrency,
          price: data.price,
          negotiable: data.negotiable,
          isAvailableNow: data.isAvailableNow,
          expectedAvailableDate: data.expectedAvailableDate,
          photos: processedMedia,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const updatedLines = [...productionLines, newLine]
        saveProductionLines(updatedLines)
        return newLine
      } catch (error) {
        console.error('Error adding production line:', error)
        throw error
      }
    },
    [productionLines, saveProductionLines, processFiles],
  )

  const updateProductionLine = useCallback(
    async (id: string, data: ProductionLineFormData) => {
      try {
        // Process any new uploaded files
        const processedMedia = await processFiles(data.photos || [])

        const updatedLines = productionLines.map((line) => {
          if (line.id === id) {
            // Merge existing photos with new ones
            const existingPhotos = line.photos || []
            const allPhotos = [...existingPhotos, ...processedMedia]

            return {
              ...line,
              companyName: data.companyName,
              fullName: data.fullName,
              emailAddress: data.emailAddress,
              phoneNumber: data.phoneNumber,
              productType: data.productType,
              containerType: data.containerType,
              capacity: data.capacity,
              yearOfManufacturing: data.yearOfManufacturing,
              fillingProcess: data.fillingProcess,
              fillingType: data.fillingType,
              controlPLC: data.controlPLC,
              lineMachines: data.lineMachines,
              approximateWorkingTime: data.approximateWorkingTime,
              localCurrency: data.localCurrency,
              price: data.price,
              negotiable: data.negotiable,
              isAvailableNow: data.isAvailableNow,
              expectedAvailableDate: data.expectedAvailableDate,
              photos: allPhotos,
              updatedAt: new Date(),
            }
          }
          return line
        })

        saveProductionLines(updatedLines)
      } catch (error) {
        console.error('Error updating production line:', error)
        throw error
      }
    },
    [productionLines, saveProductionLines, processFiles],
  )

  const deleteProductionLine = useCallback(
    (id: string) => {
      try {
        // Clean up object URLs before deleting
        const lineToDelete = productionLines.find((l) => l.id === id)
        if (lineToDelete?.photos) {
          lineToDelete.photos.forEach((photo) => {
            if (photo.url.startsWith('blob:')) {
              URL.revokeObjectURL(photo.url)
            }
          })
        }

        const updatedLines = productionLines.filter((line) => line.id !== id)
        saveProductionLines(updatedLines)
      } catch (error) {
        console.error('Error deleting production line:', error)
        throw error
      }
    },
    [productionLines, saveProductionLines],
  )

  const getProductionLine = useCallback(
    (id: string) => {
      return productionLines.find((line) => line.id === id)
    },
    [productionLines],
  )

  const searchProductionLines = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase()
      return productionLines.filter(
        (line) =>
          line.companyName.toLowerCase().includes(lowercaseQuery) ||
          line.productType.toLowerCase().includes(lowercaseQuery) ||
          line.containerType.toLowerCase().includes(lowercaseQuery),
      )
    },
    [productionLines],
  )

  // Cleanup function to revoke all object URLs
  const cleanup = useCallback(() => {
    productionLines.forEach((line) => {
      line.photos?.forEach((photo) => {
        if (photo.url.startsWith('blob:')) {
          URL.revokeObjectURL(photo.url)
        }
      })
    })
  }, [productionLines])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    // Data
    productionLines,
    loading,

    // CRUD operations
    addProductionLine,
    updateProductionLine,
    deleteProductionLine,
    getProductionLine,

    // Utility functions
    searchProductionLines,
    cleanup,
  }
}
