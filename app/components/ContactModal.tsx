'use client'

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@heroui/react'
import { Building2, Mail, Phone, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import type { ProductionLine } from '@/types/production-line.types'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  productionLine: ProductionLine
}

interface ContactFormData {
  fullName: string
  companyName: string
  emailAddress: string
  phoneNumber: string
  message: string
}

export function ContactModal({ isOpen, onClose, productionLine }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    mode: 'onChange',
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      // Here you would send the contact form data to your API
      console.log('Contact form submitted:', {
        ...data,
        productionLineId: productionLine.id,
        productionLineName: `${productionLine.productType} Production Line`,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message or handle success
      alert('Your inquiry has been sent successfully!')
      handleClose()
    } catch (error) {
      console.error('Error sending inquiry:', error)
      alert('Failed to send inquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement='center'
      backdrop='opaque'
      size='2xl'
      scrollBehavior='inside'
      classNames={{
        backdrop: 'bg-black/50 backdrop-opacity-50',
        base: 'max-h-[90vh]',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1 px-8 py-6'>
              <h2 className='text-2xl font-bold text-gray-900'>Get in Touch</h2>
              <p className='text-sm font-normal text-gray-600'>
                Send an inquiry about this production line and we'll connect you with the seller.
              </p>
            </ModalHeader>

            <form onSubmit={handleSubmit(onSubmit)} className='flex h-full min-h-0 flex-col'>
              <ModalBody className='px-8 py-0'>
                <div className='space-y-6'>
                  {/* Production Line Info (Disabled) */}
                  <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
                    <h3 className='mb-4 text-lg font-semibold text-gray-900'>Production Line Details</h3>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <Input
                        label='Production Line'
                        value={`${productionLine.productType} Production Line`}
                        isDisabled
                        variant='bordered'
                        classNames={{
                          input: 'text-gray-700',
                          label: 'text-gray-600',
                        }}
                      />
                      <Input
                        label='Container Type'
                        value={productionLine.containerType}
                        isDisabled
                        variant='bordered'
                        classNames={{
                          input: 'text-gray-700',
                          label: 'text-gray-600',
                        }}
                      />
                      <Input
                        label='Capacity'
                        value={productionLine.capacity}
                        isDisabled
                        variant='bordered'
                        classNames={{
                          input: 'text-gray-700',
                          label: 'text-gray-600',
                        }}
                      />
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>Your Information</h3>

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <Input
                        {...register('fullName', {
                          required: 'Full name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters',
                          },
                        })}
                        label='Full Name'
                        placeholder='Enter your full name'
                        isInvalid={!!errors.fullName}
                        errorMessage={errors.fullName?.message}
                        variant='bordered'
                        startContent={<User className='h-4 w-4 text-gray-400' />}
                        isRequired
                      />

                      <Input
                        {...register('companyName', {
                          required: 'Company name is required',
                          minLength: {
                            value: 2,
                            message: 'Company name must be at least 2 characters',
                          },
                        })}
                        label='Company Name'
                        placeholder='Enter your company name'
                        isInvalid={!!errors.companyName}
                        errorMessage={errors.companyName?.message}
                        variant='bordered'
                        startContent={<Building2 className='h-4 w-4 text-gray-400' />}
                        isRequired
                      />
                    </div>

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <Input
                        {...register('emailAddress', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        label='Email Address'
                        placeholder='Enter your email address'
                        type='email'
                        isInvalid={!!errors.emailAddress}
                        errorMessage={errors.emailAddress?.message}
                        variant='bordered'
                        startContent={<Mail className='h-4 w-4 text-gray-400' />}
                        isRequired
                      />

                      <Input
                        {...register('phoneNumber', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[+]?[\d\s\-$$$$]+$/,
                            message: 'Invalid phone number',
                          },
                        })}
                        label='Phone Number'
                        placeholder='Enter your phone number'
                        isInvalid={!!errors.phoneNumber}
                        errorMessage={errors.phoneNumber?.message}
                        variant='bordered'
                        startContent={<Phone className='h-4 w-4 text-gray-400' />}
                        isRequired
                      />
                    </div>

                    <Textarea
                      {...register('message', {
                        required: 'Message is required',
                        minLength: {
                          value: 10,
                          message: 'Message must be at least 10 characters',
                        },
                        maxLength: {
                          value: 500,
                          message: 'Message cannot exceed 500 characters',
                        },
                      })}
                      label='Message'
                      placeholder='Tell us about your requirements, timeline, and any specific questions...'
                      isInvalid={!!errors.message}
                      errorMessage={errors.message?.message}
                      variant='bordered'
                      minRows={4}
                      maxRows={6}
                      isRequired
                    />
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className='px-8 py-6'>
                <Button color='danger' variant='light' onPress={handleClose} isDisabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  color='primary'
                  type='submit'
                  isLoading={isSubmitting}
                  isDisabled={!isValid}
                  className='bg-gray-900 text-white hover:bg-gray-800'
                >
                  Send Inquiry
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
