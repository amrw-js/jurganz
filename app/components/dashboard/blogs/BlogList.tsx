'use client'

import { Button, Spinner } from '@heroui/react'
import { Plus } from 'lucide-react'

import type { Blog, BlogFormData } from '@/types/blog.types'

import { BlogCard } from './BlogCard'

interface BlogListProps {
  blogs: Blog[]
  loading: boolean
  searchTerm: string
  onUpdate: (id: string, data: BlogFormData) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onCreateNew: () => void
}

export function BlogList({ blogs, loading, searchTerm, onUpdate, onDelete, onCreateNew }: BlogListProps) {
  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Spinner size='lg' color='primary' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold text-foreground'>
            {searchTerm ? `Search Results (${blogs.length})` : `All Blog Posts (${blogs.length})`}
          </h2>
          <p className='text-sm text-default-500'>
            {searchTerm ? `Showing blog posts matching "${searchTerm}"` : 'Manage your blog posts and content'}
          </p>
        </div>
      </div>

      {/* Blogs Grid */}
      {blogs.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className='py-12 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-default-100'>
            <Plus className='h-8 w-8 text-default-400' />
          </div>
          <h3 className='mb-2 text-lg font-medium text-foreground'>
            {searchTerm ? 'No blog posts found' : 'No blog posts yet'}
          </h3>
          <p className='mb-6 text-sm text-default-500'>
            {searchTerm
              ? `No blog posts match "${searchTerm}". Try a different search term.`
              : 'Get started by creating your first blog post with rich content.'}
          </p>
          <Button color='primary' variant='flat' startContent={<Plus className='h-4 w-4' />} onPress={onCreateNew}>
            {searchTerm ? 'Create New Blog Post' : 'Create Your First Blog Post'}
          </Button>
        </div>
      )}
    </div>
  )
}
