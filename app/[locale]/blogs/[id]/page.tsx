import type { Metadata } from 'next'

import BlogPostClient from '@/app/components/blogs/BlogPostClient'

interface BlogPostPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog Post',
    description: 'Read this blog post',
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params
  return (
    <div className='min-h-screen bg-background'>
      <BlogPostClient id={id} />
    </div>
  )
}
