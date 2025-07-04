'use client'

import { Button } from '@heroui/react'
import { AlertCircle, RefreshCw, Search } from 'lucide-react'
import { useState } from 'react'

import { useBlogs } from '@/app/hooks/useBlogs'

import BlogCard from './BlogCard'
import BlogCardSkeleton from './BlogCardSkeleton'

export default function BlogsListClient() {
  const { data: blogs, isLoading, error, refetch, isRefetching } = useBlogs()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBlogs = blogs?.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className='space-y-8'>
        {/* Search Skeleton */}
        <div className='mx-auto'>
          <div className='h-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700' />
        </div>

        {/* Featured Post Skeleton */}
        <div className='mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <BlogCardSkeleton featured />
          <div className='space-y-4'>
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        </div>

        {/* Regular Posts Skeleton */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <div className='rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20'>
          <AlertCircle className='mx-auto mb-4 h-12 w-12 text-red-500' />
          <h3 className='mb-2 text-lg font-semibold text-red-900 dark:text-red-100'>Oops! Something went wrong</h3>
          <p className='mb-6 text-red-700 dark:text-red-300'>We couldn't load the blog posts. Please try again.</p>
          <Button
            onPress={() => refetch()}
            isLoading={isRefetching}
            color='danger'
            variant='flat'
            startContent={<RefreshCw className='h-4 w-4' />}
            className='font-medium'
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className='py-20 text-center'>
        <div className='mx-auto'>
          <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800'>
            <Search className='h-12 w-12 text-slate-400' />
          </div>
          <h3 className='mb-4 text-2xl font-bold text-slate-900 dark:text-white'>No posts yet</h3>
          <p className='text-lg text-slate-600 dark:text-slate-400'>
            We're working on some amazing content. Check back soon!
          </p>
        </div>
      </div>
    )
  }

  const featuredPost = filteredBlogs?.[0]
  const regularPosts = filteredBlogs?.slice(1) || []

  return (
    <div className='space-y-12'>
      {/* Search Bar */}
      <div className='mx-auto max-w-md'>
        <div className='relative'>
          <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400' />
          <input
            type='text'
            placeholder='Search articles...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
          />
        </div>
      </div>

      {filteredBlogs && filteredBlogs.length === 0 && searchTerm && (
        <div className='py-12 text-center'>
          <p className='text-lg text-slate-600 dark:text-slate-400'>No articles found for "{searchTerm}"</p>
        </div>
      )}

      {/* Featured Post */}
      {featuredPost && !searchTerm && (
        <div className='mb-16'>
          <div className='mb-8 text-center'>
            <span className='inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'>
              ✨ Featured Article
            </span>
          </div>
          <BlogCard blog={featuredPost} featured />
        </div>
      )}

      {/* Regular Posts */}
      {regularPosts.length > 0 && (
        <div>
          {!searchTerm && (
            <h2 className='mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white'>Latest Articles</h2>
          )}
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3'>
            {(searchTerm ? filteredBlogs : regularPosts)?.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
