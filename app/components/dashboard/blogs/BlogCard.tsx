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
import { Calendar, Clock, Edit, Eye, Tag, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { BlogModal } from '@/app/modals/BlogModal'
import type { Blog, BlogFormData } from '@/types/blog.types'

interface BlogCardProps {
  blog: Blog
  onUpdate: (id: string, data: BlogFormData) => void
  onDelete: (id: string) => void
}

export function BlogCard({ blog, onUpdate, onDelete }: BlogCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      onDelete(blog.id)
    }
  }

  const handleUpdate = (data: BlogFormData) => {
    onUpdate(blog.id, data)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '')
  }

  return (
    <>
      <Card className='group transition-shadow duration-200 hover:shadow-lg'>
        <CardHeader className='pb-3'>
          <div className='flex w-full items-start justify-between'>
            <div className='flex-1'>
              <div className='mb-2 flex items-center gap-2'>
                <h3 className='line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary'>
                  {blog.title}
                </h3>
                {blog.published ? (
                  <Chip color='success' variant='flat' size='sm'>
                    Published
                  </Chip>
                ) : (
                  <Chip color='warning' variant='flat' size='sm'>
                    Draft
                  </Chip>
                )}
              </div>

              <div className='flex items-center gap-4 text-sm text-default-500'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='h-4 w-4' />
                  <span>{blog.readTime} min read</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
              <Button
                isIconOnly
                size='sm'
                variant='light'
                color='default'
                onPress={() => setIsPreviewModalOpen(true)}
                className='hover:bg-default-100'
              >
                <Eye className='h-4 w-4' />
              </Button>
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
            {/* Featured Image */}
            {blog.featuredImage && (
              <div className='aspect-video overflow-hidden rounded-lg'>
                <Image
                  src={blog.featuredImage || '/placeholder.svg'}
                  alt={blog.title}
                  className='h-full w-full object-cover'
                  classNames={{
                    wrapper: 'w-full h-full',
                    img: 'w-full h-full object-cover',
                  }}
                />
              </div>
            )}

            {/* Excerpt */}
            <div>
              <p className='line-clamp-3 text-sm text-default-600'>{blog.excerpt}</p>
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className='space-y-2'>
                <div className='flex items-center gap-1 text-sm font-medium text-foreground'>
                  <Tag className='h-3 w-3' />
                  <span>Tags</span>
                </div>
                <div className='flex flex-wrap gap-1'>
                  {blog.tags.slice(0, 3).map((tag, index) => (
                    <Chip key={index} color='primary' variant='flat' size='sm' className='text-xs'>
                      {tag}
                    </Chip>
                  ))}
                  {blog.tags.length > 3 && (
                    <Chip color='default' variant='flat' size='sm' className='text-xs'>
                      +{blog.tags.length - 3} more
                    </Chip>
                  )}
                </div>
              </div>
            )}

            {/* Content Preview */}
            <Card className='border border-default/20 bg-gradient-to-r from-default/5 to-primary/5'>
              <CardBody className='py-3'>
                <div className='line-clamp-2 text-sm text-default-600'>
                  {stripHtml(blog.content).substring(0, 150)}...
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
                {blog.slug}
              </Badge>
              <Badge color='secondary' variant='flat' size='sm'>
                {blog.tags.length} tags
              </Badge>
            </div>
            <Button
              size='sm'
              variant='flat'
              color='primary'
              startContent={<Eye className='h-3 w-3' />}
              onPress={() => setIsPreviewModalOpen(true)}
              className='text-xs'
            >
              Preview
            </Button>
          </div>
        </CardFooter>
      </Card>

      <BlogModal
        blog={blog}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
      />

      {/* Preview Modal */}
      <BlogPreviewModal blog={blog} isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} />
    </>
  )
}

// Blog Preview Modal Component
interface BlogPreviewModalProps {
  blog: Blog
  isOpen: boolean
  onClose: () => void
}

function BlogPreviewModal({ blog, isOpen, onClose }: BlogPreviewModalProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size='4xl' scrollBehavior='inside'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              <h2 className='text-xl font-semibold'>{blog.title}</h2>
              <div className='flex items-center gap-4 text-sm font-normal text-default-500'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='h-4 w-4' />
                  <span>{blog.readTime} min read</span>
                </div>
                <Chip color={blog.published ? 'success' : 'warning'} variant='flat' size='sm'>
                  {blog.published ? 'Published' : 'Draft'}
                </Chip>
              </div>
            </ModalHeader>

            <Divider />

            <ModalBody className='py-6'>
              <div className='space-y-6'>
                {/* Featured Image */}
                {blog.featuredImage && (
                  <div className='aspect-video overflow-hidden rounded-lg'>
                    <Image
                      src={blog.featuredImage || '/placeholder.svg'}
                      alt={blog.title}
                      className='h-full w-full object-cover'
                      classNames={{
                        wrapper: 'w-full h-full',
                        img: 'w-full h-full object-cover',
                      }}
                    />
                  </div>
                )}

                {/* Excerpt */}
                <div className='rounded-lg bg-default-100 p-4'>
                  <p className='italic text-default-700'>{blog.excerpt}</p>
                </div>

                {/* Tags */}
                {blog.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {blog.tags.map((tag, index) => (
                      <Chip key={index} color='primary' variant='flat' size='sm'>
                        {tag}
                      </Chip>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div
                  className='prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none'
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
