'use client'

import { Chip } from '@heroui/react'
import { formatDistanceToNow } from 'date-fns'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

import type { Blog } from '@/types/blog.types'

interface BlogCardProps {
  blog: Blog
  featured?: boolean
}

export default function BlogCard({ blog, featured = false }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  const getExcerpt = (content: string, maxLength = featured ? 200 : 120) => {
    const plainText = content.replace(/<[^>]*>/g, '')
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength).trim() + '...'
  }

  const featuredImage = blog.media?.[0]

  if (featured) {
    return (
      <Link href={`/blogs/${blog.id}`} className='group block'>
        <article className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800'>
          <div className='grid min-h-[500px] grid-cols-1 lg:grid-cols-2'>
            {/* Image */}
            <div className='relative overflow-hidden'>
              {featuredImage ? (
                <img
                  src={featuredImage.url || '/placeholder.svg'}
                  alt={blog.title}
                  className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'>
                  <div className='text-6xl font-bold text-white opacity-20'>{blog.title.charAt(0)}</div>
                </div>
              )}
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
            </div>

            {/* Content */}
            <div className='flex flex-col justify-center p-8 lg:p-12'>
              <div className='mb-4 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400'>
                <Calendar className='h-4 w-4' />
                <span>{formatDate(blog.createdAt)}</span>
              </div>

              <h2 className='mb-4 text-3xl font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 lg:text-4xl'>
                {blog.title}
              </h2>

              <p className='mb-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300'>
                {getExcerpt(blog.content)}
              </p>

              <div className='flex items-center font-semibold text-blue-600 transition-all duration-300 group-hover:gap-3 dark:text-blue-400'>
                <span>Read full article</span>
                <ArrowRight className='h-5 w-5 transition-transform duration-300 group-hover:translate-x-1' />
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blogs/${blog.id}`} className='group block'>
      <article className='h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800'>
        {/* Image */}
        <div className='relative aspect-[16/10] overflow-hidden'>
          {featuredImage ? (
            <img
              src={featuredImage.url || '/placeholder.svg'}
              alt={blog.title}
              className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800'>
              <div className='text-4xl font-bold text-slate-400 opacity-30'>{blog.title.charAt(0)}</div>
            </div>
          )}
          <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent' />
        </div>

        {/* Content */}
        <div className='p-6'>
          <div className='mb-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400'>
            <Calendar className='h-4 w-4' />
            <span>{formatDate(blog.createdAt)}</span>
            {blog.updatedAt !== blog.createdAt && (
              <>
                <span>•</span>
                <Clock className='h-4 w-4' />
                <span>Updated</span>
              </>
            )}
          </div>

          <h3 className='mb-3 line-clamp-2 text-xl font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
            {blog.title}
          </h3>

          <p className='mb-4 line-clamp-3 leading-relaxed text-slate-600 dark:text-slate-300'>
            {getExcerpt(blog.content)}
          </p>

          <div className='flex items-center justify-between'>
            {blog.media?.length ? (
              <Chip size='sm' variant='flat' color='secondary' className='text-xs'>
                {blog.media.length} image{blog.media.length > 1 ? 's' : ''}
              </Chip>
            ) : (
              <div />
            )}

            <div className='flex items-center text-sm font-medium text-blue-600 transition-all duration-300 group-hover:gap-2 dark:text-blue-400'>
              <span>Read more</span>
              <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
