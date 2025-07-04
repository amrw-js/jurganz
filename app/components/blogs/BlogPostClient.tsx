'use client'

import { Button, Chip } from '@heroui/react'
import { format, formatDistanceToNow } from 'date-fns'
import { AlertCircle, ArrowLeft, Bookmark, Calendar, Clock, Eye, RefreshCw, Share2 } from 'lucide-react'
import Link from 'next/link'

import { useBlog } from '@/app/hooks/useBlogs'

import BlogPostSkeleton from './BlogPostSkeleton'

interface BlogPostClientProps {
  id: string
}

export default function BlogPostClient({ id }: BlogPostClientProps) {
  const { data: blog, isLoading, error, refetch, isRefetching } = useBlog(id)

  if (isLoading) {
    return <BlogPostSkeleton />
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 dark:from-slate-900 dark:to-slate-800'>
        <div className='rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-700 dark:bg-slate-800'>
          <AlertCircle className='mx-auto mb-4 h-16 w-16 text-red-500' />
          <h3 className='mb-2 text-xl font-bold text-slate-900 dark:text-white'>Something went wrong</h3>
          <p className='mb-6 text-slate-600 dark:text-slate-400'>We couldn't load this blog post. Please try again.</p>
          <div className='flex justify-center gap-3'>
            <Button as={Link} href='/blogs' variant='bordered' startContent={<ArrowLeft className='h-4 w-4' />}>
              Back to Blog
            </Button>
            <Button
              onPress={() => refetch()}
              isLoading={isRefetching}
              color='primary'
              startContent={<RefreshCw className='h-4 w-4' />}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 dark:from-slate-900 dark:to-slate-800'>
        <div className='text-center'>
          <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700'>
            <Eye className='h-12 w-12 text-slate-400' />
          </div>
          <h1 className='mb-4 text-2xl font-bold text-slate-900 dark:text-white'>Article not found</h1>
          <p className='mb-8 text-slate-600 dark:text-slate-400'>
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button as={Link} href='/blogs' color='primary' size='lg' startContent={<ArrowLeft className='h-4 w-4' />}>
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMMM dd, yyyy')
  }

  const formatRelativeDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  const featuredImage = blog.media?.[0]

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80'>
        <div className='container mx-auto px-4 py-4'>
          <div className='mx-auto flex items-center justify-between'>
            <Button
              as={Link}
              href='/blogs'
              variant='light'
              startContent={<ArrowLeft className='h-4 w-4' />}
              className='font-medium'
            >
              Back to Blog
            </Button>

            <div className='flex items-center gap-2'>
              <Button isIconOnly variant='light' className='text-slate-600 dark:text-slate-400'>
                <Share2 className='h-4 w-4' />
              </Button>
              <Button isIconOnly variant='light' className='text-slate-600 dark:text-slate-400'>
                <Bookmark className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className='container mx-auto px-4 py-8'>
        <div className='mx-auto'>
          {/* Article Header */}
          <header className='mb-12 text-center'>
            <div className='mb-6 flex items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400'>
              <Calendar className='h-4 w-4' />
              <span>{formatDate(blog.createdAt)}</span>
              <span>•</span>
              <span>{formatRelativeDate(blog.createdAt)}</span>
              {blog.updatedAt !== blog.createdAt && (
                <>
                  <span>•</span>
                  <Clock className='h-4 w-4' />
                  <span>Updated {formatRelativeDate(blog.updatedAt)}</span>
                </>
              )}
            </div>

            <h1 className='mb-6 text-4xl font-bold leading-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl'>
              {blog.title}
            </h1>

            {blog.media && blog.media.length > 0 && (
              <div className='mb-8 flex items-center justify-center gap-2'>
                <Chip variant='flat' color='secondary' size='sm'>
                  {blog.media.length} image{blog.media.length > 1 ? 's' : ''}
                </Chip>
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className='overflow-hidden rounded-2xl'>
            <div className='p-8 md:p-12'>
              <div
                className='prose prose-lg md:prose-xl dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12 first:prose-h1:mt-0 prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 first:prose-h2:mt-0 prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 first:prose-h3:mt-0 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-slate-800 dark:prose-code:text-slate-200 prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-li:mb-2 prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 max-w-none'
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>

          {/* Additional Media Gallery */}
          {blog.media && blog.media.length > 1 && (
            <div className='mt-16'>
              <h3 className='mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white'>Gallery</h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {blog.media.slice(1).map((media, index) => (
                  <div key={index} className='group'>
                    <div className='aspect-square overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl'>
                      <img
                        src={media.url || '/placeholder.svg'}
                        alt={`Gallery image ${index + 2}`}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article Footer */}
          <footer className='mt-16 border-t border-slate-200 pt-8 text-center dark:border-slate-700'>
            <Button
              as={Link}
              href='/blogs'
              color='primary'
              size='lg'
              startContent={<ArrowLeft className='h-4 w-4' />}
              className='font-medium'
            >
              Back to All Articles
            </Button>
          </footer>
        </div>
      </article>
    </div>
  )
}
