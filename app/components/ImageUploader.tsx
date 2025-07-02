'use client'

import { Button, Card, CardBody, Image, Progress } from '@heroui/react'
import { AlertCircle, CheckCircle, Clock, FileImage, Play, Upload, Video, X } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import type { BlogMedia } from '@/types/blog.types'

import { useUpload } from '../hooks/useUpload'

export type MediaItem = File | BlogMedia

interface UploadStatus {
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
}

interface ImageUploaderProps {
  files: MediaItem[]
  onChange: (files: MediaItem[]) => void
  maxFiles?: number
  maxFileSize?: number
  error?: string
  disabled?: boolean
  acceptVideo?: boolean
  onUploadComplete?: (uploadedMedia: BlogMedia[]) => void
}

export function ImageUploader({
  files,
  onChange,
  maxFiles = 20,
  maxFileSize = 10 * 1024 * 1024,
  error,
  disabled = false,
  acceptVideo = true,
  onUploadComplete,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploadStatuses, setUploadStatuses] = useState<Map<string, UploadStatus>>(new Map())
  const initialFilesRef = useRef<MediaItem[]>([])

  // Store initial files to prevent removal on re-render
  useEffect(() => {
    if (files.length > 0 && initialFilesRef.current.length === 0) {
      initialFilesRef.current = [...files]
    }
  }, [files])

  const {
    uploadMultiple,
    isUploading,
    progress,
    error: uploadError,
  } = useUpload({
    onSuccess: (uploadedMedia) => {
      // Keep existing media and add new uploaded media
      const existingMedia = files.filter((f): f is BlogMedia => !isFile(f))
      const newFiles = [...existingMedia, ...uploadedMedia]
      onChange(newFiles)
      onUploadComplete?.(uploadedMedia)

      // Update statuses to success
      const newStatuses = new Map(uploadStatuses)
      uploadedMedia.forEach((media) => {
        newStatuses.set(media.id, { status: 'success' })
      })
      setUploadStatuses(newStatuses)
    },
    onError: (errorMsg) => {
      console.error('Upload error:', errorMsg)
      // Update status for failed uploads
      const newStatuses = new Map(uploadStatuses)
      files.filter(isFile).forEach((file, index) => {
        const key = getFileKey(file, index)
        newStatuses.set(key, { status: 'error', error: errorMsg })
      })
      setUploadStatuses(newStatuses)
    },
    onProgress: (progressPercent) => {
      // Update progress for uploading files
      const newStatuses = new Map(uploadStatuses)
      files.filter(isFile).forEach((file, index) => {
        const key = getFileKey(file, index)
        if (uploadStatuses.get(key)?.status === 'uploading') {
          newStatuses.set(key, { status: 'uploading', progress: progressPercent })
        }
      })
      setUploadStatuses(newStatuses)
    },
  })

  const isFile = (item: MediaItem): item is File => {
    return item instanceof File
  }

  const isBlogMedia = (item: MediaItem): item is BlogMedia => {
    return !isFile(item) && 'id' in item && 'url' in item
  }

  // Update preview URLs when files change
  useEffect(() => {
    // Cleanup previous URLs (only for File objects)
    previewUrls.forEach((url, index) => {
      if (files[index] && isFile(files[index])) {
        URL.revokeObjectURL(url)
      }
    })

    if (files && files.length > 0) {
      const urls = files.map((item) => {
        if (isFile(item)) {
          return URL.createObjectURL(item)
        } else {
          return item.url
        }
      })
      setPreviewUrls(urls)
    } else {
      setPreviewUrls([])
    }

    // Cleanup on unmount
    return () => {
      previewUrls.forEach((url, index) => {
        if (files[index] && isFile(files[index])) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [files])

  const isValidFileType = (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isVideo = acceptVideo && file.type.startsWith('video/')
    return isImage || isVideo
  }

  const handleFileSelect = async (fileList: FileList | null) => {
    if (!fileList || disabled) return

    const validFiles = Array.from(fileList).filter((file) => {
      const isValidType = isValidFileType(file)
      const isValidSize = file.size <= maxFileSize
      return isValidType && isValidSize
    })

    if (validFiles.length === 0) return

    // Check available slots
    const availableSlots = maxFiles - files.length
    const filesToAdd = validFiles.slice(0, availableSlots)

    // Add files to the display list first
    const newFiles = [...files, ...filesToAdd]
    onChange(newFiles)

    // Set uploading status for new files
    const newStatuses = new Map(uploadStatuses)
    filesToAdd.forEach((file, index) => {
      const key = getFileKey(file, files.length + index)
      newStatuses.set(key, { status: 'uploading', progress: 0 })
    })
    setUploadStatuses(newStatuses)

    // Auto-upload immediately
    try {
      await uploadMultiple(filesToAdd)
    } catch (error) {
      console.error('Auto-upload failed:', error)
    }
  }

  const removeFile = (index: number) => {
    if (disabled || isUploading) return

    const fileToRemove = files[index]
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newFiles)

    // Remove status for this file
    const newStatuses = new Map(uploadStatuses)
    const key = getFileKey(fileToRemove, index)
    newStatuses.delete(key)
    setUploadStatuses(newStatuses)
  }

  const getFileKey = (item: MediaItem, index: number): string => {
    if (isBlogMedia(item)) {
      return item.id
    }
    return `file-${item.name}-${index}`
  }

  const getUploadStatus = (item: MediaItem, index: number): UploadStatus => {
    const key = getFileKey(item, index)
    return uploadStatuses.get(key) || { status: isBlogMedia(item) ? 'success' : 'pending' }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const canAddMore = files.length < maxFiles
  const acceptTypes = acceptVideo ? 'image/*,video/*' : 'image/*'
  const fileTypeText = acceptVideo ? 'photos or videos' : 'photos'
  const formatText = acceptVideo ? 'PNG, JPG, GIF, MP4, MOV' : 'PNG, JPG, GIF'

  const getMediaType = (item: MediaItem): 'image' | 'video' => {
    if (isFile(item)) {
      return item.type.startsWith('video/') ? 'video' : 'image'
    } else {
      return item.type
    }
  }

  const getMediaName = (item: MediaItem): string => {
    if (isFile(item)) {
      return item.name
    } else {
      return item.name
    }
  }

  const renderStatusIcon = (status: UploadStatus) => {
    switch (status.status) {
      case 'pending':
        return <Clock className='h-3 w-3 text-warning' />
      case 'uploading':
        return <Clock className='h-3 w-3 animate-spin text-primary' />
      case 'success':
        return <CheckCircle className='h-3 w-3 text-success' />
      case 'error':
        return <AlertCircle className='h-3 w-3 text-danger' />
      default:
        return null
    }
  }

  const renderFilePreview = (item: MediaItem, url: string, index: number) => {
    const mediaType = getMediaType(item)
    const mediaName = getMediaName(item)
    const isVideo = mediaType === 'video'
    const isExisting = isBlogMedia(item)
    const uploadStatus = getUploadStatus(item, index)

    return (
      <div key={isExisting ? item.id : `${item.name || 'file'}-${index}`} className='group relative'>
        <Card className='overflow-hidden'>
          <CardBody className='relative p-0'>
            {isVideo ? (
              <div className='relative flex h-20 w-full items-center justify-center bg-default-100'>
                <video
                  src={url}
                  className='h-full w-full object-cover'
                  muted
                  preload='metadata'
                  crossOrigin='anonymous'
                />
                <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                  <div className='rounded-full bg-white/90 p-1'>
                    <Play className='h-4 w-4 text-default-700' fill='currentColor' />
                  </div>
                </div>
                <div className='absolute bottom-1 left-1 flex items-center gap-1 rounded bg-black/70 px-1 text-xs text-white'>
                  <Video className='h-3 w-3' />
                  <span>Video</span>
                </div>
              </div>
            ) : (
              <div className='relative'>
                <Image
                  src={url || '/placeholder.svg'}
                  alt={`Preview ${index + 1}`}
                  className='h-20 w-full object-cover'
                  classNames={{
                    wrapper: 'w-full h-20',
                    img: 'w-full h-full object-cover',
                  }}
                />
                <div className='absolute bottom-1 left-1 flex items-center gap-1 rounded bg-black/70 px-1 text-xs text-white'>
                  <FileImage className='h-3 w-3' />
                  <span>Image</span>
                </div>
              </div>
            )}

            {/* Upload Status Indicator */}
            <div className='absolute left-1 top-1 flex items-center gap-1'>
              {isExisting ? (
                <div className='rounded bg-success/90 px-1 text-xs text-white'>Saved</div>
              ) : (
                <div
                  className={`flex items-center gap-1 rounded px-1 text-xs text-white ${
                    uploadStatus.status === 'success'
                      ? 'bg-success/90'
                      : uploadStatus.status === 'error'
                        ? 'bg-danger/90'
                        : uploadStatus.status === 'uploading'
                          ? 'bg-primary/90'
                          : 'bg-warning/90'
                  }`}
                >
                  {renderStatusIcon(uploadStatus)}
                  <span className='capitalize'>
                    {uploadStatus.status === 'uploading' && uploadStatus.progress
                      ? `${uploadStatus.progress}%`
                      : uploadStatus.status}
                  </span>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploadStatus.status === 'uploading' && uploadStatus.progress !== undefined && (
              <div className='absolute bottom-0 left-0 right-0'>
                <Progress value={uploadStatus.progress} size='sm' color='primary' className='w-full' />
              </div>
            )}

            <div className='absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20' />
            <Button
              isIconOnly
              size='sm'
              color='danger'
              variant='solid'
              className='absolute right-1 top-1 z-10 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100'
              onPress={() => removeFile(index)}
              isDisabled={disabled || uploadStatus.status === 'uploading'}
            >
              <X className='h-3 w-3' />
            </Button>
          </CardBody>
        </Card>
        <div className='absolute -bottom-6 left-0 right-0 truncate text-center text-xs text-default-500'>
          {mediaName}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Upload Area */}
      {canAddMore && (
        <Card
          className={`border-2 border-dashed transition-colors ${
            disabled
              ? 'cursor-not-allowed border-default-200 opacity-50'
              : dragActive
                ? 'cursor-pointer border-primary bg-primary/5'
                : 'cursor-pointer border-default-300 hover:border-default-400'
          }`}
          isPressable={!disabled}
          onPress={() => !disabled && document.getElementById('media-upload-input')?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardBody className='flex flex-col items-center justify-center py-6 text-center'>
            <Upload className={`mb-2 h-8 w-8 ${disabled ? 'text-default-300' : 'text-default-400'}`} />
            <p className={`text-sm font-medium ${disabled ? 'text-default-400' : 'text-default-600'}`}>
              {disabled ? 'Upload disabled' : `Drop ${fileTypeText} here or click to browse`}
            </p>
            <p className='mt-1 text-xs text-default-400'>
              {formatText} up to {Math.round(maxFileSize / (1024 * 1024))}MB each
            </p>
            <p className='text-xs text-default-400'>
              {files.length}/{maxFiles} files uploaded
            </p>
            <p className='mt-1 text-xs text-primary'>Files will be uploaded automatically</p>
          </CardBody>
        </Card>
      )}

      <input
        id='media-upload-input'
        type='file'
        multiple
        accept={acceptTypes}
        className='hidden'
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={disabled}
      />

      {(error || uploadError) && <p className='text-sm text-danger'>{error || uploadError}</p>}

      {/* Upload Progress Indicator */}
      {isUploading && (
        <div className='flex items-center justify-center gap-2 rounded-lg bg-primary/10 p-3'>
          <Clock className='h-4 w-4 animate-spin text-primary' />
          <span className='text-sm text-primary'>Uploading files... {progress}%</span>
        </div>
      )}

      {/* File Previews */}
      {previewUrls.length > 0 && (
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-foreground'>
              Media Files ({files.length}/{maxFiles})
            </p>
            {files.length > 0 && (
              <Button
                size='sm'
                color='danger'
                variant='light'
                onPress={() => {
                  onChange([])
                  setUploadStatuses(new Map())
                }}
                isDisabled={disabled || isUploading}
              >
                Clear All
              </Button>
            )}
          </div>

          <div className='rounded-lg border border-default-200 bg-default-50/50 p-3'>
            <div className='scrollbar-thin scrollbar-thumb-default-300 scrollbar-track-transparent grid max-h-32 grid-cols-2 gap-3 overflow-y-auto pb-6 pr-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
              {files.map((item, index) => renderFilePreview(item, previewUrls[index], index))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
