'use client'

import {
  ArrowPathIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  PhotoIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import {
  Button,
  Card,
  CardBody,
  Chip,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
} from '@heroui/react'
import type React from 'react'
import { useState } from 'react'

import { API_BASE_URL } from '../utils/constants'

interface UploadError {
  type: 'network' | 'server' | 'file' | 'timeout' | 'abort' | 'unknown'
  message: string
  code?: string | number
  retryable: boolean
}

interface MediaUploadModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onImageSelect: (imageUrl: string) => void
}

export default function MediaUploadModal({ isOpen, onOpenChange, onImageSelect }: MediaUploadModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadSpeed, setUploadSpeed] = useState<string>('')
  const [fileSize, setFileSize] = useState<string>('')
  const [startTime, setStartTime] = useState<number>(0)
  const [uploadError, setUploadError] = useState<UploadError | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [currentFile, setCurrentFile] = useState<File | null>(null)

  const maxRetries = 3

  const getErrorDetails = (error: any, status?: number): UploadError => {
    // Network errors
    if (error.message?.includes('Network') || error.message?.includes('fetch')) {
      return {
        type: 'network',
        message: 'Network connection failed. Please check your internet connection.',
        retryable: true,
      }
    }

    // Timeout errors
    if (error.message?.includes('timeout')) {
      return {
        type: 'timeout',
        message: 'Upload timed out. The file might be too large or your connection is slow.',
        retryable: true,
      }
    }

    // Server errors based on status code
    if (status) {
      switch (status) {
        case 413:
          return {
            type: 'file',
            message: 'File is too large. Please choose a smaller image (max 10MB).',
            code: status,
            retryable: false,
          }
        case 415:
          return {
            type: 'file',
            message: 'File type not supported. Please use PNG, JPG, or GIF format.',
            code: status,
            retryable: false,
          }
        case 429:
          return {
            type: 'server',
            message: 'Too many uploads. Please wait a moment and try again.',
            code: status,
            retryable: true,
          }
        case 500:
          return {
            type: 'server',
            message: 'Server error occurred. Please try again later.',
            code: status,
            retryable: true,
          }
        case 503:
          return {
            type: 'server',
            message: 'Service temporarily unavailable. Please try again later.',
            code: status,
            retryable: true,
          }
        default:
          return {
            type: 'server',
            message: `Upload failed with error ${status}. Please try again.`,
            code: status,
            retryable: true,
          }
      }
    }

    // Abort errors
    if (error.message?.includes('abort')) {
      return {
        type: 'abort',
        message: 'Upload was cancelled.',
        retryable: false,
      }
    }

    // Default unknown error
    return {
      type: 'unknown',
      message: 'An unexpected error occurred. Please try again.',
      retryable: true,
    }
  }

  const handleFileUpload = async (file: File, isRetry = false) => {
    if (!isRetry) {
      setCurrentFile(file)
      setRetryCount(0)
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadError(null)
    setStartTime(Date.now())
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()

      // Set timeout (30 seconds)
      xhr.timeout = 30000

      // Track upload progress with speed calculation
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(percentComplete)

          // Calculate upload speed
          const elapsed = (Date.now() - startTime) / 1000 // seconds
          if (elapsed > 0) {
            const speed = event.loaded / elapsed / (1024 * 1024) // MB/s
            setUploadSpeed(`${speed.toFixed(1)} MB/s`)
          }
        }
      })

      // Handle completion
      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText)
              if (result.url) {
                resolve(result.url)
              } else {
                reject(new Error('No URL in response'))
              }
            } catch (e) {
              reject(new Error('Invalid response format'))
            }
          } else {
            reject({ message: `HTTP ${xhr.status}`, status: xhr.status })
          }
        }

        xhr.onerror = () => reject(new Error('Network error during upload'))
        xhr.onabort = () => reject(new Error('Upload was aborted'))
        xhr.ontimeout = () => reject(new Error('Upload timeout'))
      })

      // Start the upload
      xhr.open('POST', `${API_BASE_URL}/upload/media/single`)
      xhr.send(formData)

      // Wait for completion
      const uploadedUrl = await uploadPromise
      setUploadedImage(uploadedUrl)
      setUploadError(null)
    } catch (error: any) {
      console.error('Upload error:', error)
      const errorDetails = getErrorDetails(error, error.status)
      setUploadError(errorDetails)
      setUploadProgress(0)
      setUploadSpeed('')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRetry = () => {
    if (currentFile && retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1)
      handleFileUpload(currentFile, true)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError({
          type: 'file',
          message: 'Please select an image file (PNG, JPG, GIF).',
          retryable: false,
        })
        return
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError({
          type: 'file',
          message: 'File is too large. Please choose an image smaller than 10MB.',
          retryable: false,
        })
        return
      }

      handleFileUpload(file)
    }
  }

  const handleInsertImage = () => {
    const urlToInsert = uploadedImage || imageUrl
    if (urlToInsert) {
      onImageSelect(urlToInsert)
      // Reset state
      resetState()
      onOpenChange(false)
    }
  }

  const resetState = () => {
    setImageUrl('')
    setUploadedImage(null)
    setUploadProgress(0)
    setUploadError(null)
    setRetryCount(0)
    setCurrentFile(null)
    setUploadSpeed('')
    setFileSize('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError({
          type: 'file',
          message: 'Please drop an image file (PNG, JPG, GIF).',
          retryable: false,
        })
        return
      }
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const getErrorIcon = (type: UploadError['type']) => {
    switch (type) {
      case 'network':
      case 'timeout':
        return <ExclamationTriangleIcon className='h-5 w-5' />
      case 'server':
        return <XCircleIcon className='h-5 w-5' />
      case 'file':
        return <ExclamationTriangleIcon className='h-5 w-5' />
      default:
        return <XCircleIcon className='h-5 w-5' />
    }
  }

  const getErrorColor = (type: UploadError['type']) => {
    switch (type) {
      case 'network':
      case 'timeout':
        return 'warning'
      case 'file':
        return 'danger'
      default:
        return 'danger'
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>Insert Image</ModalHeader>
            <ModalBody>
              {/* Tab Navigation */}
              <div className='mb-4 flex gap-2'>
                <Button
                  variant={activeTab === 'upload' ? 'solid' : 'bordered'}
                  color={activeTab === 'upload' ? 'primary' : 'default'}
                  onPress={() => {
                    setActiveTab('upload')
                    setUploadError(null)
                  }}
                  startContent={<ArrowUpIcon className='h-4 w-4' />}
                >
                  Upload File
                </Button>
                <Button
                  variant={activeTab === 'url' ? 'solid' : 'bordered'}
                  color={activeTab === 'url' ? 'primary' : 'default'}
                  onPress={() => {
                    setActiveTab('url')
                    setUploadError(null)
                  }}
                  startContent={<LinkIcon className='h-4 w-4' />}
                >
                  From URL
                </Button>
              </div>

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div className='space-y-4'>
                  {/* Error Display */}
                  {uploadError && (
                    <Card className={`border-${getErrorColor(uploadError.type)}`}>
                      <CardBody className='py-4'>
                        <div className='flex items-start gap-3'>
                          <div className={`text-${getErrorColor(uploadError.type)} mt-0.5`}>
                            {getErrorIcon(uploadError.type)}
                          </div>
                          <div className='flex-1'>
                            <div className='mb-2 flex items-center gap-2'>
                              <Chip size='sm' color={getErrorColor(uploadError.type)} variant='flat'>
                                {uploadError.type.toUpperCase()} ERROR
                              </Chip>
                              {uploadError.code && (
                                <Chip size='sm' variant='flat'>
                                  Code: {uploadError.code}
                                </Chip>
                              )}
                            </div>
                            <p className={`text-${getErrorColor(uploadError.type)} mb-2 font-medium`}>
                              {uploadError.message}
                            </p>
                            {uploadError.retryable && (
                              <div className='flex items-center gap-3'>
                                <Button
                                  size='sm'
                                  color='primary'
                                  variant='bordered'
                                  onPress={handleRetry}
                                  isDisabled={retryCount >= maxRetries}
                                  startContent={<ArrowPathIcon className='h-4 w-4' />}
                                >
                                  {retryCount >= maxRetries
                                    ? 'Max Retries Reached'
                                    : `Retry (${retryCount}/${maxRetries})`}
                                </Button>
                                <Button
                                  size='sm'
                                  variant='light'
                                  onPress={() => {
                                    resetState()
                                    document.getElementById('image-upload')?.click()
                                  }}
                                >
                                  Choose Different File
                                </Button>
                              </div>
                            )}
                            {!uploadError.retryable && (
                              <Button
                                size='sm'
                                color='primary'
                                variant='bordered'
                                onPress={() => {
                                  resetState()
                                  document.getElementById('image-upload')?.click()
                                }}
                              >
                                Choose Different File
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {!uploadedImage && !isUploading && !uploadError && (
                    <Card
                      isPressable
                      className='border-2 border-dashed border-default-300 hover:border-primary'
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <CardBody className='flex flex-col items-center justify-center py-12'>
                        <PhotoIcon className='mb-4 h-12 w-12 text-default-400' />
                        <p className='mb-2 text-lg font-medium'>Drop image here or click to browse</p>
                        <p className='mb-4 text-sm text-default-500'>PNG, JPG, GIF up to 10MB</p>
                        <Button
                          color='primary'
                          variant='bordered'
                          onPress={() => document.getElementById('image-upload')?.click()}
                        >
                          Choose File
                        </Button>
                        <input
                          id='image-upload'
                          type='file'
                          accept='image/*'
                          className='hidden'
                          onChange={handleFileSelect}
                        />
                      </CardBody>
                    </Card>
                  )}

                  {isUploading && (
                    <Card>
                      <CardBody className='py-8'>
                        <div className='space-y-4 text-center'>
                          <div className='flex items-center justify-center'>
                            <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
                          </div>
                          <div>
                            <p className='mb-2 font-medium'>Uploading image...</p>
                            <div className='mb-2 flex justify-between text-sm text-default-500'>
                              <span>Size: {fileSize}</span>
                              {uploadSpeed && <span>Speed: {uploadSpeed}</span>}
                            </div>
                            <Progress
                              value={uploadProgress}
                              color='primary'
                              className='mx-auto max-w-md'
                              showValueLabel={true}
                              formatOptions={{
                                style: 'percent',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }}
                            />
                            <p className='mt-2 text-sm text-default-500'>
                              {uploadProgress < 100 ? `${uploadProgress}% uploaded` : 'Processing...'}
                            </p>
                            {retryCount > 0 && (
                              <Chip size='sm' color='warning' variant='flat' className='mt-2'>
                                Retry attempt {retryCount}/{maxRetries}
                              </Chip>
                            )}
                          </div>
                          <Button
                            size='sm'
                            variant='light'
                            color='danger'
                            onPress={() => {
                              setIsUploading(false)
                              setUploadProgress(0)
                              setUploadSpeed('')
                            }}
                          >
                            Cancel Upload
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {uploadedImage && (
                    <Card className='border-success'>
                      <CardBody>
                        <div className='text-center'>
                          <div className='mb-4 flex items-center justify-center gap-2'>
                            <CheckCircleIcon className='h-5 w-5 text-success' />
                            <Chip color='success' variant='flat'>
                              UPLOAD SUCCESSFUL
                            </Chip>
                          </div>
                          <Image
                            src={uploadedImage || '/placeholder.svg'}
                            alt='Uploaded image'
                            className='mx-auto mb-4 max-h-64'
                          />
                          <p className='font-medium text-success'>Image uploaded successfully!</p>
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>
              )}

              {/* URL Tab */}
              {activeTab === 'url' && (
                <div className='space-y-4'>
                  <Input
                    label='Image URL'
                    placeholder='https://example.com/image.jpg'
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    startContent={<LinkIcon className='h-4 w-4 text-default-400' />}
                  />
                  {imageUrl && (
                    <Card>
                      <CardBody>
                        <div className='text-center'>
                          <Image
                            src={imageUrl || '/placeholder.svg'}
                            alt='Preview'
                            className='mx-auto max-h-64'
                            fallbackSrc='/placeholder.svg?height=200&width=300'
                          />
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant='light'
                onPress={() => {
                  resetState()
                  onClose()
                }}
              >
                Cancel
              </Button>
              <Button
                color='primary'
                onPress={handleInsertImage}
                isDisabled={!uploadedImage && !imageUrl}
                isLoading={isUploading}
              >
                Insert Image
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
