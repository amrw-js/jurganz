'use client'

import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { Project, ProjectFormData } from '@/types/project.types'

import { ImageUploader } from '../components/ImageUploader'

interface ProjectModalProps {
  project?: Project
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProjectFormData) => void
}

type FormData = {
  name: string
  capacity: number
  time: string
  photos: File[]
}

export function ProjectModal({ project, isOpen, onClose, onSubmit }: ProjectModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      capacity: 1,
      time: '',
      photos: [],
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        capacity: project.capacity,
        time: project.time,
        photos: [], // Reset photos for existing projects
      })
    } else {
      reset({
        name: '',
        capacity: 1,
        time: '',
        photos: [],
      })
    }
  }, [project, isOpen, reset])

  const onFormSubmit = async (data: FormData) => {
    try {
      const submitData: ProjectFormData = {
        name: data.name,
        capacity: data.capacity,
        time: data.time,
        photos: data.photos,
      }
      await onSubmit(submitData)
      handleClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const isEdit = !!project

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement='center'
      backdrop='opaque'
      size='3xl'
      scrollBehavior='inside'
      classNames={{
        backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
        base: 'max-h-[95vh]',
        wrapper: 'items-center',
      }}
    >
      <ModalContent className='max-w-4xl'>
        {(onClose) => (
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
                  {/* Basic Information */}
                  <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
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
                          variant='bordered'
                          labelPlacement='outside'
                          description='Choose a descriptive name for your project'
                          isRequired
                        />
                      )}
                    />

                    <Controller
                      name='capacity'
                      control={control}
                      rules={{
                        required: 'Team capacity is required',
                        min: {
                          value: 1,
                          message: 'Capacity must be at least 1',
                        },
                        max: {
                          value: 1000,
                          message: 'Capacity cannot exceed 1000',
                        },
                        validate: (value) => {
                          if (!Number.isInteger(Number(value))) {
                            return 'Capacity must be a whole number'
                          }
                          return true
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label='Team Capacity'
                          placeholder='Number of team members'
                          type='number'
                          min='1'
                          max='1000'
                          value={field.value?.toString() || ''}
                          onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                          isInvalid={!!errors.capacity}
                          errorMessage={errors.capacity?.message}
                          variant='bordered'
                          labelPlacement='outside'
                          description='Maximum number of team members'
                          isRequired
                        />
                      )}
                    />
                  </div>

                  <Controller
                    name='time'
                    control={control}
                    rules={{
                      required: 'Time estimate is required',
                      minLength: {
                        value: 2,
                        message: 'Time estimate must be at least 2 characters',
                      },
                      maxLength: {
                        value: 30,
                        message: 'Time estimate cannot exceed 30 characters',
                      },
                      pattern: {
                        value: /^[0-9]+\s*(hour|hours|day|days|week|weeks|month|months|year|years|h|d|w|m|y)$/i,
                        message: "Please use format like '2 hours', '3 days', '1 week'",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label='Time Estimate'
                        placeholder='e.g., 2 hours, 3 days, 1 week'
                        isInvalid={!!errors.time}
                        errorMessage={errors.time?.message}
                        variant='bordered'
                        labelPlacement='outside'
                        description='Estimated time to complete the project'
                        isRequired
                      />
                    )}
                  />

                  {/* Media Upload Section */}
                  <div className='space-y-3'>
                    <div className='flex flex-col gap-1'>
                      <label className='text-sm font-medium text-foreground'>Project Media</label>
                      <p className='text-xs text-default-500'>
                        Upload up to 20 photos or videos (max 10MB each). Drag and drop or click to browse.
                      </p>
                    </div>

                    <Controller
                      name='photos'
                      control={control}
                      rules={{
                        validate: (files) => {
                          if (!files || files.length === 0) return true

                          const invalidFiles = files.filter((file) => {
                            const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/')
                            const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
                            return !isValidType || !isValidSize
                          })

                          if (invalidFiles.length > 0) {
                            return 'Please upload only image or video files under 10MB'
                          }

                          if (files.length > 20) {
                            return 'Maximum 20 files allowed'
                          }

                          return true
                        },
                      }}
                      render={({ field }) => (
                        <ImageUploader
                          files={field.value || []}
                          onChange={field.onChange}
                          maxFiles={20}
                          maxFileSize={10 * 1024 * 1024} // 10MB
                          error={errors.photos?.message}
                          disabled={isSubmitting}
                          acceptVideo={true}
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
        )}
      </ModalContent>
    </Modal>
  )
}
