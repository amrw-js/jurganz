import type { Metadata } from 'next'

import BlogPostClient from '@/app/components/blogs/BlogPostClient'

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  // In a real app, you might want to fetch the blog data here for SEO
  return {
    title: 'Blog Post',
    description: 'Read this blog post',
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <div className='min-h-screen bg-background'>
      <BlogPostClient id={params.id} />
    </div>
  )
}
