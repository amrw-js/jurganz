'use client'

import { Button, Input, Textarea } from '@heroui/react'
import { animated, useSpring } from '@react-spring/web'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'
import { toast } from 'sonner'

import { useContactForm } from '@/app/hooks/useContact'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  company?: string
  subject?: string
  message?: string
}

export const ContactUsForm = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // React Query hook
  const { submitForm, isLoading, isSuccess, isError, error, reset } = useContactForm()

  // Hook to observe when the form is in view
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.25,
  })

  const animationStyles = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(50px)',
    config: { tension: 200, friction: 30 },
  })

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success(t('contact_form_success'))
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      })
      setErrors({})
      reset() // Reset mutation state
    }
  }, [isSuccess, t, reset])

  // Handle error
  useEffect(() => {
    if (isError && error) {
      // Check if it's a validation error
      const errorMessage = error.message

      if (errorMessage.includes('validation') || errorMessage.includes('required')) {
        toast.error(t('contact_form_validation_error'))
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        toast.error(t('contact_form_network_error'))
      } else {
        toast.error(error.message || t('contact_form_error'))
      }
    }
  }, [isError, error, t])

  const handleInputChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('contact_form_name_required')
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('contact_form_name_min_length')
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('contact_form_email_required')
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t('contact_form_invalid_email')
      }
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
        newErrors.phone = t('contact_form_invalid_phone')
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t('contact_form_message_required')
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact_form_message_min_length')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error(t('contact_form_validation_error'))
      return
    }

    // Submit form using React Query
    submitForm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone.trim() || undefined,
      company: formData.company || undefined,
      subject: formData.subject || undefined,
      message: formData.message,
    })
  }

  return (
    <animated.form
      ref={ref}
      style={animationStyles}
      onSubmit={handleSubmit}
      className='flex flex-1 shrink-0 basis-1/2 flex-col gap-5 rounded-[1.25rem] bg-white px-5 py-8 shadow-md lg:px-10 lg:py-[1.625rem]'
    >
      <Input
        value={formData.name}
        onValueChange={handleInputChange('name')}
        placeholder={t('contact_form_name')}
        classNames={{
          inputWrapper: 'rounded-[0.313rem] px-8 py-[1.188rem] h-auto',
        }}
        variant='bordered'
        className='w-full'
        isRequired
        isInvalid={!!errors.name}
        errorMessage={errors.name}
        disabled={isLoading}
      />

      <Input
        value={formData.email}
        onValueChange={handleInputChange('email')}
        placeholder={t('contact_form_email')}
        type='email'
        classNames={{
          inputWrapper: 'rounded-[0.313rem] px-8 py-[1.188rem] h-auto',
        }}
        variant='bordered'
        className='w-full'
        isRequired
        isInvalid={!!errors.email}
        errorMessage={errors.email}
        disabled={isLoading}
      />

      <Input
        value={formData.phone}
        onValueChange={handleInputChange('phone')}
        placeholder={t('contact_form_phone')}
        type='tel'
        classNames={{
          inputWrapper: 'rounded-[0.313rem] px-8 py-[1.188rem] h-auto',
          input: 'text-left [&:not(:placeholder-shown)]:text-left',
        }}
        variant='bordered'
        className='w-full'
        isInvalid={!!errors.phone}
        errorMessage={errors.phone}
        disabled={isLoading}
        onKeyPress={(e) => {
          // Only allow numbers, +, -, (, ), and spaces
          const allowedChars = /[0-9+\-() ]/
          if (!allowedChars.test(e.key)) {
            e.preventDefault()
          }
        }}
      />

      <Input
        value={formData.company}
        onValueChange={handleInputChange('company')}
        placeholder={t('contact_form_company')}
        classNames={{
          inputWrapper: 'rounded-[0.313rem] px-8 py-[1.188rem] h-auto',
        }}
        variant='bordered'
        className='w-full'
        isInvalid={!!errors.company}
        errorMessage={errors.company}
        disabled={isLoading}
      />

      <Input
        value={formData.subject}
        onValueChange={handleInputChange('subject')}
        placeholder={t('contact_form_subject')}
        classNames={{
          inputWrapper: 'rounded-[0.313rem] px-8 py-[1.188rem] h-auto',
        }}
        variant='bordered'
        className='w-full'
        isInvalid={!!errors.subject}
        errorMessage={errors.subject}
        disabled={isLoading}
      />

      <Textarea
        value={formData.message}
        onValueChange={handleInputChange('message')}
        placeholder={t('contact_form_message')}
        variant='bordered'
        classNames={{
          inputWrapper: 'rounded-[0.313rem] px-8 py-[1.188rem] h-auto',
        }}
        isRequired
        isInvalid={!!errors.message}
        errorMessage={errors.message}
        disabled={isLoading}
      />

      <Button
        type='submit'
        size='lg'
        color='primary'
        className='min-w-40 self-center lg:self-end'
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? t('sending_label') : t('send_label')}
      </Button>
    </animated.form>
  )
}
