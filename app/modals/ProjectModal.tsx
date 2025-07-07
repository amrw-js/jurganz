'use client'

import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@heroui/react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { Project, ProjectFormData, ProjectMedia } from '@/types/project.types'

import { ImageUploader } from '../components/ImageUploader'

interface ProjectModalProps {
  project?: Project
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProjectFormData) => void
}

type FormData = {
  name: string
  description: string
  location: string
  capacity: string
  time: string
  companyName: string
  media: (File | ProjectMedia)[]
}

export function ProjectModal({ project, isOpen, onClose, onSubmit }: ProjectModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      location: '',
      capacity: '',
      time: '',
      companyName: '',
      media: [],
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (project && isOpen) {
      reset({
        name: project.name,
        description: project.description || '',
        location: project.location || '',
        capacity: project.capacity,
        time: project.time,
        media: project.media || [],
        companyName: project.companyName || '',
      })
    } else if (!project && isOpen) {
      reset({
        name: '',
        description: '',
        location: '',
        capacity: '',
        time: '',
        media: [],
        companyName: '',
      })
    }
  }, [project, isOpen, reset])

  const onFormSubmit = (data: FormData) => {
    try {
      // Filter out File objects and keep only uploaded ProjectMedia
      const uploadedMedia = data.media.filter((item): item is ProjectMedia => !('lastModified' in item) && 'id' in item)

      const submitData: ProjectFormData = {
        name: data.name,
        description: data.description || '',
        location: data.location || '',
        capacity: data.capacity,
        time: data.time,
        media: uploadedMedia,
        companyName: data.companyName,
      }

      onSubmit(submitData)
      handleClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleMediaChange = (newMedia: (File | ProjectMedia)[]) => {
    setValue('media', newMedia, { shouldValidate: true })
  }

  const handleUploadComplete = (uploadedMedia: ProjectMedia[]) => {
    // When upload completes, the ImageUploader already handles updating the media array
    console.log('Upload completed:', uploadedMedia)
  }

  const isEdit = !!project

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement='center'
      backdrop='opaque'
      size='4xl'
      scrollBehavior='inside'
      classNames={{
        backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
        base: 'max-h-[95vh]',
        wrapper: 'items-center',
      }}
    >
      <ModalContent className='max-w-5xl'>
        <>
          <ModalHeader className='flex flex-shrink-0 flex-col gap-1 px-6 py-4'>
            <h2 className='text-xl font-semibold'>{isEdit ? 'Edit Project' : 'Create New Project'}</h2>
            <p className='text-sm font-normal text-default-500'>
              {isEdit ? 'Update your project details below.' : 'Fill in the details for your new project.'}
            </p>
          </ModalHeader>

          <Divider />

          <form onSubmit={handleSubmit(onFormSubmit)} className='flex h-full min-h-0 flex-col'>
            <ModalBody className='min-h-0 flex-1 overflow-y-auto px-6 py-6'>
              <div className='flex flex-col gap-6'>
                {/* Company Information */}
                <div className='space-y-4'>
                  <div className='flex flex-col gap-1'>
                    <h3 className='text-lg font-medium text-foreground'>Company Information</h3>
                    <p className='text-sm text-default-500'>Basic company details for this project</p>
                  </div>

                  <Controller
                    name='companyName'
                    control={control}
                    rules={{
                      required: 'Company name is required',
                      minLength: {
                        value: 2,
                        message: 'Company name must be at least 2 characters',
                      },
                      maxLength: {
                        value: 100,
                        message: 'Company name cannot exceed 100 characters',
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9\s\-_&.,()]+$/,
                        message: 'Company name contains invalid characters',
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label='Company Name'
                        placeholder='Enter company name'
                        isInvalid={!!errors.companyName}
                        errorMessage={errors.companyName?.message}
                        variant='bordered'
                        labelPlacement='outside'
                        classNames={{ mainWrapper: 'mt-4' }}
                        description='Name of the company for this project'
                        isRequired
                      />
                    )}
                  />
                </div>

                <Divider />

                {/* Project Details */}
                <div className='space-y-4'>
                  <div className='flex flex-col gap-1'>
                    <h3 className='text-lg font-medium text-foreground'>Project Details</h3>
                    <p className='text-sm text-default-500'>Detailed information about your project</p>
                  </div>

                  {/* Project Name */}
                  <Controller
                    name='name'
                    control={control}
                    rules={{
                      required: 'Project name is required',
                      minLength: {
                        value: 2,
                        message: 'Project name must be at least 2 characters',
                      },
                      maxLength: {
                        value: 50,
                        message: 'Project name cannot exceed 50 characters',
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9\s\-_]+$/,
                        message: 'Project name can only contain letters, numbers, spaces, hyphens, and underscores',
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label='Project Name'
                        placeholder='Enter project name'
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}
                        classNames={{ mainWrapper: 'mt-4' }}
                        variant='bordered'
                        labelPlacement='outside'
                        description='Choose a descriptive name for your project'
                        isRequired
                      />
                    )}
                  />

                  {/* Description */}
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        label='Project Description'
                        placeholder='Describe your project in detail...'
                        isInvalid={!!errors.description}
                        errorMessage={errors.description?.message}
                        variant='bordered'
                        labelPlacement='outside'
                        description='Provide a detailed description of the project scope and objectives'
                        minRows={3}
                        maxRows={6}
                      />
                    )}
                  />

                  {/* Location and Capacity Grid */}
                  <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    <Controller
                      name='location'
                      control={control}
                      rules={{
                        maxLength: {
                          value: 100,
                          message: 'Location cannot exceed 100 characters',
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label='Project Location'
                          placeholder='Enter project location'
                          isInvalid={!!errors.location}
                          errorMessage={errors.location?.message}
                          variant='bordered'
                          labelPlacement='outside'
                          description='City, state, or full address'
                          startContent={
                            <svg
                              className='h-4 w-4 text-default-400'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                              />
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                              />
                            </svg>
                          }
                        />
                      )}
                    />

                    <Controller
                      name='capacity'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label='Project Capacity'
                          placeholder='Productivity capacity'
                          value={field.value?.toString() || ''}
                          isInvalid={!!errors.capacity}
                          errorMessage={errors.capacity?.message}
                          variant='bordered'
                          labelPlacement='outside'
                          description='Productivity capacity of the project'
                          startContent={
                            <svg
                              className='h-4 w-4 text-default-400'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                              />
                            </svg>
                          }
                        />
                      )}
                    />
                  </div>

                  {/* Time Estimate */}
                  <Controller
                    name='time'
                    control={control}
                    rules={{
                      required: 'Delivery time is required',
                      minLength: {
                        value: 2,
                        message: 'Delivery time must be at least 2 characters',
                      },
                      maxLength: {
                        value: 30,
                        message: 'Delivery time cannot exceed 30 characters',
                      },
                      pattern: {
                        value: /^[0-9]+\s*(hour|hours|day|days|week|weeks|month|months|year|years|h|d|w|m|y)$/i,
                        message: "Please use format like '2 hours', '3 days', '1 week'",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label='Delivery Time'
                        placeholder='e.g., 2 hours, 3 days, 1 week'
                        isInvalid={!!errors.time}
                        errorMessage={errors.time?.message}
                        variant='bordered'
                        labelPlacement='outside'
                        description='Estimated time to complete the project'
                        isRequired
                        classNames={{ mainWrapper: 'mt-4' }}
                        startContent={
                          <svg
                            className='h-4 w-4 text-default-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <circle cx={12} cy={12} r={10} />
                            <polyline points='12,6 12,12 16,14' />
                          </svg>
                        }
                      />
                    )}
                  />
                </div>

                <Divider />

                {/* Media Upload Section */}
                <div className='space-y-4'>
                  <div className='flex flex-col gap-1'>
                    <h3 className='text-lg font-medium text-foreground'>Project Media</h3>
                    <p className='text-sm text-default-500'>
                      Upload up to 20 photos or videos (max 10MB each). Files will be uploaded automatically.
                    </p>
                  </div>

                  <Controller
                    name='media'
                    control={control}
                    rules={{
                      validate: (media) => {
                        if (!media || media.length === 0) return true

                        const fileItems = media.filter((item): item is File => 'lastModified' in item)
                        const invalidFiles = fileItems.filter((file) => {
                          const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/')
                          const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
                          return !isValidType || !isValidSize
                        })

                        if (invalidFiles.length > 0) {
                          return 'Please upload only image or video files under 10MB'
                        }

                        if (media.length > 20) {
                          return 'Maximum 20 files allowed'
                        }

                        return true
                      },
                    }}
                    render={({ field }) => (
                      <ImageUploader
                        files={field.value || []}
                        onChange={handleMediaChange}
                        maxFiles={20}
                        maxFileSize={10 * 1024 * 1024} // 10MB
                        error={errors.media?.message}
                        disabled={isSubmitting}
                        acceptVideo={true}
                        onUploadComplete={handleUploadComplete}
                      />
                    )}
                  />
                </div>
              </div>
            </ModalBody>

            <Divider />

            <ModalFooter className='flex-shrink-0 px-6 py-4'>
              <Button color='danger' variant='light' onPress={handleClose} isDisabled={isSubmitting}>
                Cancel
              </Button>
              <Button color='primary' type='submit' isLoading={isSubmitting} isDisabled={!isValid}>
                {isEdit ? 'Update Project' : 'Create Project'}
              </Button>
            </ModalFooter>
          </form>
        </>
      </ModalContent>
    </Modal>
  )
}
