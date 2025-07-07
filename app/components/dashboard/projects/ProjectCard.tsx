'use client'

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@heroui/react'
import { Camera, Clock, Edit, Factory, FileX, ImageIcon, MapPin, Play, Plus, Trash2, Video } from 'lucide-react'
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

  const renderMediaPreview = (media: ProjectMedia) => {
    const isVideo = media.type === 'video'
    const hasError = imageErrors.has(media.id)

    if (hasError) {
      return (
        <div
          key={media.id}
          className='group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-default-100 to-default-200 shadow-sm'
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
        className='group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-default-100 shadow-sm ring-1 ring-default-200/50 transition-all duration-300 hover:shadow-lg hover:ring-primary/30'
        onClick={() => setIsPhotoGalleryOpen(true)}
      >
        {isVideo ? (
          <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-default-200 to-default-300'>
            <div className='text-center'>
              <div className='z-50 mx-auto mb-2 w-fit rounded-full bg-gradient-to-br from-secondary/20 to-secondary/40 p-3 shadow-sm'>
                <Video className='h-4 w-4 text-secondary-600' />
              </div>
              <p className='text-xs font-medium text-default-600'>Video</p>
            </div>
            {/* Video overlay */}
            <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30'>
              <div className='scale-90 rounded-full bg-white/90 p-2 opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100'>
                <Play className='h-4 w-4 text-default-700' fill='currentColor' />
              </div>
            </div>
          </div>
        ) : (
          <Image
            src={media.url || '/placeholder.svg'}
            alt={media.name}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
            classNames={{
              wrapper: 'w-full h-full !max-w-full',
            }}
            onError={() => handleImageError(media.id)}
            fallbackSrc='/placeholder.svg?height=100&width=100'
          />
        )}
        {/* Hover overlay */}
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-t from-black/0 via-transparent to-black/0 opacity-0 transition-all duration-300 group-hover:from-black/20 group-hover:to-black/10 group-hover:opacity-100'>
          <Camera className='h-5 w-5 text-white drop-shadow-lg' />
        </div>

        <div className='absolute bottom-2 right-2 z-50'>
          <Chip
            size='sm'
            variant='shadow'
            color={isVideo ? 'secondary' : 'primary'}
            className='text-xs font-medium backdrop-blur-sm'
          >
            {isVideo ? <Video className='h-2 w-2' /> : <ImageIcon className='h-2 w-2' />}
          </Chip>
        </div>
      </div>
    )
  }

  return (
    <>
      <Card className='group relative overflow-hidden border-0 bg-gradient-to-br from-white to-default-50/50 shadow-sm ring-1 ring-default-200/50 transition-all duration-300 hover:shadow-xl hover:ring-primary/20'>
        {/* Decorative gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-secondary/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

        <CardHeader className='relative z-10 pb-4'>
          <div className='flex w-full items-start justify-between'>
            <div className='flex-1 space-y-3'>
              {/* Project Title */}
              <div className='space-y-2'>
                <h3 className='text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary'>
                  {project.name}
                </h3>

                {/* Company Name */}
                {project.companyName && (
                  <div className='flex items-center gap-2'>
                    <div className='h-1 w-1 rounded-full bg-primary/60' />
                    <p className='text-sm font-medium text-primary/80'>{project.companyName}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {project.description && (
                <p className='line-clamp-2 text-sm leading-relaxed text-default-600'>{project.description}</p>
              )}

              {/* Project Metadata */}
              <div className='flex flex-wrap items-center gap-3'>
                {project.location && (
                  <div className='flex items-center gap-1.5 rounded-full bg-default-100/80 px-2.5 py-1 text-xs font-medium text-default-600'>
                    <MapPin className='h-3 w-3 text-primary/70' />
                    <span>{project.location}</span>
                  </div>
                )}
                <div className='flex items-center gap-1.5 rounded-full bg-default-100/80 px-2.5 py-1 text-xs font-medium text-default-600'>
                  <Factory className='h-3 w-3 text-secondary/70' />
                  <span>{project.capacity}</span>
                </div>
                <div className='flex items-center gap-1.5 rounded-full bg-default-100/80 px-2.5 py-1 text-xs font-medium text-default-600'>
                  <Clock className='h-3 w-3 text-warning/70' />
                  <span>{project.time}</span>
                </div>
                <div className='flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary'>
                  <Camera className='h-3 w-3' />
                  <span>{projectMedia.length} files</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className='flex gap-1 opacity-0 transition-all duration-300 group-hover:opacity-100'>
              <Button
                isIconOnly
                size='sm'
                variant='flat'
                color='primary'
                onPress={() => setIsEditModalOpen(true)}
                className='bg-primary/10 backdrop-blur-sm hover:bg-primary/20'
              >
                <Edit className='h-4 w-4' />
              </Button>
              <Button
                isIconOnly
                size='sm'
                variant='flat'
                color='danger'
                onPress={handleDelete}
                className='bg-danger/10 backdrop-blur-sm hover:bg-danger/20'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Divider className='bg-gradient-to-r from-transparent via-default-200 to-transparent' />

        <CardBody className='relative z-10 py-6'>
          <div className='space-y-6'>
            {/* Media Section */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h4 className='text-base font-semibold text-foreground'>Project Gallery</h4>
                <Button
                  size='sm'
                  variant='flat'
                  color='primary'
                  startContent={<Plus className='h-3 w-3' />}
                  onPress={() => setIsEditModalOpen(true)}
                  className='bg-primary/10 text-xs font-medium hover:bg-primary/20'
                >
                  Add Media
                </Button>
              </div>

              {projectMedia.length > 0 ? (
                <div className='grid grid-cols-4 gap-3'>
                  {projectMedia.slice(0, 7).map((media) => renderMediaPreview(media))}
                  {projectMedia.length > 7 && (
                    <div
                      className='flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 transition-all duration-300 hover:border-primary/50 hover:from-primary/10 hover:to-primary/20'
                      onClick={() => setIsPhotoGalleryOpen(true)}
                    >
                      <Plus className='mb-1 h-4 w-4 text-primary/70' />
                      <span className='text-xs font-semibold text-primary'>+{projectMedia.length - 7}</span>
                      <span className='text-xs text-primary/60'>more</span>
                    </div>
                  )}
                </div>
              ) : (
                <Card
                  isPressable
                  className='border-2 border-dashed border-default-300 bg-gradient-to-br from-default-50 to-default-100/50 transition-all duration-300 hover:border-primary/40 hover:from-primary/5 hover:to-primary/10'
                  onPress={() => setIsEditModalOpen(true)}
                >
                  <CardBody className='py-12 text-center'>
                    <div className='mx-auto mb-3 w-fit rounded-full bg-gradient-to-br from-primary/10 to-primary/20 p-4'>
                      <ImageIcon className='h-8 w-8 text-primary/70' />
                    </div>
                    <p className='mb-1 text-sm font-medium text-default-700'>No media yet</p>
                    <p className='text-xs text-default-500'>Click to add photos or videos</p>
                  </CardBody>
                </Card>
              )}
            </div>

            {/* Project Stats */}
            <Card className='border-0 bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 shadow-sm ring-1 ring-primary/20'>
              <CardBody className='py-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <p className='text-sm font-semibold text-foreground'>Project Capacity</p>
                  </div>
                  <div className='text-right'>
                    <p className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent'>
                      {project.capacity}
                    </p>
                    <p className='text-xs font-medium text-default-500'>people</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </CardBody>
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
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size='5xl'
      scrollBehavior='inside'
      classNames={{
        backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
        base: 'bg-gradient-to-br from-white to-default-50/50',
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className='flex flex-col gap-2 border-b border-default-200/50 bg-gradient-to-r from-primary/5 to-secondary/5'>
            <h2 className='text-2xl font-bold text-foreground'>{project.name}</h2>
            <div className='flex items-center gap-3 text-sm text-default-600'>
              <div className='flex items-center gap-1'>
                <Camera className='h-4 w-4 text-primary' />
                <span className='font-medium'>{media.length} files</span>
              </div>
              {project.location && (
                <>
                  <div className='h-1 w-1 rounded-full bg-default-400' />
                  <div className='flex items-center gap-1'>
                    <MapPin className='h-4 w-4 text-secondary' />
                    <span>{project.location}</span>
                  </div>
                </>
              )}
              {project.companyName && (
                <>
                  <div className='h-1 w-1 rounded-full bg-default-400' />
                  <span className='font-medium text-primary'>{project.companyName}</span>
                </>
              )}
            </div>
          </ModalHeader>

          <ModalBody className='py-8'>
            {media.length > 0 ? (
              <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4'>
                {media.map((item) => {
                  const isVideo = item.type === 'video'
                  return (
                    <div key={item.id} className='group relative'>
                      <Card
                        className='cursor-pointer overflow-hidden border-0 shadow-sm ring-1 ring-default-200/50 transition-all duration-300 hover:shadow-lg hover:ring-primary/30'
                        isPressable
                      >
                        <CardBody className='p-0'>
                          <div className='relative aspect-square'>
                            {isVideo ? (
                              <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-default-200 to-default-300'>
                                <div className='text-center'>
                                  <div className='mx-auto mb-3 w-fit rounded-full bg-gradient-to-br from-secondary/20 to-secondary/40 p-6 shadow-sm'>
                                    <Video className='h-8 w-8 text-secondary-600' />
                                  </div>
                                  <p className='text-sm font-semibold text-default-700'>Video File</p>
                                  <p className='text-xs text-default-500'>{item.name}</p>
                                </div>
                                <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30'>
                                  <div className='scale-90 rounded-full bg-white/90 p-4 opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100'>
                                    <Play className='h-6 w-6 text-default-700' fill='currentColor' />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <Image
                                src={item.url || '/placeholder.svg'}
                                alt={item.name}
                                className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
                                classNames={{
                                  wrapper: 'w-full h-full',
                                  img: 'w-full h-full object-cover',
                                }}
                                fallbackSrc='/placeholder.svg?height=300&width=300'
                              />
                            )}
                            <div className='absolute bottom-3 left-3'>
                              <Chip
                                size='sm'
                                color={isVideo ? 'secondary' : 'primary'}
                                variant='shadow'
                                className='font-medium backdrop-blur-sm'
                              >
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
              <div className='py-16 text-center'>
                <div className='mx-auto mb-6 w-fit rounded-full bg-gradient-to-br from-primary/10 to-primary/20 p-8'>
                  <ImageIcon className='h-16 w-16 text-primary/70' />
                </div>
                <p className='mb-2 text-lg font-semibold text-default-600'>No media files found</p>
                <p className='text-sm text-default-500'>Add some photos or videos to see them here</p>
              </div>
            )}
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  )
}
