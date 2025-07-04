import { Skeleton } from '@heroui/react'

export default function BlogPostSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800'>
      {/* Header */}
      <header className='border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80'>
        <div className='container mx-auto px-4 py-4'>
          <div className='mx-auto flex max-w-4xl items-center justify-between'>
            <Skeleton className='h-10 w-32 rounded' />
            <div className='flex items-center gap-2'>
              <Skeleton className='h-10 w-10 rounded' />
              <Skeleton className='h-10 w-10 rounded' />
            </div>
          </div>
        </div>
      </header>

      {/* Article */}
      <div className='container mx-auto px-4 py-8'>
        <div className='mx-auto max-w-4xl'>
          {/* Article Header */}
          <header className='mb-12 text-center'>
            <div className='mb-6 flex items-center justify-center gap-3'>
              <Skeleton className='h-4 w-4 rounded' />
              <Skeleton className='h-4 w-32 rounded' />
              <Skeleton className='h-4 w-20 rounded' />
            </div>

            <Skeleton className='mb-4 h-16 w-full rounded' />
            <Skeleton className='mx-auto mb-6 h-16 w-3/4 rounded' />
            <Skeleton className='mx-auto h-6 w-20 rounded-full' />
          </header>

          {/* Featured Image */}
          <div className='mb-12'>
            <div className='aspect-[16/9] overflow-hidden rounded-2xl'>
              <Skeleton className='h-full w-full' />
            </div>
          </div>

          {/* Article Content */}
          <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800'>
            <div className='space-y-6 p-8 md:p-12'>
              <Skeleton className='h-6 w-full rounded' />
              <Skeleton className='h-6 w-full rounded' />
              <Skeleton className='h-6 w-3/4 rounded' />
              <div className='py-4'>
                <Skeleton className='h-32 w-full rounded' />
              </div>
              <Skeleton className='h-6 w-full rounded' />
              <Skeleton className='h-6 w-5/6 rounded' />
              <Skeleton className='h-6 w-full rounded' />
              <Skeleton className='h-6 w-2/3 rounded' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
