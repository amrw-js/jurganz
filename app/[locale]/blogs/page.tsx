import type { Metadata } from 'next'

import BlogsListClient from '@/app/components/blogs/BlogsListClient'

export const metadata: Metadata = {
  title: 'Blog Posts',
  description: 'Read our latest blog posts and articles',
}

export default function BlogsPage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mx-auto'>
          <div className='mb-12 text-center'>
            <h1 className='mb-4 text-4xl font-bold tracking-tight'>Our Blog</h1>
            <p className='mx-auto text-xl text-foreground-500'>
              Discover insights, tutorials, and stories from our team
            </p>
          </div>
          <BlogsListClient />
        </div>
      </div>
    </div>
  )
}
