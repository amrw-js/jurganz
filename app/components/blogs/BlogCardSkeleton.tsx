import { Skeleton } from '@heroui/react'

interface BlogCardSkeletonProps {
  featured?: boolean
}

export default function BlogCardSkeleton({ featured = false }: BlogCardSkeletonProps) {
  if (featured) {
    return (
      <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800'>
        <div className='grid min-h-[500px] grid-cols-1 lg:grid-cols-2'>
          <Skeleton className='h-full w-full' />
          <div className='flex flex-col justify-center space-y-4 p-8 lg:p-12'>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-4 w-4 rounded' />
              <Skeleton className='h-4 w-20 rounded' />
            </div>
            <Skeleton className='h-8 w-full rounded' />
            <Skeleton className='h-8 w-3/4 rounded' />
            <Skeleton className='h-4 w-full rounded' />
            <Skeleton className='h-4 w-full rounded' />
            <Skeleton className='h-4 w-2/3 rounded' />
            <Skeleton className='h-6 w-32 rounded' />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800'>
      <div className='aspect-[16/10]'>
        <Skeleton className='h-full w-full' />
      </div>
      <div className='space-y-3 p-6'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-4 rounded' />
          <Skeleton className='h-4 w-20 rounded' />
        </div>
        <Skeleton className='h-6 w-full rounded' />
        <Skeleton className='h-6 w-3/4 rounded' />
        <Skeleton className='h-4 w-full rounded' />
        <Skeleton className='h-4 w-full rounded' />
        <Skeleton className='h-4 w-2/3 rounded' />
        <div className='flex items-center justify-between pt-2'>
          <Skeleton className='h-5 w-16 rounded-full' />
          <Skeleton className='h-4 w-20 rounded' />
        </div>
      </div>
    </div>
  )
}
