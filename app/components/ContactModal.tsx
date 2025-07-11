'use client'

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@heroui/react'
import { Building2, Mail, Phone, User } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import type { ProductionLine } from '@/types/production-line.types'

import { useSendProductionLineEmail } from '../hooks/useSendProductionLineEmail'
import { useTranslations } from '../hooks/useTranslations'

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
  const { t } = useTranslations()
  const { mutate: sendEmail, isPending, isSuccess, isError } = useSendProductionLineEmail()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    mode: 'onChange',
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Here you would send the contact form data to your API
      sendEmail({
        fullName: data.fullName.trim(),
        companyName: data.companyName.trim(),
        emailAddress: data.emailAddress.trim().toLowerCase(),
        phoneNumber: data.phoneNumber.trim(),
        message: data.message.trim(),
        productionLineName: `${productionLine.productType} Production Line`,
        containerType: productionLine.containerType.trim(),
        capacity: productionLine.capacity.trim(),
      })

      handleClose()
    } catch (error) {
      console.error('Error sending inquiry:', error)
    } finally {
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  useEffect(() => {
    if (!isSuccess && !isError) return
    handleClose()
  }, [isSuccess, isError])

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
        <>
          <ModalHeader className='flex flex-col gap-1 px-8 py-6'>
            <h2 className='text-2xl font-bold text-gray-900'>{t('getInTouch')}</h2>
            <p className='text-sm font-normal text-gray-600'>{t('sendInquiryDescription')}</p>
          </ModalHeader>

          <form onSubmit={handleSubmit(onSubmit)} className='flex h-full min-h-0 flex-col'>
            <ModalBody className='px-8 py-0'>
              <div className='space-y-6'>
                {/* Production Line Info (Disabled) */}
                <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
                  <h3 className='mb-4 text-lg font-semibold text-gray-900'>{t('productionLineDetails')}</h3>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      label={t('productionLineLabel')}
                      value={`${productionLine.productType} ${t('productionLine')}`}
                      isDisabled
                      variant='bordered'
                      classNames={{
                        input: 'text-gray-700',
                        label: 'text-gray-600',
                      }}
                    />
                    <Input
                      label={t('containerType')}
                      value={productionLine.containerType}
                      isDisabled
                      variant='bordered'
                      classNames={{
                        input: 'text-gray-700',
                        label: 'text-gray-600',
                      }}
                    />
                    <Input
                      label={t('capacity')}
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
                  <h3 className='text-lg font-semibold text-gray-900'>{t('yourInformation')}</h3>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      {...register('fullName', {
                        required: t('fullNameRequired'),
                        minLength: {
                          value: 2,
                          message: t('nameMinLength'),
                        },
                      })}
                      label={t('fullName')}
                      placeholder={t('enterFullName')}
                      isInvalid={!!errors.fullName}
                      errorMessage={errors.fullName?.message}
                      variant='bordered'
                      startContent={<User className='h-4 w-4 text-gray-400' />}
                      isRequired
                    />

                    <Input
                      {...register('companyName', {
                        required: t('companyNameRequired'),
                        minLength: {
                          value: 2,
                          message: t('companyNameMinLength'),
                        },
                      })}
                      label={t('companyName')}
                      placeholder={t('enterCompanyName')}
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
                        required: t('emailRequired'),
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t('invalidEmail'),
                        },
                      })}
                      label={t('emailAddress')}
                      placeholder={t('enterEmailAddress')}
                      type='email'
                      isInvalid={!!errors.emailAddress}
                      errorMessage={errors.emailAddress?.message}
                      variant='bordered'
                      startContent={<Mail className='h-4 w-4 text-gray-400' />}
                      isRequired
                    />

                    <Input
                      {...register('phoneNumber', {
                        required: t('phoneRequired'),
                        pattern: {
                          value: /^[+]?[\d\s\-$$$$]+$/,
                          message: t('invalidPhone'),
                        },
                      })}
                      label={t('phoneNumber')}
                      placeholder={t('enterPhoneNumber')}
                      isInvalid={!!errors.phoneNumber}
                      errorMessage={errors.phoneNumber?.message}
                      variant='bordered'
                      startContent={<Phone className='h-4 w-4 text-gray-400' />}
                      isRequired
                    />
                  </div>

                  <Textarea
                    {...register('message', {
                      required: t('messageRequired'),
                      minLength: {
                        value: 10,
                        message: t('messageMinLength'),
                      },
                      maxLength: {
                        value: 500,
                        message: t('messageMaxLength'),
                      },
                    })}
                    label={t('message')}
                    placeholder={t('messagePlaceholder')}
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
              <Button color='danger' variant='light' onPress={handleClose} isDisabled={isPending}>
                {t('cancel')}
              </Button>
              <Button
                color='primary'
                type='submit'
                isLoading={isPending}
                isDisabled={!isValid}
                className='bg-gray-900 text-white hover:bg-gray-800'
              >
                {t('sendInquiry')}
              </Button>
            </ModalFooter>
          </form>
        </>
      </ModalContent>
    </Modal>
  )
}
