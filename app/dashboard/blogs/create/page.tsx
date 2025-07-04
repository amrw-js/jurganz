'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import Link from 'next/link'

import BlogForm from '@/app/components/dashboard/blogs/BlogForm'

export default function CreateBlogPage() {
  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='mx-auto max-w-4xl'>
        {/* Navigation */}
        <div className='mb-8'>
          <Button
            as={Link}
            href='/dashboard/blogs'
            variant='light'
            startContent={<ArrowLeftIcon className='h-5 w-5' />}
          >
            Back to Blogs
          </Button>
        </div>

        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Create New Blog Post</h1>
          <p className='mt-2 text-default-500'>Write and publish your new blog post with rich content.</p>
        </div>

        {/* Form */}
        <BlogForm />
      </div>
    </div>
  )
}
