'use client'

import { ArrowLeftIcon, CalendarIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button, Card, CardBody, Chip, Image, Skeleton } from '@heroui/react'
import { format } from 'date-fns'
import Link from 'next/link'
import { use } from 'react'

import { useBlog } from '@/app/hooks/useBlogs'

interface BlogDetailPageProps {
  params: Promise<{ id: string }>
}

// Helper function to get the display image for a blog
const getBlogDisplayImage = (blog: any) => {
  // Priority: feature image first, then first media image, then placeholder
  if (blog.featureImage) {
    return blog.featureImage
  }

  if (blog.media && blog.media.length > 0) {
    const firstImage = blog.media.find((item: any) => item.type === 'image')
    if (firstImage) {
      return firstImage.url
    }
  }

  return null
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = use(params)
  const { data: blog, isLoading, error } = useBlog(id)

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <div className='mx-auto max-w-4xl'>
          <div className='mb-8 flex items-center justify-between'>
            <Skeleton className='h-6 w-32 rounded-lg' />
            <Skeleton className='h-10 w-24 rounded-lg' />
          </div>
          <Card>
            <CardBody className='p-0'>
              <Skeleton className='h-64 w-full rounded-none md:h-96' />
              <div className='space-y-4 p-8'>
                <Skeleton className='h-8 w-3/4 rounded-lg' />
                <div className='flex gap-4'>
                  <Skeleton className='h-6 w-32 rounded-lg' />
                  <Skeleton className='h-6 w-32 rounded-lg' />
                </div>
                <div className='space-y-3'>
                  <Skeleton className='h-4 w-full rounded-lg' />
                  <Skeleton className='h-4 w-5/6 rounded-lg' />
                  <Skeleton className='h-4 w-4/6 rounded-lg' />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <div className='mx-auto'>
          <Card className='border-danger'>
            <CardBody>
              <p className='text-danger'>Error loading blog: {error?.message || 'Blog not found'}</p>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  const displayImage = getBlogDisplayImage(blog)

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='mx-auto max-w-4xl'>
        {/* Navigation */}
        <div className='mb-8 flex items-center justify-between'>
          <Button
            as={Link}
            href='/dashboard/blogs'
            variant='light'
            startContent={<ArrowLeftIcon className='h-5 w-5' />}
          >
            Back to Blogs
          </Button>
          <Button
            as={Link}
            href={`/dashboard/blogs/${blog.id}/edit`}
            color='primary'
            startContent={<PencilIcon className='h-5 w-5' />}
          >
            Edit Blog
          </Button>
        </div>

        {/* Blog Content */}
        <Card>
          <CardBody className='p-0'>
            {/* Featured Image */}
            {displayImage && (
              <div className='relative'>
                <Image
                  classNames={{ wrapper: 'flex items-center justify-center w-full mx-auto' }}
                  src={displayImage}
                  alt={blog.title}
                  className='h-48 w-full object-cover md:h-64'
                  radius='none'
                />
                {blog.featureImage && (
                  <Chip size='sm' color='primary' variant='solid' className='absolute left-4 top-4 z-50'>
                    Featured
                  </Chip>
                )}
              </div>
            )}

            <div className='p-8'>
              {/* Title */}
              <h1 className='mb-4 text-3xl font-bold md:text-4xl'>{blog.title}</h1>

              {/* Meta Information */}
              <div className='mb-8 flex items-center gap-4 border-b border-divider pb-8'>
                <Chip startContent={<CalendarIcon className='h-4 w-4' />} variant='flat' color='primary'>
                  Created: {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
                </Chip>
                {blog.updatedAt !== blog.createdAt && (
                  <Chip startContent={<CalendarIcon className='h-4 w-4' />} variant='flat' color='secondary'>
                    Updated: {format(new Date(blog.updatedAt), 'MMMM dd, yyyy')}
                  </Chip>
                )}
              </div>

              {/* Content */}
              <div
                className='tiptap-content prose prose-lg max-w-none'
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
