import type { Metadata } from 'next'

import BlogsListClient from '@/app/components/blogs/BlogsListClient'
import { IPage } from '@/app/global.interface'
import { getTranslation } from '@/lib/i18n-server'

export const metadata: Metadata = {
  title: 'Blog Posts',
  description: 'Read our latest blog posts and articles',
}

const BlogsPage = async (props: IPage) => {
  const { params } = props
  const { locale } = await params
  const { t } = await getTranslation(locale, ['default', 'blogs'])

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mx-auto'>
          <div className='mb-12 text-center'>
            <h1 className='mb-4 text-4xl font-bold tracking-tight'>{t('blogs:heading')}</h1>
            <p className='mx-auto text-xl text-foreground-500'>{t('blogs:subtitle')}</p>
          </div>
          <BlogsListClient />
        </div>
      </div>
    </div>
  )
}

export default BlogsPage
