'use client'

import { useCallback, useState } from 'react'

import { API_BASE_URL } from '../utils/constants'

export interface UploadResponse {
  id: string
  url: string
  type: 'IMAGE' | 'VIDEO'
  name: string
  size: number
  createdAt: string
}

export interface BlogMedia {
  id: string
  url: string
  type: 'image' | 'video'
  name: string
  size?: number
  createdAt?: Date
}

interface UseUploadOptions {
  onSuccess?: (media: BlogMedia[]) => void
  onError?: (error: string) => void
  onProgress?: (progress: number) => void
}

export function useUpload(options: UseUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const convertResponseToBlogMedia = (response: UploadResponse): BlogMedia => ({
    id: response.id,
    url: response.url,
    type: response.type.toLowerCase() as 'image' | 'video',
    name: response.name,
    size: response.size,
    createdAt: new Date(response.createdAt),
  })

  const uploadSingle = useCallback(
    async (file: File): Promise<BlogMedia | null> => {
      setIsUploading(true)
      setError(null)
      setProgress(0)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const xhr = new XMLHttpRequest()

        return new Promise((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progressPercent = Math.round((event.loaded / event.total) * 100)
              setProgress(progressPercent)
              options.onProgress?.(progressPercent)
            }
          })

          xhr.addEventListener('load', () => {
            if (xhr.status === 200 || xhr.status === 201) {
              try {
                const response: UploadResponse = JSON.parse(xhr.responseText)
                const blogMedia = convertResponseToBlogMedia(response)
                options.onSuccess?.([blogMedia])
                resolve(blogMedia)
              } catch (parseError) {
                const errorMsg = 'Failed to parse upload response'
                setError(errorMsg)
                options.onError?.(errorMsg)
                reject(new Error(errorMsg))
              }
            } else {
              const errorMsg = `Upload failed with status ${xhr.status}`
              setError(errorMsg)
              options.onError?.(errorMsg)
              reject(new Error(errorMsg))
            }
          })

          xhr.addEventListener('error', () => {
            const errorMsg = 'Upload failed due to network error'
            setError(errorMsg)
            options.onError?.(errorMsg)
            reject(new Error(errorMsg))
          })

          xhr.open('POST', `${API_BASE_URL}/upload/media/single`)
          xhr.send(formData)
        })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed'
        setError(errorMsg)
        options.onError?.(errorMsg)
        return null
      } finally {
        setIsUploading(false)
        setProgress(0)
      }
    },
    [options],
  )

  const uploadMultiple = useCallback(
    async (files: File[]): Promise<BlogMedia[]> => {
      if (files.length === 0) return []

      setIsUploading(true)
      setError(null)
      setProgress(0)

      try {
        const formData = new FormData()
        files.forEach((file) => {
          formData.append('files', file)
        })

        const xhr = new XMLHttpRequest()

        return new Promise((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progressPercent = Math.round((event.loaded / event.total) * 100)
              setProgress(progressPercent)
              options.onProgress?.(progressPercent)
            }
          })

          xhr.addEventListener('load', () => {
            if (xhr.status === 200 || xhr.status === 201) {
              try {
                const responses: UploadResponse[] = JSON.parse(xhr.responseText)
                const blogMediaArray = responses.map(convertResponseToBlogMedia)
                options.onSuccess?.(blogMediaArray)
                resolve(blogMediaArray)
              } catch (parseError) {
                const errorMsg = 'Failed to parse upload response'
                setError(errorMsg)
                options.onError?.(errorMsg)
                reject(new Error(errorMsg))
              }
            } else {
              const errorMsg = `Upload failed with status ${xhr.status}`
              setError(errorMsg)
              options.onError?.(errorMsg)
              reject(new Error(errorMsg))
            }
          })

          xhr.addEventListener('error', () => {
            const errorMsg = 'Upload failed due to network error'
            setError(errorMsg)
            options.onError?.(errorMsg)
            reject(new Error(errorMsg))
          })

          xhr.open('POST', `${API_BASE_URL}/upload/media/multiple`)
          xhr.send(formData)
        })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed'
        setError(errorMsg)
        options.onError?.(errorMsg)
        return []
      } finally {
        setIsUploading(false)
        setProgress(0)
      }
    },
    [options],
  )

  const reset = useCallback(() => {
    setError(null)
    setProgress(0)
    setIsUploading(false)
  }, [])

  return {
    uploadSingle,
    uploadMultiple,
    isUploading,
    progress,
    error,
    reset,
  }
}
