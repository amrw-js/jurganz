'use client'

import { Button, Card, CardBody, CardFooter, Image, Input, Switch } from '@heroui/react'
import { ImageIcon, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useCreateBlog, useUpdateBlog } from '@/app/hooks/useBlogs'
import { useUpload } from '@/app/hooks/useUpload'
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
  const [featureImageUrl, setFeatureImageUrl] = useState<string | null>(blog?.featureImage || null)
  const [enableArabic, setEnableArabic] = useState(Boolean(blog?.arTitle || blog?.arContent))

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BlogFormData>({
    defaultValues: {
      title: blog?.title || '',
      content: blog?.content || '',
      arTitle: blog?.arTitle || '',
      arContent: blog?.arContent || '',
      featureImage: blog?.featureImage || '',
      media: blog?.media || [],
    },
  })

  const featureImageUpload = useUpload({
    onSuccess: (media) => {
      if (media && media.length > 0) {
        const uploadedImage = media[0]
        setFeatureImageUrl(uploadedImage.url)
        setValue('featureImage', uploadedImage.url)
      }
    },
    onError: (error) => {
      console.error('Feature image upload error:', error)
    },
  })

  const handleFeatureImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      featureImageUpload.uploadSingle(file)
    }
  }

  const removeFeatureImage = () => {
    setFeatureImageUrl(null)
    setValue('featureImage', '')
  }

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true)
    try {
      const blogData = {
        title: data.title,
        content: data.content,
        arTitle: enableArabic ? data.arTitle : undefined,
        arContent: enableArabic ? data.arContent : undefined,
        featureImage: data.featureImage,
        media: data.media,
      }

      if (blog) {
        // Update existing blog
        await updateBlogMutation.mutateAsync({
          id: blog.id,
          data: blogData,
        })
        router.push(`/dashboard/blogs/${blog.id}`)
      } else {
        // Create new blog
        const newBlog = await createBlogMutation.mutateAsync(blogData)
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
          {/* Arabic Content Toggle */}
          <div className='flex items-center gap-3'>
            <Switch isSelected={enableArabic} onValueChange={setEnableArabic} color='primary'>
              Enable Arabic Content
            </Switch>
            <span className='text-sm text-gray-600'>Add Arabic translations for your blog</span>
          </div>

          {/* English Title */}
          <Input
            label='Blog Title (English)'
            placeholder='Enter your blog title...'
            isRequired
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' },
            })}
            isInvalid={!!errors.title}
            errorMessage={errors.title?.message}
          />

          {/* Arabic Title */}
          {enableArabic && (
            <Input
              label='Blog Title (Arabic)'
              placeholder='أدخل عنوان المدونة...'
              dir='rtl'
              {...register('arTitle', {
                minLength: { value: 3, message: 'Arabic title must be at least 3 characters' },
              })}
              isInvalid={!!errors.arTitle}
              errorMessage={errors.arTitle?.message}
            />
          )}

          {/* Feature Image */}
          <div>
            <label className='mb-2 block text-sm font-medium'>Feature Image</label>
            <div className='space-y-3'>
              {featureImageUrl ? (
                <div className='relative'>
                  <Image src={featureImageUrl} alt='Feature image' className='h-48 w-full rounded-lg object-cover' />
                  <Button
                    isIconOnly
                    size='sm'
                    color='danger'
                    variant='solid'
                    className='absolute right-2 top-2'
                    onPress={removeFeatureImage}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className='relative'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleFeatureImageUpload}
                    className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
                    id='feature-image-upload'
                  />
                  <div className='flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400'>
                    <div className='text-center'>
                      {featureImageUpload.isUploading ? (
                        <div className='space-y-2'>
                          <div className='text-sm text-gray-600'>Uploading...</div>
                          <div className='h-2 w-32 rounded-full bg-gray-200'>
                            <div
                              className='h-2 rounded-full bg-primary transition-all duration-300'
                              style={{ width: `${featureImageUpload.progress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className='space-y-2'>
                          <ImageIcon className='mx-auto h-12 w-12 text-gray-400' />
                          <div className='text-sm text-gray-600'>Click to upload feature image</div>
                          <div className='text-xs text-gray-500'>PNG, JPG, GIF up to 5MB</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {featureImageUpload.error && <p className='mt-1 text-sm text-danger'>{featureImageUpload.error}</p>}
          </div>

          {/* English Content Editor */}
          <div>
            <label className='mb-2 block text-sm font-medium'>Content (English)</label>
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

          {/* Arabic Content Editor */}
          {enableArabic && (
            <div>
              <label className='mb-2 block text-sm font-medium'>Content (Arabic)</label>
              <Controller
                name='arContent'
                control={control}
                rules={{
                  minLength: { value: 10, message: 'Arabic content must be at least 10 characters' },
                }}
                render={({ field }) => <RichTextEditor content={field.value ?? ''} onChange={field.onChange} />}
              />
              {errors.arContent && <p className='mt-1 text-sm text-danger'>{errors.arContent.message}</p>}
            </div>
          )}
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
