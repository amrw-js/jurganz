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
import {
  Building,
  Calendar,
  Camera,
  Edit,
  Factory,
  FileX,
  ImageIcon,
  Mail,
  Phone,
  Play,
  Plus,
  Trash2,
  User,
  Video,
} from 'lucide-react'
import { useState } from 'react'

import { ProductionLineModal } from '@/app/modals/ProductionLineModal'
import type { ProductionLine, ProductionLineFormData } from '@/types/production-line.types'

interface ProductionLineCardProps {
  productionLine: ProductionLine
  onUpdate: (id: string, data: ProductionLineFormData) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function ProductionLineCard({ productionLine, onUpdate, onDelete }: ProductionLineCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isMediaGalleryOpen, setIsMediaGalleryOpen] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this production line?')) {
      onDelete(productionLine.id)
    }
  }

  const handleUpdate = async (data: ProductionLineFormData) => {
    await onUpdate(productionLine.id, data)
  }

  const handleImageError = (photoId: string) => {
    setImageErrors((prev) => new Set([...prev, photoId]))
  }

  // Get production line media
  const getProductionLineMedia = () => {
    if (!productionLine.photos || productionLine.photos.length === 0) {
      return []
    }

    return productionLine.photos.map((photo, index) => ({
      id: photo.id || `${productionLine.id}-${index}`,
      url: photo.url || photo,
      type: photo.type || 'image',
      name: photo.name || `Media ${index + 1}`,
    }))
  }

  const productionLineMedia = getProductionLineMedia()

  const renderMediaPreview = (media: any, index: number) => {
    const isVideo = media.type === 'video'
    const hasError = imageErrors.has(media.id)

    if (hasError) {
      return (
        <div
          key={media.id}
          className='group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-default-100'
          onClick={() => setIsMediaGalleryOpen(true)}
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
        onClick={() => setIsMediaGalleryOpen(true)}
      >
        {isVideo ? (
          <div className='flex h-full w-full items-center justify-center bg-default-200'>
            <div className='text-center'>
              <div className='mx-auto mb-2 w-fit rounded-full bg-default-300 p-3'>
                <Video className='h-4 w-4 text-default-600' />
              </div>
              <p className='text-xs text-default-600'>Video</p>
            </div>
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

        <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20'>
          <Camera className='h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100' />
        </div>

        <div className='absolute bottom-1 right-1'>
          <Chip size='sm' variant='solid' color={isVideo ? 'secondary' : 'primary'} className='text-xs'>
            {isVideo ? <Video className='h-2 w-2' /> : <ImageIcon className='h-2 w-2' />}
          </Chip>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <>
      <Card className='group transition-shadow duration-200 hover:shadow-lg'>
        <CardHeader className='pb-3'>
          <div className='flex w-full items-start justify-between'>
            <div className='flex-1'>
              <div className='mb-2 flex items-center gap-2'>
                <div className='rounded bg-primary/10 p-1'>
                  <Factory className='h-4 w-4 text-primary' />
                </div>
                <h3 className='text-lg font-semibold text-foreground transition-colors group-hover:text-primary'>
                  {productionLine.productType}
                </h3>
                {productionLine.isAvailableNow ? (
                  <Chip color='success' variant='flat' size='sm'>
                    Available
                  </Chip>
                ) : (
                  <Chip color='warning' variant='flat' size='sm'>
                    Not Available
                  </Chip>
                )}
                {productionLine.published ? (
                  <Chip color='primary' variant='flat' size='sm'>
                    Published
                  </Chip>
                ) : (
                  <Chip color='default' variant='flat' size='sm'>
                    Draft
                  </Chip>
                )}
              </div>

              <div className='space-y-1 text-sm text-default-500'>
                <div className='flex items-center gap-1'>
                  <Building className='h-3 w-3' />
                  <span>{productionLine.companyName}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Factory className='h-3 w-3' />
                  <span>
                    {productionLine.containerType} • {productionLine.capacity} units/hr
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  <span>Year: {productionLine.yearOfManufacturing}</span>
                </div>
              </div>
            </div>

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
            {/* Contact Info */}
            <div className='space-y-2'>
              <h4 className='text-sm font-medium text-foreground'>Contact Information</h4>
              <div className='grid grid-cols-1 gap-1 text-xs text-default-500'>
                <div className='flex items-center gap-1'>
                  <User className='h-3 w-3' />
                  <span>{productionLine.fullName}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Mail className='h-3 w-3' />
                  <span>{productionLine.emailAddress}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Phone className='h-3 w-3' />
                  <span>{productionLine.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-medium text-foreground'>Production Line Media</h4>
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

              {productionLineMedia.length > 0 ? (
                <div className='grid grid-cols-3 gap-2'>
                  {productionLineMedia.slice(0, 5).map((media, index) => renderMediaPreview(media, index))}

                  {productionLineMedia.length > 5 && (
                    <div
                      className='flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-default-300 bg-default-100 transition-colors hover:bg-default-200'
                      onClick={() => setIsMediaGalleryOpen(true)}
                    >
                      <Plus className='mb-1 h-4 w-4 text-default-500' />
                      <span className='text-xs font-medium text-default-500'>+{productionLineMedia.length - 5}</span>
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
                  <CardBody className='py-6 text-center'>
                    <ImageIcon className='mx-auto mb-2 h-6 w-6 text-default-400' />
                    <p className='mb-1 text-xs text-default-600'>No media yet</p>
                    <p className='text-xs text-default-400'>Click to add photos or videos</p>
                  </CardBody>
                </Card>
              )}
            </div>

            {/* Price Section */}
            <Card className='border border-success/20 bg-gradient-to-r from-success/5 to-primary/5'>
              <CardBody className='py-3'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-foreground'>Price</p>
                    <p className='text-xs text-default-500'>
                      {productionLine.negotiable ? 'Negotiable' : 'Fixed price'}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-xl font-bold text-success'>
                      {formatPrice(productionLine.price, productionLine.localCurrency)}
                    </p>
                    {productionLine.negotiable && <p className='text-xs text-default-500'>Negotiable</p>}
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
                {productionLine.fillingProcess}
              </Badge>
              <Badge color='secondary' variant='flat' size='sm'>
                {productionLineMedia.length} files
              </Badge>
              <Badge color={productionLine.published ? 'success' : 'default'} variant='flat' size='sm'>
                {productionLine.published ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <Button
              size='sm'
              variant='flat'
              color='primary'
              startContent={<Camera className='h-3 w-3' />}
              onPress={() => setIsMediaGalleryOpen(true)}
              className='text-xs'
              isDisabled={productionLineMedia.length === 0}
            >
              {productionLineMedia.length > 0 ? 'View Media' : 'No Media'}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit Modal */}
      <ProductionLineModal
        productionLine={productionLine}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
      />

      {/* Media Gallery Modal */}
      <MediaGalleryModal
        productionLine={productionLine}
        media={productionLineMedia}
        isOpen={isMediaGalleryOpen}
        onClose={() => setIsMediaGalleryOpen(false)}
      />
    </>
  )
}

// Media Gallery Modal Component
interface MediaGalleryModalProps {
  productionLine: ProductionLine
  media: any[]
  isOpen: boolean
  onClose: () => void
}

function MediaGalleryModal({ productionLine, media, isOpen, onClose }: MediaGalleryModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size='4xl' scrollBehavior='inside'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              <h2 className='text-xl font-semibold'>{productionLine.productType} - Media Gallery</h2>
              <p className='text-sm font-normal text-default-500'>{media.length} files</p>
            </ModalHeader>

            <Divider />

            <ModalBody className='py-6'>
              {media.length > 0 ? (
                <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                  {media.map((item, index) => {
                    const isVideo = item.type === 'video'
                    return (
                      <div key={item.id} className='group relative'>
                        <Card className='cursor-pointer overflow-hidden transition-shadow hover:shadow-md'>
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
