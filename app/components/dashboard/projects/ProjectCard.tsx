'use client'

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@heroui/react'
import { Camera, Clock, Edit, Factory, FileX, ImageIcon, Play, Plus, Trash2, Video } from 'lucide-react'
import { useState } from 'react'

import { ProjectModal } from '@/app/modals/ProjectModal'
import type { Project, ProjectFormData, ProjectMedia } from '@/types/project.types'

interface ProjectCardProps {
  project: Project
  onUpdate: (id: string, data: ProjectFormData) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function ProjectCard({ project, onUpdate, onDelete }: ProjectCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id)
    }
  }

  const handleUpdate = async (data: ProjectFormData) => {
    await onUpdate(project.id, data)
  }

  const handleImageError = (mediaId: string) => {
    setImageErrors((prev) => new Set([...prev, mediaId]))
  }

  // Get project media - now always an array of ProjectMedia
  const projectMedia: ProjectMedia[] = project.media || []

  const renderMediaPreview = (media: ProjectMedia, index: number) => {
    const isVideo = media.type === 'video'
    const hasError = imageErrors.has(media.id)

    if (hasError) {
      return (
        <div
          key={media.id}
          className='group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-default-100'
          onClick={() => setIsPhotoGalleryOpen(true)}
        >
          <div className='text-center'>
            <FileX className='mx-auto mb-1 h-6 w-6 text-default-400' />
            <p className='text-xs text-default-400'>Failed to load</p>
          </div>
        </div>
      )
    }

    return (
      <div
        key={media.id}
        className='group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-default-100'
        onClick={() => setIsPhotoGalleryOpen(true)}
      >
        {isVideo ? (
          <div className='flex h-full w-full items-center justify-center bg-default-200'>
            <div className='text-center'>
              <div className='mx-auto mb-2 w-fit rounded-full bg-default-300 p-3'>
                <Video className='h-4 w-4 text-default-600' />
              </div>
              <p className='text-xs text-default-600'>Video</p>
            </div>
            {/* Video overlay */}
            <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
              <div className='rounded-full bg-white/90 p-2'>
                <Play className='h-3 w-3 text-default-700' fill='currentColor' />
              </div>
            </div>
          </div>
        ) : (
          <Image
            src={media.url || '/placeholder.svg'}
            alt={media.name}
            className='h-full w-full object-cover transition-transform group-hover:scale-105'
            classNames={{
              wrapper: 'w-full h-full',
              img: 'w-full h-full object-cover',
            }}
            onError={() => handleImageError(media.id)}
            fallbackSrc='/placeholder.svg?height=100&width=100'
          />
        )}

        {/* Hover overlay */}
        <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20'>
          <Camera className='h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100' />
        </div>

        {/* Media type indicator */}
        <div className='absolute bottom-1 right-1'>
          <Chip size='sm' variant='solid' color={isVideo ? 'secondary' : 'primary'} className='text-xs'>
            {isVideo ? <Video className='h-2 w-2' /> : <ImageIcon className='h-2 w-2' />}
          </Chip>
        </div>
      </div>
    )
  }

  return (
    <>
      <Card className='group transition-shadow duration-200 hover:shadow-lg'>
        <CardHeader className='pb-3'>
          <div className='flex w-full items-start justify-between'>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-foreground transition-colors group-hover:text-primary'>
                {project.name}
              </h3>
              <div className='mt-2 flex items-center gap-4'>
                <div className='flex items-center gap-1 text-sm text-default-500'>
                  <Factory className='h-4 w-4' />
                  <span>{project.capacity}</span>
                </div>
                <div className='flex items-center gap-1 text-sm text-default-500'>
                  <Clock className='h-4 w-4' />
                  <span>{project.time}</span>
                </div>
                <div className='flex items-center gap-1 text-sm text-default-500'>
                  <Camera className='h-4 w-4' />
                  <span>{projectMedia.length} files</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
              <Button
                isIconOnly
                size='sm'
                variant='light'
                color='primary'
                onPress={() => setIsEditModalOpen(true)}
                className='hover:bg-primary/10'
              >
                <Edit className='h-4 w-4' />
              </Button>
              <Button
                isIconOnly
                size='sm'
                variant='light'
                color='danger'
                onPress={handleDelete}
                className='hover:bg-danger/10'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Divider />

        <CardBody className='py-4'>
          <div className='space-y-4'>
            {/* Media Section */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-medium text-foreground'>Project Media</h4>
                <Button
                  size='sm'
                  variant='flat'
                  color='primary'
                  startContent={<Plus className='h-3 w-3' />}
                  onPress={() => setIsEditModalOpen(true)}
                  className='text-xs'
                >
                  Add Media
                </Button>
              </div>

              {projectMedia.length > 0 ? (
                <div className='grid grid-cols-3 gap-2'>
                  {projectMedia.slice(0, 5).map((media, index) => renderMediaPreview(media, index))}

                  {projectMedia.length > 5 && (
                    <div
                      className='flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-default-300 bg-default-100 transition-colors hover:bg-default-200'
                      onClick={() => setIsPhotoGalleryOpen(true)}
                    >
                      <Plus className='mb-1 h-4 w-4 text-default-500' />
                      <span className='text-xs font-medium text-default-500'>+{projectMedia.length - 5}</span>
                      <span className='text-xs text-default-400'>more</span>
                    </div>
                  )}
                </div>
              ) : (
                <Card
                  isPressable
                  className='border-2 border-dashed border-default-300 bg-default-50 transition-colors hover:border-default-400 hover:bg-default-100'
                  onPress={() => setIsEditModalOpen(true)}
                >
                  <CardBody className='py-8 text-center'>
                    <ImageIcon className='mx-auto mb-2 h-8 w-8 text-default-400' />
                    <p className='mb-1 text-sm text-default-600'>No media yet</p>
                    <p className='text-xs text-default-400'>Click to add photos or videos</p>
                  </CardBody>
                </Card>
              )}
            </div>

            {/* Project Stats */}
            <Card className='border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5'>
              <CardBody className='py-3'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-foreground'>Team Capacity</p>
                    <p className='text-xs text-default-500'>Maximum team size</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-2xl font-bold text-primary'>{project.capacity}</p>
                    <p className='text-xs text-default-500'>people</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </CardBody>

        <Divider />

        <CardFooter className='bg-default-50/50 py-3'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Badge color='primary' variant='flat' size='sm'>
                {project.time}
              </Badge>
              <Badge color='secondary' variant='flat' size='sm'>
                {projectMedia.length} files
              </Badge>
            </div>
            <Button
              size='sm'
              variant='flat'
              color='primary'
              startContent={<Camera className='h-3 w-3' />}
              onPress={() => setIsPhotoGalleryOpen(true)}
              className='text-xs'
              isDisabled={projectMedia.length === 0}
            >
              {projectMedia.length > 0 ? 'View Media' : 'No Media'}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit Modal */}
      <ProjectModal
        project={project}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
      />

      {/* Media Gallery Modal */}
      <MediaGalleryModal
        project={project}
        media={projectMedia}
        isOpen={isPhotoGalleryOpen}
        onClose={() => setIsPhotoGalleryOpen(false)}
      />
    </>
  )
}

