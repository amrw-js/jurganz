'use client'

import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Textarea,
} from '@heroui/react'
import { Plus, X } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'

import type { Blog, BlogFormData, BlogMedia } from '@/types/blog.types'

import { ImageUploader } from '../components/ImageUploader'
import { RichTextEditor } from '../components/RichTextEditor'

interface BlogModalProps {
  blog?: Blog
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BlogFormData) => Promise<void>
}

export function BlogModal({ blog, isOpen, onClose, onSubmit }: BlogModalProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: null,
    media: [],
    tags: [],
    status: 'draft',
  })
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>('')

  // Initialize form data when blog prop changes
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || '',
        content: blog.content,
        featuredImage: null,
        media: blog.media || [],
        tags: blog.tags,
        status: blog.status,
      })
      setFeaturedImagePreview(blog.featuredImage || '')
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: null,
        media: [],
        tags: [],
        status: 'draft',
      })
      setFeaturedImagePreview('')
    }
  }, [blog])

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !blog ? generateSlug(title) : prev.slug, // Only auto-generate for new blogs
    }))
  }

  const handleFeaturedImageChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, featuredImage: file }))

    if (file) {
      const url = URL.createObjectURL(file)
      setFeaturedImagePreview(url)
    } else {
      setFeaturedImagePreview('')
    }
  }

  const handleMediaChange = (media: BlogMedia[]) => {
    setFormData((prev) => ({ ...prev, media }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Failed to save blog:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (featuredImagePreview && formData.featuredImage) {
      URL.revokeObjectURL(featuredImagePreview)
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      size='5xl'
      scrollBehavior='inside'
      classNames={{
        base: 'max-h-[90vh]',
        body: 'py-6',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              <h2 className='text-xl font-semibold'>{blog ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
              <p className='text-sm font-normal text-default-500'>
                {blog ? 'Update your blog post details' : 'Fill in the details for your new blog post'}
              </p>
            </ModalHeader>

            <ModalBody className='gap-6'>
              {/* Basic Information */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Basic Information</h3>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Input
                    label='Title'
                    placeholder='Enter blog title'
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    isRequired
                    variant='bordered'
                  />

                  <Input
                    label='Slug'
                    placeholder='blog-post-slug'
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    isRequired
                    variant='bordered'
                    description='URL-friendly version of the title'
                  />
                </div>

                <Textarea
                  label='Excerpt'
                  placeholder='Brief description of the blog post'
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  variant='bordered'
                  minRows={2}
                  maxRows={4}
                />
              </div>

              {/* Tags */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Tags</h3>

                <div className='flex gap-2'>
                  <Input
                    placeholder='Add a tag'
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant='bordered'
                    className='flex-1'
                  />
                  <Button
                    color='primary'
                    variant='flat'
                    onPress={handleAddTag}
                    isDisabled={!newTag.trim() || formData.tags.includes(newTag.trim())}
                    startContent={<Plus className='h-4 w-4' />}
                  >
                    Add
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        color='primary'
                        variant='flat'
                        onClose={() => handleRemoveTag(tag)}
                        endContent={<X className='h-3 w-3' />}
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Image */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Featured Image</h3>

                <div className='space-y-3'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleFeaturedImageChange(e.target.files?.[0] || null)}
                    className='block w-full text-sm text-default-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-600'
                  />

                  {featuredImagePreview && (
                    <Card className='w-full max-w-sm'>
                      <CardBody className='p-0'>
                        <img
                          src={featuredImagePreview || '/placeholder.svg'}
                          alt='Featured image preview'
                          className='h-48 w-full rounded-lg object-cover'
                        />
                      </CardBody>
                    </Card>
                  )}
                </div>
              </div>

              {/* Additional Media */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Additional Media</h3>
                <p className='text-sm text-default-500'>Upload images and videos to use in your blog content</p>

                <ImageUploader
                  files={formData.media}
                  onChange={handleMediaChange}
                  maxFiles={10}
                  maxFileSize={10 * 1024 * 1024}
                  acceptVideo={true}
                  autoUpload={false}
                  onUploadComplete={(uploadedMedia: BlogMedia | BlogMedia[]) => {
                    console.log('Media uploaded:', uploadedMedia)
                  }}
                />
              </div>

              {/* Content */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Content</h3>

                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                  placeholder='Write your blog post content here...'
                />
              </div>

              {/* Publishing Options */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Publishing</h3>

                <div className='flex items-center gap-3'>
                  <Switch
                    isSelected={formData.status === 'published'}
                    onValueChange={(isSelected) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: isSelected ? 'published' : 'draft',
                      }))
                    }
                    color='success'
                  >
                    Publish immediately
                  </Switch>
                  <span className='text-sm text-default-500'>
                    {formData.status === 'published' ? 'This post will be published' : 'Save as draft'}
                  </span>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant='light' onPress={handleClose}>
                Cancel
              </Button>
              <Button
                color='primary'
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!formData.title.trim() || !formData.content.trim()}
              >
                {isSubmitting ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
