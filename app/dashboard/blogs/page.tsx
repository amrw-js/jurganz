'use client'

import { Button, Chip, Input } from '@heroui/react'
import { BookOpen, Eye, FileText, Plus, Search } from 'lucide-react'
import { useState } from 'react'

import { BlogList } from '@/app/components/dashboard/blogs/BlogList'
import { useBlogs } from '@/app/hooks/useBlogs'
import { BlogModal } from '@/app/modals/BlogModal'
import type { BlogFormData } from '@/types/blog.types'

export default function BlogsPage() {
  const { blogs, loading, addBlog, updateBlog, deleteBlog, getPublishedBlogs, getDraftBlogs, getAllTags } = useBlogs()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'published' | 'draft'>('all')

  console.log('Blogs:', blogs)

  const getFilteredBlogs = () => {
    let filteredBlogs = blogs

    // Apply status filter
    if (filterType === 'published') {
      filteredBlogs = getPublishedBlogs()
    } else if (filterType === 'draft') {
      filteredBlogs = getDraftBlogs()
    }

    // Apply search filter
    if (searchTerm) {
      filteredBlogs = filteredBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    return filteredBlogs
  }

  const filteredBlogs = getFilteredBlogs()

  const handleAddBlog = async (data: BlogFormData) => {
    try {
      await addBlog(data)
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Failed to create blog post:', error)
    }
  }

  const handleUpdateBlog = async (id: string, data: BlogFormData) => {
    try {
      await updateBlog(id, data)
    } catch (error) {
      console.error('Failed to update blog post:', error)
    }
  }

  const handleDeleteBlog = async (id: string) => {
    try {
      deleteBlog(id)
    } catch (error) {
      console.error('Failed to delete blog post:', error)
    }
  }

  // Calculate stats
  const publishedCount = getPublishedBlogs().length
  const draftCount = getDraftBlogs().length
  const totalTags = getAllTags().length

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='mb-2 flex items-center gap-3'>
          <div className='rounded-lg bg-primary/10 p-2'>
            <BookOpen className='h-6 w-6 text-primary' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-foreground'>Blog Posts</h1>
            <p className='text-default-500'>Create and manage your blog content</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-default-600'>Total Blog Posts</p>
              <p className='mt-2 text-3xl font-bold text-foreground'>{blogs.length}</p>
            </div>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
              <BookOpen className='h-6 w-6 text-primary' />
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-default-600'>Published</p>
              <p className='mt-2 text-3xl font-bold text-foreground'>{publishedCount}</p>
            </div>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-success/10'>
              <Eye className='h-6 w-6 text-success' />
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-default-600'>Drafts</p>
              <p className='mt-2 text-3xl font-bold text-foreground'>{draftCount}</p>
            </div>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10'>
              <FileText className='h-6 w-6 text-warning' />
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className='mb-8 rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <div className='relative max-w-md flex-1'>
            <Input
              placeholder='Search blog posts...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Search className='h-4 w-4 text-default-400' />}
              variant='bordered'
              className='w-full'
            />
          </div>

          <div className='flex items-center gap-4'>
            {/* Filter Chips */}
            <div className='flex gap-2'>
              <Chip
                color={filterType === 'all' ? 'primary' : 'default'}
                variant={filterType === 'all' ? 'solid' : 'flat'}
                className='cursor-pointer'
                onClick={() => setFilterType('all')}
              >
                All ({blogs.length})
              </Chip>
              <Chip
                color={filterType === 'published' ? 'success' : 'default'}
                variant={filterType === 'published' ? 'solid' : 'flat'}
                className='cursor-pointer'
                onClick={() => setFilterType('published')}
              >
                Published ({publishedCount})
              </Chip>
              <Chip
                color={filterType === 'draft' ? 'warning' : 'default'}
                variant={filterType === 'draft' ? 'solid' : 'flat'}
                className='cursor-pointer'
                onClick={() => setFilterType('draft')}
              >
                Drafts ({draftCount})
              </Chip>
            </div>

            <Button
              color='primary'
              startContent={<Plus className='h-4 w-4' />}
              onPress={() => setIsAddModalOpen(true)}
              className='gap-2'
            >
              New Blog Post
            </Button>
          </div>
        </div>
      </div>

      {/* Blog Posts List Container */}
      <div className='rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
        <BlogList
          blogs={filteredBlogs}
          loading={loading}
          searchTerm={searchTerm}
          onUpdate={handleUpdateBlog}
          onDelete={handleDeleteBlog}
          onCreateNew={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Add Blog Modal */}
      <BlogModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddBlog} />
    </div>
  )
}
