'use client'

import { Button, Chip } from '@heroui/react'
import { format, formatDistanceToNow } from 'date-fns'
import { AlertCircle, ArrowLeft, Bookmark, Calendar, Clock, Eye, RefreshCw, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { useBlog } from '@/app/hooks/useBlogs'

import BlogPostSkeleton from './BlogPostSkeleton'

interface BlogPostClientProps {
  id: string
}

// Helper function to get the display image for a blog
const getBlogDisplayImage = (blog: any) => {
  // Priority: feature image first, then first media image, then null
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

export default function BlogPostClient({ id }: BlogPostClientProps) {
  const { t } = useTranslation('blog')
  const { data: blog, isLoading, error, refetch, isRefetching } = useBlog(id)

  if (isLoading) {
    return <BlogPostSkeleton />
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 dark:from-slate-900 dark:to-slate-800'>
        <div className='rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-700 dark:bg-slate-800'>
          <AlertCircle className='mx-auto mb-4 h-16 w-16 text-red-500' />
          <h3 className='mb-2 text-xl font-bold text-slate-900 dark:text-white'>{t('blog:somethingWentWrong')}</h3>
          <p className='mb-6 text-slate-600 dark:text-slate-400'>{t('blog:couldNotLoadPost')}</p>
          <div className='flex justify-center gap-3'>
            <Button as={Link} href='/blogs' variant='bordered' startContent={<ArrowLeft className='h-4 w-4' />}>
              {t('blog:backToBlog')}
            </Button>
            <Button
              onPress={() => refetch()}
              isLoading={isRefetching}
              color='primary'
              startContent={<RefreshCw className='h-4 w-4' />}
            >
              {t('blog:tryAgain')}
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
          <h1 className='mb-4 text-2xl font-bold text-slate-900 dark:text-white'>{t('blog:articleNotFound')}</h1>
          <p className='mb-8 text-slate-600 dark:text-slate-400'>{t('blog:articleNotFoundDescription')}</p>
          <Button as={Link} href='/blogs' color='primary' size='lg' startContent={<ArrowLeft className='h-4 w-4' />}>
            {t('blog:backToBlog')}
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'MMMM dd, yyyy')
  }

  const formatRelativeDate = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  const displayImage = getBlogDisplayImage(blog)

  // Get remaining media for gallery (excluding the feature image from media array)
  const galleryMedia = blog.media
    ? blog.media.filter((media: any, index: number) => {
        // If we have a feature image, show all media in gallery
        // If no feature image, skip the first media item as it's used as header image
        if (blog.featureImage) {
          return true
        }
        return index > 0
      })
    : []

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
              {t('blog:backToBlog')}
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
                  <span>
                    {t('blog:updated')} {formatRelativeDate(blog.updatedAt)}
                  </span>
                </>
              )}
            </div>

            <h1 className='mb-6 text-4xl font-bold leading-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl'>
              {blog.title}
            </h1>

            <div className='mb-8 flex items-center justify-center gap-2'>
              {blog.featureImage && (
                <Chip variant='flat' color='primary' size='sm'>
                  {t('blog:featured')}
                </Chip>
              )}
              {blog.media && blog.media.length > 0 && (
                <Chip variant='flat' color='secondary' size='sm'>
                  {blog.media.length} {blog.media.length > 1 ? t('blog:images') : t('blog:image')}
                </Chip>
              )}
            </div>
          </header>

          {/* Feature Image */}
          {displayImage && (
            <div className='mb-32'>
              <div className='overflow-hidden rounded-2xl'>
                <img src={displayImage} alt={blog.title} className='mx-auto w-full object-cover lg:w-2/3' />
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className='mb-12'>
            <div
              className='tiptap-content prose prose-lg md:prose-xl dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12 first:prose-h1:mt-0 prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 first:prose-h2:mt-0 prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 first:prose-h3:mt-0 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-slate-800 dark:prose-code:text-slate-200 prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-li:mb-2 prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 max-w-none'
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Additional Media Gallery */}
          {galleryMedia && galleryMedia.length > 0 && (
            <div className='mt-16'>
              <h3 className='mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white'>
                {t('blog:gallery')}
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {galleryMedia.map((media: any, index: number) => (
                  <div key={index} className='group'>
                    <div className='aspect-square overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl'>
                      <img
                        src={media.url || '/placeholder.svg'}
                        alt={`${t('blog:galleryImageAlt')} ${index + 1}`}
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
              {t('blog:backToAllArticles')}
            </Button>
          </footer>
        </div>
      </article>
    </div>
  )
}
