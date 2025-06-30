'use client'

import { Button, Card, CardBody, Image } from '@heroui/react'
import { FileImage, Play, Upload, Video, X } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'

import { MediaItem, ProjectMedia } from '@/types/project.types'

interface ImageUploaderProps {
  files: MediaItem[]
  onChange: (files: MediaItem[]) => void
  maxFiles?: number
  maxFileSize?: number // in bytes
  error?: string
  disabled?: boolean
  acceptVideo?: boolean
}

export function ImageUploader({
  files,
  onChange,
  maxFiles = 20,
  maxFileSize = 10 * 1024 * 1024, // 10MB for videos
  error,
  disabled = false,
  acceptVideo = true,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  console.log({ files })
  // Helper function to check if item is a File
  const isFile = (item: MediaItem): item is File => {
    return item instanceof File
  }

  // Helper function to check if item is ProjectMedia
  const isProjectMedia = (item: MediaItem): item is ProjectMedia => {
    return !isFile(item) && 'id' in item && 'url' in item
  }

  // Update preview URLs when files change
  useEffect(() => {
    // Cleanup previous URLs (only for File objects)
    previewUrls.forEach((url, index) => {
      if (isFile(files[index])) {
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

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList || disabled) return

    const validFiles = Array.from(fileList).filter((file) => {
      const isValidType = isValidFileType(file)
      const isValidSize = file.size <= maxFileSize
      return isValidType && isValidSize
    })

    const newFiles = [...files, ...validFiles].slice(0, maxFiles)
    onChange(newFiles)
  }

  const removeFile = (index: number) => {
    if (disabled) return
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newFiles)
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

  const renderFilePreview = (item: MediaItem, url: string, index: number) => {
    const mediaType = getMediaType(item)
    const mediaName = getMediaName(item)
    const isVideo = mediaType === 'video'
    const isExisting = isProjectMedia(item)

    return (
      <div key={isExisting ? item.id : index} className='group relative'>
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
                {isExisting && (
                  <div className='absolute left-1 top-1 rounded bg-blue-500/90 px-1 text-xs text-white'>Saved</div>
                )}
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
                {isExisting && (
                  <div className='absolute left-1 top-1 rounded bg-blue-500/90 px-1 text-xs text-white'>Saved</div>
                )}
              </div>
            )}

            {/* Overlay for better button visibility */}
            <div className='absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20' />
            <Button
              isIconOnly
              size='sm'
              color='danger'
              variant='solid'
              className='absolute right-1 top-1 z-10 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100'
              onPress={() => removeFile(index)}
              isDisabled={disabled}
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

      {error && <p className='text-sm text-danger'>{error}</p>}

      {/* File Previews */}
      {previewUrls.length > 0 && (
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-foreground'>
              Uploaded Files ({files.length}/{maxFiles})
            </p>
            {files.length > 0 && (
              <Button size='sm' color='danger' variant='light' onPress={() => onChange([])} isDisabled={disabled}>
                Clear All
              </Button>
            )}
          </div>

          {/* Scrollable grid container */}
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
