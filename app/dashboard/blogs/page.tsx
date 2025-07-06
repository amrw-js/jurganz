'use client'

import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from '@heroui/react'
import { format } from 'date-fns'
import Link from 'next/link'
import { useState } from 'react'

import { useBlogs, useDeleteBlog } from '@/app/hooks/useBlogs'
import type { Blog } from '@/types/blog.types'

export default function BlogsPage() {
  const { data: blogs, isLoading, error } = useBlogs()
  const deleteBlogMutation = useDeleteBlog()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null)

  const handleDeleteClick = (blog: Blog) => {
    setBlogToDelete(blog)
    onOpen()
  }

  const handleDeleteConfirm = async () => {
    if (blogToDelete) {
      await deleteBlogMutation.mutateAsync(blogToDelete.id)
      setBlogToDelete(null)
    }
  }

  // Helper function to get the display image for a blog
  const getBlogDisplayImage = (blog: Blog) => {
    // Priority: feature image first, then first media image, then placeholder
    if (blog.featureImage) {
      return blog.featureImage
    }

    if (blog.media && blog.media.length > 0) {
      const firstImage = blog.media.find((item) => item.type === 'image')
      if (firstImage) {
        return firstImage.url
      }
    }

    return '/placeholder.svg?height=200&width=400'
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-8 flex items-center justify-between'>
            <Skeleton className='h-8 w-64 rounded-lg' />
            <Skeleton className='h-10 w-32 rounded-lg' />
          </div>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className='w-full'>
                <CardBody className='p-0'>
                  <Skeleton className='h-48 w-full rounded-lg' />
                </CardBody>
                <CardFooter className='flex flex-col gap-3'>
                  <Skeleton className='h-4 w-3/4 rounded-lg' />
                  <Skeleton className='h-3 w-full rounded-lg' />
                  <Skeleton className='h-3 w-2/3 rounded-lg' />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <div className='mx-auto max-w-7xl'>
          <Card className='border-danger'>
            <CardBody>
              <p className='text-danger'>Error loading blogs: {error.message}</p>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Blog Management</h1>
          <Button
            as={Link}
            href='/dashboard/blogs/create'
            color='primary'
            startContent={<PlusIcon className='h-5 w-5' />}
          >
            Create Blog
          </Button>
        </div>

        {/* Blog Grid */}
        {blogs && blogs.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {blogs.map((blog) => (
              <Card key={blog.id} className='w-full'>
                <CardBody className='p-0'>
                  <div className='relative'>
                    <Image
                      src={getBlogDisplayImage(blog)}
                      alt={blog.title}
                      className='h-48 w-full object-cover'
                      radius='none'
                    />
                    {/* Feature image indicator */}
                    {blog.featureImage && (
                      <Chip size='sm' color='primary' variant='solid' className='absolute left-2 top-2'>
                        Featured
                      </Chip>
                    )}
                  </div>
                </CardBody>
                <CardFooter className='flex flex-col gap-3'>
                  <div className='w-full'>
                    <h3 className='mb-2 line-clamp-2 text-lg font-semibold'>{blog.title}</h3>
                    <div
                      className='mb-4 line-clamp-3 text-sm text-default-500'
                      dangerouslySetInnerHTML={{
                        __html: blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
                      }}
                    />
                    <div className='mb-4 flex items-center justify-between'>
                      <Chip size='sm' variant='flat'>
                        {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                      </Chip>
                      <Chip size='sm' variant='flat' color='secondary'>
                        Updated: {format(new Date(blog.updatedAt), 'MMM dd')}
                      </Chip>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        as={Link}
                        href={`/dashboard/blogs/${blog.id}`}
                        variant='bordered'
                        size='sm'
                        startContent={<EyeIcon className='h-4 w-4' />}
                        className='flex-1'
                      >
                        View
                      </Button>
                      <Button
                        as={Link}
                        href={`/dashboard/blogs/${blog.id}/edit`}
                        color='primary'
                        size='sm'
                        startContent={<PencilIcon className='h-4 w-4' />}
                        className='flex-1'
                      >
                        Edit
                      </Button>
                      <Button color='danger' size='sm' isIconOnly onPress={() => handleDeleteClick(blog)}>
                        <TrashIcon className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className='py-12 text-center'>
            <div className='mx-auto mb-4 h-12 w-12 text-default-400'>
              <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <h3 className='mb-2 text-lg font-medium'>No blogs</h3>
            <p className='mb-6 text-default-500'>Get started by creating a new blog post.</p>
            <Button
              as={Link}
              href='/dashboard/blogs/create'
              color='primary'
              startContent={<PlusIcon className='h-5 w-5' />}
            >
              Create Blog
            </Button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>Delete Blog Post</ModalHeader>
                <ModalBody>
                  <p>Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.</p>
                </ModalBody>
                <ModalFooter>
                  <Button variant='light' onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color='danger'
                    onPress={() => {
                      handleDeleteConfirm()
                      onClose()
                    }}
                    isLoading={deleteBlogMutation.isPending}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  )
}
