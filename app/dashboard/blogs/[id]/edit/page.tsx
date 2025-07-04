'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button, Card, CardBody, Skeleton } from '@heroui/react'
import Link from 'next/link'
import { use } from 'react'

import BlogForm from '@/app/components/dashboard/blogs/BlogForm'
import { useBlog } from '@/app/hooks/useBlogs'

interface EditBlogPageProps {
  params: Promise<{ id: string }>
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = use(params)
  const { data: blog, isLoading, error } = useBlog(id)

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <div className='mx-auto max-w-4xl'>
          <div className='mb-8'>
            <Skeleton className='h-10 w-32 rounded-lg' />
          </div>
          <div className='mb-8'>
            <Skeleton className='mb-2 h-8 w-64 rounded-lg' />
            <Skeleton className='h-4 w-96 rounded-lg' />
          </div>
          <Card>
            <CardBody>
              <Skeleton className='h-64 w-full rounded-lg' />
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <div className='mx-auto max-w-4xl'>
          <Card className='border-danger'>
            <CardBody>
              <p className='text-danger'>Error loading blog: {error?.message || 'Blog not found'}</p>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='mx-auto max-w-4xl'>
        {/* Navigation */}
        <div className='mb-8'>
          <Button
            as={Link}
            href={`/dashboard/blogs/${blog.id}`}
            variant='light'
            startContent={<ArrowLeftIcon className='h-5 w-5' />}
          >
            Back to Blog
          </Button>
        </div>

        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Edit Blog Post</h1>
          <p className='mt-2 text-default-500'>Update your blog post content.</p>
        </div>

        {/* Form */}
        <BlogForm blog={blog} />
      </div>
    </div>
  )
}
