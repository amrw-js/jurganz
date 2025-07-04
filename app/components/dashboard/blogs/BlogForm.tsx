'use client'

import { Button, Card, CardBody, CardFooter, Input } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useCreateBlog, useUpdateBlog } from '@/app/hooks/useBlogs'
import type { Blog, BlogFormData } from '@/types/blog.types'

import RichTextEditor from './RichTextEditor'

interface BlogFormProps {
  blog?: Blog
}

export default function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter()
  const createBlogMutation = useCreateBlog()
  const updateBlogMutation = useUpdateBlog()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BlogFormData>({
    defaultValues: {
      title: blog?.title || '',
      content: blog?.content || '',
      media: blog?.media || [],
    },
  })

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true)
    try {
      if (blog) {
        // Update existing blog
        await updateBlogMutation.mutateAsync({
          id: blog.id,
          data: {
            title: data.title,
            content: data.content,
            media: data.media,
          },
        })
        router.push(`/dashboard/blogs/${blog.id}`)
      } else {
        // Create new blog
        const newBlog = await createBlogMutation.mutateAsync({
          title: data.title,
          content: data.content,
          media: data.media,
        })
        router.push(`/dashboard/blogs/${newBlog.id}`)
      }
    } catch (error) {
      console.error('Error saving blog:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardBody className='gap-6'>
          {/* Title */}
          <Input
            label='Blog Title'
            placeholder='Enter your blog title...'
            isRequired
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' },
            })}
            isInvalid={!!errors.title}
            errorMessage={errors.title?.message}
          />

          {/* Content Editor */}
          <div>
            <label className='mb-2 block text-sm font-medium'>Content</label>
            <Controller
              name='content'
              control={control}
              rules={{
                required: 'Content is required',
                minLength: { value: 10, message: 'Content must be at least 10 characters' },
              }}
              render={({ field }) => <RichTextEditor content={field.value} onChange={field.onChange} />}
            />
            {errors.content && <p className='mt-1 text-sm text-danger'>{errors.content.message}</p>}
          </div>
        </CardBody>

        <CardFooter className='justify-end gap-3'>
          <Button variant='light' onPress={() => router.back()}>
            Cancel
          </Button>
          <Button type='submit' color='primary' isLoading={isSubmitting}>
            {blog ? 'Update Blog' : 'Create Blog'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