// Enhanced Media Gallery Modal Component
interface MediaGalleryModalProps {
  project: Project
  media: ProjectMedia[]
  isOpen: boolean
  onClose: () => void
}

function MediaGalleryModal({ project, media, isOpen, onClose }: MediaGalleryModalProps) {
  const [selectedMedia, setSelectedMedia] = useState<ProjectMedia | null>(null)

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size='4xl' scrollBehavior='inside'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              <h2 className='text-xl font-semibold'>{project.name} - Media Gallery</h2>
              <p className='text-sm font-normal text-default-500'>{media.length} files</p>
            </ModalHeader>

            <Divider />

            <ModalBody className='py-6'>
              {media.length > 0 ? (
                <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                  {media.map((item) => {
                    const isVideo = item.type === 'video'
                    console.log('Media item:', item)
                    return (
                      <div key={item.id} className='group relative'>
                        <Card
                          className='cursor-pointer overflow-hidden transition-shadow hover:shadow-md'
                          isPressable
                          onPress={() => setSelectedMedia(item)}
                        >
                          <CardBody className='p-0'>
                            <div className='relative aspect-square'>
                              {isVideo ? (
                                <div className='flex h-full w-full items-center justify-center bg-default-200'>
                                  <div className='text-center'>
                                    <div className='mx-auto mb-2 w-fit rounded-full bg-default-300 p-4'>
                                      <Video className='h-6 w-6 text-default-600' />
                                    </div>
                                    <p className='text-sm font-medium text-default-600'>Video File</p>
                                    <p className='text-xs text-default-500'>{item.name}</p>
                                  </div>
                                  <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100'>
                                    <div className='rounded-full bg-white/90 p-3'>
                                      <Play className='h-5 w-5 text-default-700' fill='currentColor' />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <Image
                                  src={item.url || '/placeholder.svg'}
                                  alt={item.name}
                                  className='h-full w-full object-cover'
                                  classNames={{
                                    wrapper: 'w-full h-full',
                                    img: 'w-full h-full object-cover',
                                  }}
                                  fallbackSrc='/placeholder.svg?height=200&width=200'
                                />
                              )}

                              <div className='absolute bottom-2 left-2'>
                                <Chip size='sm' color={isVideo ? 'secondary' : 'primary'} variant='solid'>
                                  {isVideo ? 'Video' : 'Image'}
                                </Chip>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className='py-12 text-center'>
                  <ImageIcon className='mx-auto mb-4 h-12 w-12 text-default-300' />
                  <p className='mb-2 text-default-500'>No media files found</p>
                  <p className='text-sm text-default-400'>Add some photos or videos to see them here</p>
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
